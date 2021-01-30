var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  if(user){
    res.redirect('user/dashboard')
  }else{
    res.render('public/index');  
  }
});


router.get('/malappuram', (req,res)=>{
  res.render('public/Malappuram')
})






module.exports = router;
