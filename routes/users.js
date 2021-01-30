var express = require('express');
const user_helper = require('../helpers/user-helper');
const { route } = require('./public');
var router = express.Router();


router.post('/registerform',(req,res)=>{
  console.log(req.body)
  user_helper.doSignup(req.body).then((response)=>{
  console.log(response)
  res.redirect('/user/message')
  })
})

router.get('/message',(req,res)=>{
  let user=req.session.user
  console.log("22 th line public js")
  console.log(user)
  res.render('public/Message',{user})
})



router.get('/', function(req, res, next) {
  let user=req.session.user
if(user){
  res.redirect('user/dashboard')
}else{
  res.render('user/login',{"loginErr":req.session.userLoginErr})
  req.session.userLoginErr=false

}
});


// router.get('/', function(req, res, next) {
//   let user=req.session.user
// if(user){
//   res.redirect('user/dashboard')
// }
//   res.render('user/login')
// });




router.post('/login',(req,res)=>{
  console.log(req.body)
  user_helper.doLogin(req.body).then((response)=>{
    
    if(response.status){
      req.session.user=true

      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/user/dashboard')
    }else{
      req.session.userLoginErr=true
      res.redirect('/user') 

      // res.redirect('/user', {loginErr})

    }    
  })
})


router.get('/logout', (req,res)=>{
  req.session.destroy()
  res.redirect('/')
})


router.get('/dashboard',(req,res)=>{

  let user=req.session.user
  console.log(user)

  res.render('user/dashboard',{user})

})



router.get('/mydesign', function(req, res, next) {
  let user=req.session.user

  res.render('user/design_requirement',{user})
});



router.get('/construction', function(req, res, next) {

  let user=req.session.user
  res.render('user/construction', {user})
});



router.get('/documents', function(req, res, next) {

  let user=req.session.user
  res.render('user/documents', {user})
});




router.get('/payment', function(req, res, next) {

  let user=req.session.user
  res.render('user/payment',{user})
});






module.exports = router;
