```markdown
# Email Verification System with Node.js and React

This project implements an email verification system using Node.js and React. It utilizes nodemailer with Ethereal email service for sending verification emails and MongoDB for storing user data.

## Overview

The email verification process involves the following steps:

1. **User Signup**: When a user signs up, a confirmation email is sent to the provided email address.
2. **Email Confirmation Link**: The email contains a link to confirm the user's email address.
3. **Confirmation Endpoint**: Clicking the confirmation link directs the user to an endpoint on the server.
4. **Token Verification**: The server verifies the token sent in the confirmation link.
5. **Update User Data**: If the token is valid, the server updates the user's emailConfirmed field in the database.
6. **User Notification**: Once the email address is confirmed, the user is notified and can proceed with logging in.

## Cloning the Repository

To get started with the project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/jordanburger22/email-verification.git
    ```

2. Navigate to the project directory:

    ```bash
    cd email-verification
    ```

3. Remove the existing Git history:

    ```bash
    rm -rf .git
    ```

4. Initialize a new Git repository:

    ```bash
    git init
    ```

## Ethereal Email Account Setup

To send verification emails in a test environment, you'll need to sign up for an Ethereal email account. Here's how:

1. Go to the [Ethereal website](https://ethereal.email/).
2. Click on "Sign Up" to create a new account.
3. Follow the instructions to complete the signup process.
4. Once logged in, note down your Ethereal email address and password, as you'll need them to configure nodemailer in your project.

## MongoDB Setup

You'll also need a MongoDB database to store user data. Follow these steps to set up a MongoDB database:

1. Sign up for a MongoDB account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new cluster and follow the instructions to configure it.
3. Once your cluster is set up, create a new database and note down its connection string.

## Environment Variables Setup in VSCode

To set up environment variables within VSCode, follow these steps:

1. **Create a `.env` file**: 
   - In the file explorer sidebar of VSCode, right-click on the root directory of your project.
   - Choose "New File" and name it `.env`.

2. **Add Environment Variables**:
   - Open the `.env` file.
   - Add the following environment variables:

    ```plaintext
    # MongoDB Connection String
    MONGO_URI=your_mongodb_connection_string_here

    # Ethereal Email Account
    ETHEREAL_EMAIL=your_ethereal_email_address_here
    ETHEREAL_PASSWORD=your_ethereal_password_here

    # Secret for JWT
    SECRET=your_secret_here

    # Port number
    PORT= your_port_number
    ```

    Replace `your_mongodb_connection_string_here` with your MongoDB Atlas connection string, `your_ethereal_email_address_here` and `your_ethereal_password_here` with the credentials of your Ethereal email account, `your_secret_here` with your JWT secret, and `3000` with the desired port number.

3. **Save the `.env` file**.

## Adding a `.gitignore` File in VSCode

To add a `.gitignore` file directly within VSCode, follow these steps:

1. **Create a `.gitignore` file**:
   - In the file explorer sidebar of VSCode, right-click on the root directory of your project.
   - Choose "New File" and name it `.gitignore`.

2. **Specify Files to Ignore**:
   - Open the `.gitignore` file.
   - Add the following line to ignore the `.env` file:

    ```plaintext
    # Ignore .env file
    .env
    ```

3. **Save the `.gitignore` file**.

By following these steps, you'll set up environment variables securely within VSCode and ensure that sensitive information is not exposed in your version control system.


## Code Breakdown

The key files and their functionalities in the project are as follows:

- **Server-side**:
  - `models/user.js`: Defines the user schema in MongoDB, including fields for email confirmation.
  - `routes/auth.js`: Contains routes for user signup, login, email confirmation, and additional user information setup.
  - `server.js`: Initializes the Express server and connects it to MongoDB. Configures nodemailer for sending emails with Ethereal.

- **Client-side**:
  - `src/components/SignupForm.js`: Component for user signup form with email, password, and date of birth fields.
  - `src/components/CheckEmail.js`: Component to display a confirmation message after successful user registration.
  - `src/context/UserContext.js`: Context for managing user authentication state and handling API requests.
