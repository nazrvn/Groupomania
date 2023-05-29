const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');

const publicDirectory = path.join(__dirname, './public');

const pagesRoutes = require('./routes/pagesRoutes');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(publicDirectory));
app.use(express.static("images"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/', pagesRoutes);
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);

app.listen(3000, () =>
  console.log('Server ON: http://localhost:3000')
);