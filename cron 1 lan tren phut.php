<?php
// Configuration
include 'e.php'; //File Dã lưu SessionID
date_default_timezone_set('Asia/Ho_Chi_Minh');

$taikhoanmb = ''; //Tài khoản dùng để dăng nhập vào MBBANK
$deviceIdCommon = 'ms7jhh48-mbib-0000-0000-2024071018571948';
$sotaikhoanmb = ''; // STK dùng để check LSGD MBBANK

// Generate refNo
$timestamp = date("YmdHis");
$refNo = $taikhoanmb . "-" . $timestamp;

// API endpoint
$url = 'https://online.mbbank.com.vn/api/retail-transactionms/transactionms/get-account-transaction-history';

// Request data
$data = [
    "accountNo" => $sotaikhoanmb,
    "fromDate" => date("d/m/Y"),
    "toDate" => date("d/m/Y"),
    "sessionId" => $sessionId,
    "refNo" => $refNo,
    "deviceIdCommon" => $deviceIdCommon
];

// Initialize cURL
$ch = curl_init();

// Set cURL options
curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($data),
    CURLOPT_HTTPHEADER => [
        'Accept: application/json, text/plain, */*',
        'Accept-Language: en-US,en;q=0.9',
        'APP: MB_WEB',
        'Authorization: Basic RU1CUkVUQUlMV0VCOlNEMjM0ZGZnMzQlI0BGR0AzNHNmc2RmNDU4NDNm',
        'Cache-Control: no-cache',
        'Content-Type: application/json; charset=UTF-8',
        'DeviceId: ' . $deviceIdCommon,
        'Origin: https://online.mbbank.com.vn',
        'Pragma: no-cache',
        'Referer: https://online.mbbank.com.vn/information-account/source-account',
        'RefNo: ' . $refNo,
        'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
        'X-Request-Id: ' . $refNo
    ]
]);

// Execute cURL request
$response = curl_exec($ch);

// Check for errors
if (curl_errno($ch)) {
    echo json_encode(['error' => curl_error($ch)], JSON_PRETTY_PRINT);
    exit;
}

// Close cURL
curl_close($ch);

// Decode and re-encode JSON with pretty print
$jsonData = json_decode($response, true);
if (json_last_error() === JSON_ERROR_NONE) {
    header('Content-Type: application/json');
    echo json_encode($jsonData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} else {
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Invalid JSON response',
        'raw_response' => $response
    ], JSON_PRETTY_PRINT);
}
?>
