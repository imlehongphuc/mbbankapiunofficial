import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import fs from "fs";
import path from "path";
import cryptoNode from "crypto";
import { JSDOM } from "jsdom";
import wasm from "./loadWasm.js"; // Assuming loadWasm.js is in the same directory and correctly loads wasm

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));

const USERNAME_CLIENT = process.env.username; // Lấy từ biến môi trường (Vercel Environment Variables)
const PASSWORD_CLIENT = process.env.password; // Lấy từ biến môi trường (Vercel Environment Variables)

const auth = "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm"; // Static auth - check if this should be dynamic or env var

// Check for username and password at the beginning of the handler function
async function mbbankLogin() {
    if (!USERNAME_CLIENT || !PASSWORD_CLIENT) {
        console.error('Error: Please fill in your username and password in Vercel Environment Variables.');
        return { success: false, error: 'Username and password environment variables are not set.' };
    }

    try {
        console.log('Username and password are valid. Proceeding with login.');

        // Ensure main.wasm exists (assuming it's in the same directory in Vercel deployment)
        const wasmFilePath = path.resolve("./main.wasm"); // Assuming main.wasm is in the root of your Vercel project
        if (!fs.existsSync(wasmFilePath)) {
            console.log("Downloading main.wasm...");
            await downloadFile("https://online.mbbank.com.vn/assets/wasm/main.wasm", wasmFilePath);
            console.log("main.wasm downloaded successfully.");
        } else {
            console.log("main.wasm already exists.");
        }


        // Function to download file (modified to accept filepath)
        async function downloadFile(url, filePath) {
            const response = await client({
                url,
                method: "GET",
                responseType: "stream",
            });
            let filename = "";
            const disposition = response.headers["content-disposition"];
            if (disposition && disposition.includes("attachment")) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, "");
                }
            }
            if (!filename) {
                filename = path.basename(url);
            }
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });
        }


        // Get HTML content to extract script URL
        const htmlContent = await client.get("https://online.mbbank.com.vn/pl/login", {
            headers: {
                accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "vi-VN,vi;q=0.9",
                "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        const dom = new JSDOM(htmlContent.data);
        const allScripts = dom.window.document.querySelectorAll('script[type="module"]');
        const matchingScript = Array.from(allScripts).find((script) =>
            /^\/main\.\w+\.js$/.test(script.getAttribute("src"))
        );

        if (!matchingScript) {
            console.error("Error: Main script URL not found on login page.");
            return { success: false, error: 'Main script URL not found on login page.' };
        }


        // Captcha Image
        const captchaResponse = await client.post(
            "https://online.mbbank.com.vn/api/retail-web-internetbankingms/getCaptchaImage",
            {
                refNo: String(Date.now()), // Generate dynamic refNo
                deviceIdCommon: "ms7jhh48-mbib-0000-0000-2024071018571948", // Consider making deviceIdCommon dynamic if needed
                sessionId: "",
            },
            {
                headers: {
                    Authorization: auth,
                    accept: "application/json, text/plain, */*",
                    "content-type": "application/json",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                },
            }
        );

        const base64Image = captchaResponse.data.imageString;

        // FUNCTION SOLVING CAPTCHA (moved inside for scope, can be outside if needed)
        async function solveCaptcha(base64Image) {
            const url = "http://103.72.96.214:8277/api/captcha/mbbank"; //External Captcha Solving Service - Ensure reliable
            const headers = {
                "Content-Type": "application/json",
            };
            const payload = JSON.stringify({ base64: base64Image });

            try {
                const response = await fetch(url, {
                    method: "POST",
                    headers: headers,
                    body: payload,
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Captcha API failed. Status: ${response.status}, Response: ${errorText}`);
                }

                const result = await response.json();

                if (!result || result.status !== "success" || !result.captcha) {
                    throw new Error(`Invalid captcha API response: ${JSON.stringify(result)}`);
                }
                return result.captcha;
            } catch (error) {
                console.error("Error solving captcha:", error.message);
                throw error; // Re-throw to be caught in the main try-catch
            }
        }


        const captchaSolution = await solveCaptcha(base64Image);

        const request = {
            userId: USERNAME_CLIENT,
            password: cryptoNode.createHash("md5").update(PASSWORD_CLIENT).digest("hex"),
            captcha: captchaSolution,
            ibAuthen2faString: "c722fa8dd6f5179150f472497e022ba0", // Static 2FA string -  Potentially needs dynamic handling
            sessionId: null,
            refNo: String(Date.now()), // Dynamic refNo
            deviceIdCommon: "ms7jhh48-mbib-0000-0000-2024071018571948", // Consider dynamic deviceIdCommon
        };


        const dataEnc = await wasm(fs.readFileSync(wasmFilePath), request, "0"); // Load wasm from file

        // Login API Call
        const res = await client
            .post(
                "https://online.mbbank.com.vn/api/retail_web/internetbanking/v2.0/doLogin",
                {
                    dataEnc,
                },
                {
                    headers: {
                        accept: "application/json, text/plain, */*",
                        "accept-language": "vi-VN,vi;q=0.9",
                        app: "MB_WEB",
                        authorization: auth,
                        "content-type": "application/json; charset=UTF-8",
                        "elastic-apm-traceparent": "00-2f346e62082f1d9b71c22fb4ae20760f-2f2c02091e76c71f-01", // Static traceparent - Could be dynamic if needed
                        refno: String(Date.now()), // Dynamic refNo
                        "sec-ch-ua": '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": '"Windows"',
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-request-id": String(Date.now()), // Dynamic x-request-id
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                    },
                }
            )
            .catch(e => {
                console.error("Login request error:", e.message);
                return { data: { error: e.message } }; // Return error data in case of axios error
            });

        const responseData = res.data;

        if (responseData && responseData.sessionId) {
            const sessionId = responseData.sessionId;
            console.log('Login successful, Session ID:', sessionId);
            return { success: true, sessionId: sessionId }; // Successful login JSON response
        } else {
            console.log('Login failed or Session ID not found.');
            return { success: false, error: responseData.error || "Login failed, session ID not found.", responseData }; // Failed login JSON response with error details
        }

    } catch (error) {
        console.error("Main execution error:", error);
        return { success: false, error: error.message }; // General error JSON response
    }
}


// Vercel Function Handler (for API endpoint)
export default async function handler(req, res) {
    if (req.url === '/hellolickmydick') {
        if (req.method === 'GET') {
            const loginResult = await mbbankLogin();

            if (loginResult.success) {
                return res.status(200).json({ success: true, sessionId: loginResult.sessionId });
            } else {
                return res.status(500).json({ success: false, error: loginResult.error, details: loginResult.responseData }); // Include details for debugging
            }
        } else {
            return res.status(405).json({ success: false, error: 'Method not allowed. Use GET for /hello.' });
        }
    } else {
        res.writeHead(302, { 'Location': 'https://pornhub.com' });
        res.end();
    }
                }
