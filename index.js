const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.get('/register', (req, res) => {
    res.render('register');
})

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

//define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

app.listen(3000 || 3306, () =>
  console.log('Server ON: http://localhost:3000')
);
