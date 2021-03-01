var express = require('express');
const { response } = require('../app');
var admin_helper = require('../helpers/admin-helper');
var router = express.Router();
const session = require('express-session');
const { route } = require('./users');

const verifyAdmin=(req,res,next)=>{
  console.log("Verify admin called")
  if(req.session.admin){
    next()
  }else{
    res.redirect('/admin') 
  }
}


router.get('/', function(req, res, next) {

  res.render('admin/admin-login',{"loginErr":req.session.adminLoginErr})
  req.session.adminLoginErr=false

});


router.get('/dashboard',verifyAdmin,(req,res)=>{
  if(req.session.admin){
    res.render('admin/admin-dashboard')
  }else{
    res.redirect('/admin')  }
    req.session.adminLoginErr=false
})

// router.post('/Login',(req,res)=>{
// admin_helper.doSignup(req.body).then((response)=>{
//   console.log(response)
//   res.redirect('/admin/viewProducts')
//   })
// })

router.post('/login',(req,res)=>{
  console.log(req.body)
  admin_helper.doLogin(req.body).then((response)=>{
    
    if(response.status){
      req.session.admin=true
      req.session.admin=response.admin
      res.redirect('/admin/dashboard')
    }else{
      req.session.adminLoginErr=true
      res.redirect('/admin')
    }    
  })
})


router.get('/users',verifyAdmin,(req,res)=>{

  admin_helper.getAllUsers().then((users)=>{

    res.render('admin/users',{users})
  })

})

router.get('/paidUsers',verifyAdmin,(req,res)=>{

  admin_helper.getPaidUsers().then((users)=>{



    res.render('admin/paid-users',{users})
  })

})



router.get('/uploaddesign',verifyAdmin,(req,res)=>{

  admin_helper.getPaidUsers().then((users)=>{

    res.render('admin/upload_design',{users})
  })

})




router.get('/upload_form/:id',verifyAdmin,async(req,res)=>{

  let user=await admin_helper.getUserDetails(req.params.id)
  console.log(user);

    res.render('admin/upload_form',{user})
  })




router.post('/upload_link/:id',verifyAdmin,(req,res)=>{

  let id=req.params.id
  admin_helper.updateUploadLink(req.params.id,req.body).then(()=>{
    res.redirect('/admin/uploaddesign')

  })
})




router.get('/logout',verifyAdmin,(req,res)=>{

  req.session.admin=null 
  res.redirect('/') 
})

module.exports = router;



