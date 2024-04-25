const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Load Ethereal credentials from environment variables
const etherealUsername = process.env.ETHEREAL_USERNAME;
const etherealPassword = process.env.ETHEREAL_PASSWORD;

// Create a function to configure and return the nodemailer transporter using ethereal credentials
async function getEtherealTransporter() {
    // Create nodemailer transporter using ethereal credentials
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: etherealUsername,
            pass: etherealPassword
        }
    });
}

// Create the user schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                // Email validation using a regular expression
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address.`
        }
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                // Check if password contains at least one uppercase letter, one number, and has a minimum length of 8 characters
                return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
            },
            message: props => `${props.value} is not a valid password. Password must contain at least one uppercase letter, one number, and have a minimum length of 8 characters.`
        }
    },    
    emailConfirmed: {
        type: Boolean,
        default: false
    },
    emailConfirmToken: {
        type: String,
        default: null
    },
    emailConfirmTokenExpires: {
        type: Date,
        default: null
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    displayName: {
        type: String,
    },
    dob: {
        type: Date,
        required: true,
        validate: {
            validator: function (dob) {
                // Calculate age based on DOB
                const ageDiffMs = Date.now() - dob.getTime();
                const ageDate = new Date(ageDiffMs); // miliseconds from epoch
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                // Check if age is 18 or older
                return age >= 18;
            },
            message: props => `${props.value} is not a valid date of birth. User must be at least 18 years old.`
        }
    },
    userInfoSet: {
        type: Boolean,
        default: false
    }
});

// presave hook to encrypt user password on signup
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
        // Generate email confirmation token and set expiration time
        user.emailConfirmToken = jwt.sign({ email: user.email }, process.env.EMAIL_CONFIRM_SECRET);
        user.emailConfirmTokenExpires = new Date(Date.now() + 24 * 3600 * 1000); // 24 hours
        // Send confirmation email
        sendConfirmationEmail(user.email, user.emailConfirmToken);
        next();
    } catch (err) {
        return next(err);
    }
});

// method to check encrypted password on login
userSchema.methods.checkPassword = async function (passwordAttempt) {
    try {
        const isMatch = await bcrypt.compare(passwordAttempt, this.password);
        return isMatch;
    } catch (err) {
        throw err;
    }
};

// method to remove users password for token/sending the response
userSchema.methods.withoutPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

// method to remove sensitive information for token/sending the response
userSchema.methods.withoutSensitiveInfo = function() {
    const user = this.toObject();
    delete user.password;
    delete user.emailConfirmToken;
    delete user.emailConfirmTokenExpires;
    return user;
};

// Send confirmation email using Nodemailer with Ethereal transport
async function sendConfirmationEmail(email, token) {
    try {
        // Create nodemailer transporter using ethereal credentials
        const transporter = await getEtherealTransporter();

        // Configure mail options
        const mailOptions = {
            from: etherealUsername, // Use Ethereal email address as the sender
            to: email,
            subject: 'Confirm Your Email Address',
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Confirmation</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                            text-align: center;
                        }
                        .container {
                            max-width: 600px;
                            margin: 50px auto;
                            padding: 20px;
                            background-color: #fff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        h1 {
                            color: #333;
                        }
                        p {
                            margin-bottom: 20px;
                            color: #666;
                        }
                        a {
                            color: #007bff;
                            text-decoration: none;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h1>Email Confirmation</h1>
                        <p>Please click the button below to confirm your email address:</p>
                        <a href="http://localhost:8000/auth/confirm-email/${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; border-radius: 5px; text-decoration: none;">Confirm Email Address</a>
                    </div>
                </body>
                </html>
            `
        };

        // Send mail
        const info = await transporter.sendMail(mailOptions);

        // Log success message
        console.log('Confirmation email sent:', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        // Log error if sending email fails
        console.error('Error sending confirmation email:', error);
    }
}

module.exports = mongoose.model('User', userSchema);
