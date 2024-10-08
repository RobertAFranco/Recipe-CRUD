const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan'); // Uncomment if you want logging
const session = require('express-session');

const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

const authController = require('./controllers/auth.js');
const recipesController = require('./controllers/recipes.js');
const usersController = require('./controllers/users.js');

const port = process.env.PORT || '9876';

const path = require('path');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(morgan('dev')); // Uncomment if you want logging
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Middleware for user data
app.use(passUserToView);

// Routes
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// Use the EJS view engine
app.set('view engine', 'ejs');

// Route handlers
app.use('/auth', authController);
app.use('/recipes', isSignedIn, recipesController); 
app.use('/middleware', isSignedIn);
app.use('/users', isSignedIn, usersController);

// Global error handling (optional, but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});

