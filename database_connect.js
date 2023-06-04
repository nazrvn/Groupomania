const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.port
});

db.connect( (error) => {
    if(error) { console.log(error) }
    else { console.log('MySql Connected...') }
});

db.on('error', (err) => {
    console.error('Database connection error:', err);
});

module.exports = db