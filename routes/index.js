const router = require('express').Router();
const passport = require('passport');

router.use('/', require('./swagger'));

router.get('/login', passport.authenticate('github'));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

router.get('/logout', function(req, res, next) {
  req.logout(function(err){
    if (err) { return next(err); }
    res.redirect('/');
  });
});  

router.use('/users', require('./users'));
router.use('/entries', require('./entries'));


module.exports = router;
