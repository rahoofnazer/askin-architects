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

// router.post('/registerform',(req,res)=>{
//   console.log(req.body)
//   res.render('public/Message')
//   // admin_helper.doLogin(req.body).then((response)=>{
    
//   //   if(response.status){
//   //     req.session.admin=true
//   //     req.session.admin=response.admin
//   //     res.redirect('/admin/login')
//   //   }else{
//   //     req.session.adminLoginErr=true
//   //     res.redirect('/admin')
//   //   }    
//   // })
// })



module.exports = router;
