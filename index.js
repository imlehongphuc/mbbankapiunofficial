import axios from "axios";
import { wrapper } from "axios-cookiejar-support";
import { CookieJar } from "tough-cookie";
import fs from "fs";
import path from "path";
import cryptoNode from "crypto";
import { JSDOM } from "jsdom";
import wasm from "./loadWasm.js";

const jar = new CookieJar();
const client = wrapper(axios.create({ jar }));
const USERNAME_CLIENT = '';  // Replace with actual username or fetch dynamically
const PASSWORD_CLIENT = '';  // Replace with actual password or fetch dynamically

if (!USERNAME_CLIENT || !PASSWORD_CLIENT) {
  console.log('Please fill your username and password');
  process.exit(1);  // Exit the program with an error code (1)
} else {
  // Proceed with the logic if both username and password are provided
  console.log('Username and password are valid.');
}


async function downloadFile(url) {
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
  const filePath = path.resolve(".", filename);
  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
console.log("Connecting the main function encryption...");
console.log(" ");
console.log(" ");
if (!fs.existsSync("./main.wasm")) {
  await downloadFile("https://online.mbbank.com.vn/assets/wasm/main.wasm");
}

// Get HTML content
const htmlContent = await client.get("https://online.mbbank.com.vn/pl/login", {
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "vi-VN,vi;q=0.9",
    "sec-ch-ua":
      '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  },
});

const dom = new JSDOM(htmlContent.data);

const allScripts = dom.window.document.querySelectorAll(
  'script[type="module"]'
);

const matchingScript = Array.from(allScripts).find((script) =>
  /^\/main\.\w+\.js$/.test(script.getAttribute("src"))
);

// connected the main function encryption
console.log("Connected the main function encryption ✓✓✓✓");
console.log(" ");
console.log(" ");
const auth = "Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm";

// Captcha Image
const captchaResponse = await client.post(
  "https://online.mbbank.com.vn/api/retail-web-internetbankingms/getCaptchaImage",
  {
    refNo: "2024071018571949",
    deviceIdCommon: "ms7jhh48-mbib-0000-0000-2024071018571948",
    sessionId: "",
  },
  {
    headers: {
      Authorization: auth,
      accept:
        "application/json, text/plain, */*",
      "content-type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    },
  }
);

const base64Image = captchaResponse.data.imageString;
// FUNCTION SOLVING CAPTCHA
async function solveCaptcha(base64Image) {
  const url = "http://103.72.96.214:8277/api/captcha/mbbank";
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
      const errorText = await response.text(); // Capture detailed error response if available
      throw new Error(
        `Failed to send captcha to another API. Status: ${response.status}, Response: ${errorText}`
      );
    }

    const result = await response.json();

    if (!result || result.status !== "success" || !result.captcha) {
      throw new Error(
        `Invalid response received from captcha-solving API: ${JSON.stringify(result)}`
      );
    }

    return result.captcha; // Adjusted to return the "captcha" field
  } catch (error) {
    console.error("Error in solveCaptcha:", error.message);
    throw error; // Re-throw error to propagate it to the caller
  }
}




const captchaSolution = await solveCaptcha(base64Image);

const request = {
  userId: USERNAME_CLIENT,
  password: cryptoNode.createHash("md5").update(PASSWORD_CLIENT).digest("hex"),
  captcha: captchaSolution, // Use the solved captcha
  ibAuthen2faString: "c722fa8dd6f5179150f472497e022ba0",
  sessionId: null,
  refNo: "0123456789-2024071018223800",
  deviceIdCommon: "ms7jhh48-mbib-0000-0000-2024071018571948",
};

const dataEnc = await wasm(fs.readFileSync("./main.wasm"), request, "0");

// Display the encrypted data from users log in information
console.log("All data have been encrypted ✓✓✓✓✓");
// console.log("The encrypted data are: ", dataEnc);
console.log(" ");
console.log(" ");
// Login
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
        "elastic-apm-traceparent":
          "00-2f346e62082f1d9b71c22fb4ae20760f-2f2c02091e76c71f-01",
        refno: "0123456789-2024071019251711",
        "sec-ch-ua":
          '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-request-id": "0123456789-2024071019251711",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
      },
    }
  )
  .catch((e) => ({ data: e.message }));
  const responseData = res.data;

  async function extractSessionId(data) {
    return data.sessionId || null;
  }
  
  async function getSessionId() {
    const sessionId = await extractSessionId(responseData);
    if (sessionId) {
      console.log('Session ID:', sessionId);
      console.log(" ");
      // Create the JSON object to be written to file
      const jsonData = {
        sessionId: sessionId,
        status: 'Success',
        timestamp: new Date().toISOString() // Add timestamp or other details if needed
      };

      // Write the JSON object to a file with pretty formatting
      fs.writeFileSync('sessionId.json', JSON.stringify(jsonData, null, 2));
      console.log('Successfully created session and saved to file sessionId.json');
    } else {
      console.log('Session ID not found.');
    }

  } 
  
  
  getSessionId();
  