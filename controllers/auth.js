import express from "express";
import bcrypt from 'bcrypt';

import User from '../models/user.js'

const authRouter = express.Router();

authRouter.get('/sign-up', async (req, res) => {
  res.render('auth/sign-up.ejs', {
    user: req.session.user
  });
});

authRouter.get('/sign-in', async (req, res) => {
  res.render('auth/sign-in.ejs', {
    user: req.session.user
  });
});

authRouter.post('/sign-up', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });

    if (user) {
      return res.send('User already exists');
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send('Password does not match Confirm Password');
    }

    // Hash the provided password using bcrypt, salt 10 times
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;

    // Create a new User
    const newUser = await User.create(req.body);
    
    res.send(`
      <h1>Thanks for signing up, ${newUser.username}!</h1>
      <a href="/">Go to Home Page, you can now sign in!</a>
    `);
  } catch (error) {
    console.error('Error during sign-up:', error);
    res.status(500).send('Internal Server Error.');
  }
});

authRouter.post('/sign-in', async (req, res) => {
  try {
    // Check if the user exists
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
      return res.send('User either does not exist, or you have provided the wrong credentials');
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.send('Error, the password was wrong!');
    }

    req.session.user = {
      username: user.username,
      _id: user._id
    };

    res.redirect('/');
  } catch (error) {
    console.error('Was not able to sign in', error);
    res.status(500).send('Internal Server Error.');
  }
});

authRouter.get('/sign-out', async (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

export default authRouter;
