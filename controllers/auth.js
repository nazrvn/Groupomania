const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const db = require('../database_connect');

/* exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm } = req.body;

  db.query('SELECT * FROM users WHERE role = "admin"', async (error, results) => {
    if (error) {
      console.log(error);
      return res.render('register', {
        message: 'Error checking for admin'
      });
    }

    if (results.length > 0) {
      // SI ADMIN EXISTE, L'UTTILISATEUR PREND LE ROLE DE user
      const role = 'user';

      db.query('INSERT INTO users SET ?', { name, email, password, role }, (error, results) => {
          if (error) {
            console.log(error);
            return res.render('register', {
              message: 'Error registering user'
            });
          } else {
            return res.render('register', {
              message: 'User Registered!'
            });
          }
        }
      );
    } else {
      // SI L'ADMIN EXISTE PAS, L'UTTILISATEUR PREND LE ROLE admin
      const role = 'admin';

      db.query( 'INSERT INTO users SET ?', { name, email, password, role }, (error, results) => {
          if (error) {
            console.log(error);
            return res.render('register', {
              message: 'Error registering admin'
            });
          } else {
            return res.render('register', {
              message: 'Admin Registered!'
            });
          }
        }
      );
    }
  });
}

exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm } = req.body;

  db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
      if(error){
          console.log(error)
      }
      if (results.length > 0){
          return res.render('register', {
              message: 'That email is already in use !'
          })
      } else if (password !== passwordConfirm){
          return res.render('register', {
              message: 'Passwords do not match !'
          });
      }

      let hashedPassword = await bcrypt.hash(password, 8);
      console.log(hashedPassword);

      // par default le role est égal à User
      //const role = 'User';

      const role = req.body.role || 'user';

      db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword, role: role }, (error, results) => {
          if(error){
              console.log(error);
          } else {
              //console.log(results);
              return res.render('register', {
                  message: 'User Registered !'
              });
          }
      });
  
  });
} */

exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm } = req.body;

  db.query('SELECT * FROM users WHERE role = "admin"', async (error, results) => {
    if (error) {
      console.log(error);
      return res.render('register', {
        message: 'Error checking for admin'
      });
    }

    if (results.length > 0) {
      // SI ADMIN EXISTE, L'UTILISATEUR PREND LE RÔLE DE user
      const role = 'user';

      db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
          console.log(error);
        }
        if (results.length > 0) {
          return res.render('register', {
            message: 'That email is already in use!'
          });
        } else if (password !== passwordConfirm) {
          return res.render('register', {
            message: 'Passwords do not match!'
          });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword, role }, (error, results) => {
          if (error) {
            console.log(error);
            return res.render('register', {
              message: 'Error registering user'
            });
          } else {
            return res.render('register', {
              message: 'User Registered!'
            });
          }
        });
      });
    } else {
      // SI L'ADMIN N'EXISTE PAS, L'UTILISATEUR PREND LE RÔLE admin
      const role = 'admin';

      db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
          console.log(error);
        }
        if (results.length > 0) {
          return res.render('register', {
            message: 'That email is already in use!'
          });
        } else if (password !== passwordConfirm) {
          return res.render('register', {
            message: 'Passwords do not match!'
          });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword, role }, (error, results) => {
          if (error) {
            console.log(error);
            return res.render('register', {
              message: 'Error registering admin'
            });
          } else {
            return res.render('register', {
              message: 'Admin Registered!'
            });
          }
        });
      });
    }
  });
};

exports.login = async (req, res) => {
    try {
        //console.log(req.body);
      const { email, password } = req.body;
  
      if( !email || !password ) {
        return res.status(400).render('login', {
          message: 'Please provide an email and password'
        })
      }
  
      db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if( !results || !(await bcrypt.compare(password, results[0].password)) ) {
          res.status(401).render('login', {
            message: 'Email or Password is incorrect'
          })
        } else {
          const id = results[0].userId;
  
          const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
          });
  
          const cookieOptions = {
            expires: new Date(
              Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
            ),
            httpOnly: true
          }
  
          res.cookie('jwt', token, cookieOptions );
          res.status(200).redirect("/profile");
        }
      })
  
    } catch (error) {
      console.log(error);
    }
}

exports.isLoggedIn = async (req, res, next) => {

    //console.log(req.cookies);
    try {
      if(req.cookies.jwt){
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET );

                //console.log(decoded);

            // 2) check is user still exists
            db.query('SELECT * FROM users WHERE userId = ?', [decoded.id], (error, results) => {
              //console.log(results)

              if(!results){
                return next();
              }

              req.user = results[0];
              return next();
            });
        } catch (error){
            return next();
        }
    } else {
        next();
    }
    } catch (error){ 
      console.log(error)
    }
    
}

exports.logout = async (req, res) => {

  res.cookie('jwt', 'logout', {
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true
  });

  res.status(200).redirect('/')

}