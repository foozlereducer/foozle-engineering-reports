const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'You are almost cool... go to users/cool!' });
});

router.get('/cool', function(req, res, next) {
  res.render('cool', { title: 'Now you are cool' });
});





module.exports = router;
