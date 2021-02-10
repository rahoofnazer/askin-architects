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

router.get('/home', (req,res)=>{
  res.render('public/index')
})

router.get('/Malappuram',(req,res)=>{
  {{district= "Malappuram"}}
  res.render('public/Register',{district})
})

router.get('/Kasaragod',(req,res)=>{
  {{district= "Kasaragod"}}
  res.render('public/Register',{district})
})

router.get('/Kannur',(req,res)=>{
  {{district= "Kannur"}}
  res.render('public/Register',{district})
})

router.get('/Kozhikode',(req,res)=>{
  {{district= "Kozhikode"}}
  res.render('public/Register',{district})
})

router.get('/Wayanad',(req,res)=>{
  {{district= "Wayanad"}}
  res.render('public/Register',{district})
})

router.get('/Palakkad',(req,res)=>{
  {{district= "Palakkad"}}
  res.render('public/Register',{district})
})

router.get('/Thrissur',(req,res)=>{
  {{district= "Thrissur"}}
  res.render('public/Register',{district})
})

router.get('/Ernakulam',(req,res)=>{
  {{district= "Ernakulam"}}
  res.render('public/Register',{district})
})

router.get('/Idukki',(req,res)=>{
  {{district= "Idukki"}}
  res.render('public/Register',{district})
})

router.get('/Kottayam',(req,res)=>{
  {{district= "Kottayam"}}
  res.render('public/Register',{district})
})

router.get('/Alappuzha',(req,res)=>{
  {{district= "Alappuzha"}}
  res.render('public/Register',{district})
})

router.get('/Pathanamthitta',(req,res)=>{
  {{district= "Pathanamthitta"}}
  res.render('public/Register',{district})
})

router.get('/Kollam',(req,res)=>{
  {{district= "Kollam"}}
  res.render('public/Register',{district})
})

router.get('/Thiruvananthapuram',(req,res)=>{
  {{district= "Thiruvananthapuram"}}
  res.render('public/Register',{district})
})







module.exports = router;
