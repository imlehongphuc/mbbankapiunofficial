# MBBANK UNOFFICIAL API

**UNOFFICIAL MBBANK API - MODIFIED BY MSTRVN.DEV**  
**Original from:** [https://github.com/thedtvn/MBBank](https://github.com/thedtvn/MBBank)

## MBBank API Integration

### Overview
The MBBank API provides seamless access to MBBank's services, allowing developers to interact with banking operations programmatically. This API enables the management of account transactions, balance retrieval, and session management, ensuring a smooth and efficient user experience. It is designed to make banking tasks easier to integrate into custom applications while maintaining security and flexibility.

### Features
- **Login Authentication**: Secure login using username, password, and captcha to initiate the session.
- **Account Balance Retrieval**: Fetch real-time balance information from the account.
- **Transaction History**: Retrieve detailed transaction history, filtered by date range and account number.
- **Session Management**: Generate and manage session IDs for secure interactions.
- **Data Encryption**: Ensures sensitive information, such as account details, is encrypted during API requests.

### Endpoints

#### 1. POST /login
**Description**: Authenticates the user and initiates a session.  
**Request Body**:
- `username`: User's username
- `password`: User's password
- `captcha`: Captcha solution for verification

**Response**:  
Returns a session ID upon successful login.

---

#### 2. GET /balance
**Description**: Fetches the current balance of the logged-in user.  
**Query Parameters**:
- `sessionId`: The session ID from the login response.

**Response**:  
Returns the current balance of the account.

---

#### 3. GET /transactions
**Description**: Retrieves transaction history based on a specified date range and account number.  
**Query Parameters**:
- `sessionId`: The session ID from the login response.
- `startDate`: Start date for the transaction history (format: `YYYY-MM-DD`).
- `endDate`: End date for the transaction history (format: `YYYY-MM-DD`).
- `accountNo`: Account number to retrieve transactions for.

**Response**:  
Returns a list of transactions in the specified date range.

---

### Authentication
The MBBank API utilizes secure token-based authentication. After successfully logging in with your username, password, and captcha, you will receive a session ID that must be included in subsequent requests.

**Example**: Get SessionID API  
```bash
GET /sessionId
Installation
Requirements
Node.js v20 or later
npm (Node Package Manager)
Steps
Clone the repository:
bash
Copy code
git clone https://github.com/imlehongphuc/mbbankapiunofficial.git
Navigate to the project directory:
bash
Copy code
cd mbbank-api
Install dependencies:
bash
Copy code
npm install
Configure your environment variables for secure data access:
USERNAME_CLIENT
PASSWORD_CLIENT
Any other required credentials
Run the application:
bash
Copy code
npm start
Security
All sensitive data, such as passwords and session IDs, are transmitted securely using HTTPS.
Captcha is used as an additional layer of security during login.
Passwords are not stored in plaintext and should be handled securely in your environment.
Contributing
We welcome contributions! Feel free to fork the repository and submit pull requests. Please ensure that any contributions adhere to the following guidelines:

Write clear, concise commit messages.
Include tests for new functionality or fixes.
Follow the code style and project structure.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Impressive Features in the README:
Security Focus: Emphasizes encryption and session management, which builds trust.
Clear API Documentation: Lists the endpoints, example requests, and responses, which help developers understand how to use the API quickly.
Installation Instructions: Straightforward steps for setting up the project.
Contribution Guidelines: Encourages collaboration and open-source development.
vbnet
Copy code

This README covers key points for developers to understand, use, and contribute to your project effectively.
