<?php

// URL Backend Vercel Host
$url = '';

// Đường dẫn tới file a.php mà bạn muốn lưu Session ID
$file_path = 'e.php';

// Sử dụng file_get_contents để truy cập URL và lấy dữ liệu JSON
$json_data = file_get_contents($url);

// Kiểm tra xem việc truy cập URL có thành công không
if ($json_data === false) {
    die("Không thể truy cập vào Vercel");
}

// Giải mã dữ liệu JSON
$data = json_decode($json_data, true);

// Kiểm tra xem việc giải mã JSON có thành công và dữ liệu có phải là mảng không
if ($data === null || !is_array($data)) {
    die("Failed. Null Format");
}

// Kiểm tra xem trường 'sessionId' có tồn tại trong dữ liệu JSON không
if (isset($data['sessionId'])) {
    $session_id = $data['sessionId'];

    // Định dạng nội dung để lưu vào file a.php dưới dạng biến PHP
    $php_variable_content = "<?php\n\n\$sessionId = '" . $session_id . "';\n";

    // Lưu nội dung đã định dạng vào file a.php.
    // file_put_contents() sẽ tự động ghi đè nội dung cũ nếu file đã tồn tại.
    $result = file_put_contents($file_path, $php_variable_content);

    // Kiểm tra xem việc lưu file có thành công không
    if ($result !== false) {
        echo "Success!";
    } else {
        die("Failed 1");
    }
} else {
    die("Failed 2");
}

?>
