var express = require('express');
var router = express.Router();

/* GET users listing. */

router.get('/', function(req, res, next) {

  res.render('user/login')
});




router.get('/dashboard',(req,res)=>{

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


router.get('/mydesign', function(req, res, next) {

  // console.log('called /users')
  res.render('user/design_requirement')
});

router.get('/construction', function(req, res, next) {

  // console.log('called /users')
  res.render('user/construction')
});

router.get('/documents', function(req, res, next) {

  // console.log('called /users')
  res.render('user/documents')
});

router.get('/payment', function(req, res, next) {

  // console.log('called /users')
  res.render('user/payment')
});

module.exports = router;
