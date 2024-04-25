const express = require('express');
const authRouter = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// User signup route
authRouter.post('/signup', async (req, res, next) => {
    try {
        // Check if the email already exists
        const userCheck = await User.findOne({ email: req.body.email });

        if (userCheck) {
            res.status(403);
            return next(new Error('Email already in use, did you mean to login?'));
        }

        // Password validation: Check if the password meets requirements
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
        if (!passwordRegex.test(req.body.password)) {
            res.status(400);
            return next(new Error('Password must contain at least one uppercase letter and one number.'));
        }

        // Password length validation: Check if the password length is at least 8 characters
        if (req.body.password.length < 8) {
            res.status(400);
            return next(new Error('Password must be at least 8 characters long.'));
        }

        // Date of birth validation: Check if the user is at least 18 years old
        const dob = new Date(req.body.dob);
        const today = new Date();
        const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        if (dob >= eighteenYearsAgo) {
            res.status(400);
            return next(new Error('User must be at least 18 years old.'));
        }

        // Create a new user
        const newUser = new User(req.body);
        // Save the user (which triggers the pre-save hook to generate confirmation token and send email)
        await newUser.save();

        // Respond with a success message
        return res.status(201).send({ message: 'User created. Check your email for confirmation.' });
    } catch (err) {
        // Handle errors
        res.status(500);
        return next(err);
    }
});

// User login route
authRouter.post('/login', async (req, res, next) => {
    try {
        const userCheck = await User.findOne({ email: req.body.email })

        if (!userCheck) {
            res.status(403)
            return next(new Error('Email or Password is incorrect.'))
        }

        if (!userCheck.emailConfirmed) {
            res.status(403);
            return next(new Error('Email not confirmed. Please check your email for confirmation instructions.'));
        }

        const passwordCheck = await userCheck.checkPassword(req.body.password)
        if (!passwordCheck) {
            res.status(403)
            return next(new Error('Email or Password is incorrect.'))
        }
        const token = jwt.sign(userCheck.withoutPassword(), process.env.SECRET)
        return res.status(200).send({ user: userCheck.withoutSensitiveInfo(), token })
    } catch (err) {
        res.status(500)
        return next(err)
    }
});

// Confirm email route
authRouter.get('/confirm-email/:token', async (req, res) => {
    try {
        const token = req.params.token;
        if (!token) {
            return res.status(400).send('Token is missing.');
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.EMAIL_CONFIRM_SECRET);
        const user = await User.findOne({ email: decodedToken.email });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        // Update emailConfirmed field if the user exists
        user.emailConfirmed = true;
        await user.save();

        // Redirect the user to the home page
        return res.redirect('http://127.0.0.1:5173/email-confirmed'); // Change the URL to your home page URL
    } catch (error) {
        return res.status(400).send('Invalid or expired token.');
    }
});

// Update user information for first time login
authRouter.put('/setup/:userId', async(req, res, next) => {
    try {
        console.log(req.body)
        const updatedUser = await User.findOneAndUpdate(
            {_id: req.params.userId},
            req.body,
            {new: true}
        )

        return res.status(201).send(updatedUser)
    } catch (err) {
        res.status(500)
        return next(err)
    }
});

module.exports = authRouter;
