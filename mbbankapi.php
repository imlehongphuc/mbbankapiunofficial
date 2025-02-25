<?php
date_default_timezone_set('Asia/Ho_Chi_Minh');
header("Content-Type: application/json");
class MBBANK
{
    public static $url = [
        'transaction' => 'https://online.mbbank.com.vn/api/retail-transactionms/transactionms/get-account-transaction-history',
    ];
    public static $taikhoanmb = null;
    private static $deviceIdCommon = null;
    private static $sessionId = null;
    public static $sotaikhoanmb = null;

    static public function setTK($data)
    {
        static::$taikhoanmb = $data;
    }

    static public function setDeviceId($data)
    {
        static::$deviceIdCommon = $data;
    }

    static public function setSTK($data)
    {
        static::$sotaikhoanmb = $data;
    }

    static public function setSessionId($data)
    {
        static::$sessionId = $data;
    }

    static public function getLSGD()
    {
        // Set your payload data
        $data = [
            'accountNo' => static::$sotaikhoanmb,
            'deviceIdCommon' => static::$deviceIdCommon,
            'fromDate' => date("d/m/Y", strtotime('-1 days')),
            'refNo' => static::$taikhoanmb . '-' . date("YmdHis") . '00',
            'sessionId' => static::$sessionId,
            'toDate' => date("d/m/Y"),
            'type' => 'ACCOUNT',
            'historyType' => 'DATE_RANGE',
            'historyNumber' => '',
        ];

        // Initialize cURL session
        $ch = curl_init(static::$url['transaction']);

        // Set cURL options
        
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json, text/plain, */*',
            'Accept-Language: en-US,en;q=0.9',
            'Authorization: Basic QURNSU46QURNSU4=',
            'Connection: keep-alive',
            'Content-Length: ' . strlen(json_encode($data)),
            'Content-Type: application/json; charset=UTF-8',
            'Deviceid: ' . static::$deviceIdCommon,
            'Host: online.mbbank.com.vn',
            'Origin: https://online.mbbank.com.vn',
            'Referer: https://online.mbbank.com.vn/information-account/source-account',
            'Refno: ' . static::$taikhoanmb . '-' . date("YmdHis") . '00',
            'Sec-Ch-Ua: "Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
            'Sec-Ch-Ua-Mobile: ?0',
            'Sec-Ch-Ua-Platform: "Windows"',
            'Cookie: MBAnalyticsaaaaaaaaaaaaaaaa_session_=HBFGCDDDCIBOOBGGKGCCMKKPMGFPIKBLFCGKBJGNDJLHFHHCFCEPGLMMIHHJCEDDOEODBKKDPMNFKFJHMHFACFEOCOEDJBKPKMMLGCIJLDAAKHNMBEIHAFEIMMCPAFGE; _gid=GA1.3.459245081.1705938332; BIGipServerk8s_KrakenD_Api_gateway_pool_10781=3441164554.7466.0000; JSESSIONID=6BFC18560C75E6BD9162C2ABE3C851DE; BIGipServerk8s_online_banking_pool_9712=3474718986.61477.0000; _gat_gtag_UA_205372863_2=1; _ga_T1003L03HZ=GS1.1.1706028133.27.1.1706028259.0.0.0; _ga=GA1.1.840270814.1693188398',
            'Sec-Fetch-Dest: empty',
            'Sec-Fetch-Mode: cors',
            'Sec-Fetch-Site: same-origin',
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
           
        ]);

        // Execute cURL session
        $response = curl_exec($ch);

        // Check for errors
        if (curl_errno($ch)) {
            echo 'Error: ' . curl_error($ch);
        }

        // Close cURL session
        curl_close($ch);
        echo decode_slashes(beautifyJson($response));
      
    }
}
//Function extract url string 
function decode_slashes($array) {
  if (is_array($array)) {
    foreach ($array as $key => $value) {
      $array[$key] = decode_slashes($value);
    }
  } else if (is_string($array)) {
    $array = str_replace('\\/', '/', $array);
    $array = str_replace('\\\\/', '/', $array); // Added this line
  }
  return $array;
}
function beautifyJson($response) {
    $jsonData = json_decode($response);

    // Check if JSON decoding was successful
    if (json_last_error() !== JSON_ERROR_NONE) {
        // JSON decoding error
        return false;
    } 

    if (isset($jsonData->postingDate) && isset($jsonData->transactionDate)) {
        // Beautify "postingDate"
        $postingDate = DateTime::createFromFormat('d/m/Y H:i:s', $jsonData->postingDate);
        $jsonData->postingDate = ($postingDate !== false) ? $postingDate->format('F j, Y g:i A') : 'Invalid date format';

        $transactionDate = DateTime::createFromFormat('d/m/Y H:i:s', $jsonData->transactionDate);
        $jsonData->transactionDate = ($transactionDate !== false) ? $transactionDate->format('F j, Y g:i A') : 'Invalid date format';
    }

    return json_encode($jsonData, JSON_PRETTY_PRINT);
}


// Initialization calls
MBBANK::setTK("");
MBBANK::setDeviceId("ms7jhh48-mbib-0000-0000-2024071018571948");
MBBANK::setSTK("");
MBBANK::setSessionId("");
MBBANK::getLSGD();