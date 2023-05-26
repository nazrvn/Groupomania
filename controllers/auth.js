const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const db = require('../database_connect');


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
}

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

// ADMIN
exports.addUser = async (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm } = req.body;

  try {
    const existingUser = await db.query('SELECT email FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.render('dashboard', {
        message: 'That email is already in use!'
      });
    } else if (password !== passwordConfirm) {
      return res.render('dashboard', {
        message: 'Passwords do not match!'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    db.query('INSERT INTO users SET ?', { name, email, password: hashedPassword }, (error, results) => {
      if (error) {
        console.log(error);
        return res.render('dashboard', {
          message: 'Error adding user'
        });
      } else {
        return res.redirect('/dashboard');
      }
    });
  } catch (error) {
    console.log(error);
    return res.render('dashboard', {
      message: 'An error occurred while adding the user'
    });
  }
}

exports.getUsers = async (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
      if (error) {
        throw error;
      } else {
      res.render('dashboard', { user: results });
      }
    });
}

exports.editUser = async (req, res) => {
  try {
    /* console.log(req.body);
    console.log(req.params.id); */

    const { name, email, password } = req.body;
    const userId = req.params.id;

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    db.query('UPDATE users SET name = ?, email = ?, password = ? WHERE userId = ?', [name, email, hashedPassword, userId], async (error, results) => {
      if (error) {
        throw error;
      } else {
        console.log(results);
        if (results.changedRows === 0) {
          // No rows were affected, indicating the user was not found
          return res.status(404).render('dashboard', { message: 'User not found' });
        } else {
          // Fetch the updated user data from the database
          db.query('SELECT * FROM users', (error, updatedResults) => {
            if (error) {
              throw error;
            } else {
              return res.redirect('/dashboard');
            }
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).render('dashboard', { message: 'Internal server error' });
  }
}

exports.deleteUser = (req, res) => {
  try {
    const userId = req.params.id;
    const sql = 'DELETE FROM users WHERE userId = ?';
    db.query(sql, [userId], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: 'An error occurred while deleting the user.' });
      } else {
        if (result.affectedRows === 0) {
          res.status(404).json({ error: 'User not found.' });
        } else {
          res.json({ message: 'User deleted successfully.' });
        }
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred while deleting the user.' });
  }
}