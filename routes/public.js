var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  res.render('public/index',{district:true});  
});

router.post('/form',(req,res)=>{
  console.log(req.body)
  res.render('public/Message')
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
