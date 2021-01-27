var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res, next) {

  res.render('user/login')
});


router.get('/users', function(req, res, next) {

  console.log('called /users')
  res.render('user/user')
});


router.get('/login',(req,res)=>{

  res.render('user/dashboard')


  // console.log(req.body)


  // admin_helper.doLogin(req.body).then((response)=>{
    
  //   if(response.status){
  //     req.session.admin=true
  //     req.session.admin=response.admin
  //     res.redirect('/admin/login')
  //   }else{
  //     req.session.adminLoginErr=true
  //     res.redirect('/admin')
  //   }    
  // })
})

module.exports = router;
