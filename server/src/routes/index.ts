const express = require("express");

export const router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {message: 'Hello from handlebars!'});
});


/**
 * Sends back user info or login error
 */
router.post('/login', function(req, res, next){

});

export const index = router;
