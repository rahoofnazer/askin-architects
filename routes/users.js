var express = require('express');
const user_helper = require('../helpers/user-helper');
var router = express.Router();


/* GET users listing. */

router.get('/', function(req, res, next) {

  res.render('user/login')
});



// router.post('/registerform',(req,res)=>{
//   console.log(req.body)
//   admin_helper.doLogin(req.body).then((response)=>{
    
//     if(response.status){
//       req.session.admin=true
//       req.session.admin=response.admin
//       res.redirect('/admin/login')
//     }else{
//       req.session.adminLoginErr=true
//       res.redirect('/admin')
//     }    
//   })
// })

router.post('/registerform',(req,res)=>{
  console.log(req.body)
  user_helper.doSignup(req.body).then((response)=>{
  console.log(response)
  res.render('public/Message')
  })
})


router.post('/login',(req,res)=>{
  console.log(req.body)
  user_helper.doLogin(req.body).then((response)=>{
    
    if(response.status){
      req.session.user=true
      req.session.user=response.user
      res.redirect('/user/dashboard')
    }else{
      req.session.userLoginErr=true
      res.redirect('/user')
    }    
  })
})




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

  res.render('user/design_requirement')
});

router.get('/construction', function(req, res, next) {

  res.render('user/construction')
});

router.get('/documents', function(req, res, next) {

  res.render('user/documents')
});

router.get('/payment', function(req, res, next) {

  res.render('user/payment')
});





module.exports = router;
