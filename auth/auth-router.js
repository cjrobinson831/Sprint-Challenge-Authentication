const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const secret = require('../config/secret');

const router = require('express').Router();

router.post('/register', (req, res) => {
  // implement registration

  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 15);
  user.password = hash;

  Users.addUsers(user)
    .then(addedUser => {
      res.status(201).json(addedUser);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error registering, Try again' });
    })
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;

  Users.findByUser({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = getToken(user);
        res.status(200).json({ message: `Logged in.`, token });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      };
    }).catch(err => {
      console.log(err)
      res.status(500).json({ message: 'Error logging in, Try again' });
    })
});

function getToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    jwtid: user.id
  };
  const options = {
    expiresIn: '2h',
  };
  return jwt.sign(payload, secret.jwtSecret, options);
}

module.exports = router;
