# MBBank API Không Chính Thức

Ứng dụng này sẽ đăng nhập vào tài khoản MBBANK và tạo ra sessionID để chạy ứng dụng.

**Cảnh báo:** API này không được hỗ trợ chính thức bởi MBBank. Việc sử dụng nó có thể vi phạm điều khoản dịch vụ của MBBank và dẫn đến việc tài khoản của bạn bị tạm ngưng. Hãy sử dụng nó một cách có trách nhiệm và chấp nhận rủi ro của riêng bạn.

## Triển Khai Trên Vercel

Dưới đây là các bước để triển khai API này trên Vercel:

1.  **Truy cập Vercel:**
    * Truy cập [https://vercel.com/](https://vercel.com/).
2.  **Đăng nhập hoặc tạo tài khoản:**
    * Đăng nhập bằng tài khoản hiện có của bạn hoặc tạo một tài khoản mới.
3.  **Tạo dự án Vercel mới:**
    * Nhấp vào nút "New Project".
4.  **Kết nối kho lưu trữ GitHub:**
    * Sao chép liên kết kho lưu trữ GitHub: [Github](https://github.com/imlehongphuc/mbbankapiunofficial/).
    * Dán liên kết vào Vercel để kết nối kho lưu trữ của bạn.
5.  **Thiết lập biến môi trường:**
    * Trong cài đặt dự án Vercel, hãy đi tới phần "Environment Variables".
    * Thêm hai biến môi trường sau:
        * `username`: Tên người dùng tài khoản MBBank của bạn.
        * `password`: Mật khẩu tài khoản MBBank của bạn.
    * **Quan trọng:** Hãy đảm bảo rằng thông tin đăng nhập MBBank bạn nhập là chính xác. Bạn có thể kiểm tra điều này bằng cách đăng nhập vào ứng dụng MBBank chính thức.
6.  **Triển khai lại dự án:**
    * Sau khi thiết lập các biến môi trường, hãy triển khai lại dự án Vercel của bạn để các thay đổi có hiệu lực.
7.  **Truy cập API:**
    * Sau khi triển khai thành công, Vercel sẽ cung cấp cho bạn một URL duy nhất cho API của bạn. Sử dụng URL này để truy cập các điểm cuối API.

## Lưu ý Quan Trọng

* Hãy thận trọng khi sử dụng thông tin đăng nhập MBBank của bạn. Tránh chia sẻ chúng với các nguồn không đáng tin cậy.
* Hãy có trách nhiệm khi sử dụng API này. Tránh sử dụng nó cho các hoạt động trái pháp luật hoặc vi phạm điều khoản dịch vụ của MBBank.

## Đóng Góp

Đóng góp và yêu cầu kéo được chào đón. Nếu bạn tìm thấy bất kỳ lỗi nào hoặc có đề xuất cải tiến, vui lòng tạo vấn đề hoặc yêu cầu kéo.

## Tuyên bố Từ chối Trách nhiệm

API này được cung cấp "nguyên trạng" mà không có bất kỳ bảo hành nào. Người đóng góp không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng API này (gần như không xảy ra).
