var express = require('express');
const user_helper = require('../helpers/user-helper');
const { route } = require('./public');
var router = express.Router();
const paypal = require('paypal-rest-sdk');
const nodemailer = require("nodemailer");
const { getMaxListeners } = require('../app');


const verifyuser=(req,res,next)=>{
  console.log("Verify user called")
  if(req.session.user){
    next()
  }else{
    res.redirect('/user') 
  }
}

router.post('/registerform',(req,res)=>{
  
  req.body.dateTime = new Date();
  user_helper.doSignup(req.body).then((response)=>{

  console.log(response)

  let userSigned=response





  let transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: "noreply.askinarchitects@gmail.com", 
      pass: "noreply001",  
    },
  });
  let mailOptions = {

    from: "noreply.askinarchitects@gmail.com", // sender address
    to: userSigned.email, // list of receivers
    subject: "Welcome to askinarchitects.com!", // Subject line
    html: "<b><h3>Thank you for using our online Architectural services. You can now get your dream home designed by qualified architects online from the comfort of your location anywhere in the world.</h3></b><br>Please login to our design hub on askinarchitects.com using your Username and Password. Then you will be able to navigate through the following features: <br><br><b>STEP 1 - My Design Requirements</b><br>We have now received your Design Requirements which you can see in this tab. <br><br><b>STEP 2 - My Payment</b><br>This Tab is where you make the initial payment of Rs 4997 ($68.91) for the Preliminary Floor plans. One of our architects will be contacting you within 48 hours of making the payment.<br><br><b>STEP 3 - My Design Documents</b><br>The My Design Documents folder can be accessed at any time using your Login details. Your architect will be uploading your floor plans and other design sketches and drawings to this folder for your feedback and further discussions.<br><br><b>STEP 4 - My Construction Status</b><br>The My Construction Status Tab will become active once the Architectural design drawings are finalized and actual construction begins.<br><br><br><b>Please feel free to contact us via email (mail@askinarchitects.com) or WhatsApp (+91 8089315301). You may also use the Chat feature in our Design Hub.</b><br><br><br> <hr>Thank you and Kind Regards,<br>askinarchitects.com",
  };

  transporter.sendMail(mailOptions, function(err,data){
    if (err) {
      console.log(err)
    }else{
      console.log("Done auto-email!")
    }
  })

  res.render('public/Message')
  })
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
  console.log("called /login at 59 user js")
  // console.log(req.body)
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
  console.log("called /dash at 87 user js")


  let user=req.session.user
  // let stageonepaid = req.session.user.StageOnePaidStatus
  console.log(user)
 
  res.render('user/dashboard',{user})

})



router.get('/mydesign', verifyuser,function(req, res, next) {
  let user=req.session.user

  res.render('user/design_requirement',{user})
});



router.get('/construction', verifyuser,function(req, res, next) {


  let user=req.session.user
  res.render('user/construction', {user})

});



router.get('/documents', verifyuser, function(req, res, next) {

  let user=req.session.user
  res.render('user/documents', {user})
});




router.get('/payment', verifyuser,function(req, res, next) {

  let user=req.session.user
  res.render('user/payment',{user})
});


router.get("/pay_stage_one", verifyuser,(req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "https://askinarchitects.in/user/stageone_success",
      cancel_url: "https://askinarchitects.in/user/cancelled_stageone",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Askin architects home design stage I",
              sku: "001",
              price: "68.91",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "68.91",
        },
        description: "Askin architects home design stage I",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      consol.log(error)
      res.redirect("/user/payment")
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

router.get("/stageone_success", verifyuser, (req, res) => {

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "68.91",
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error,payment) {
    if (error) {
      res.redirect("/user/payment")
      console.log(error.response);
      // throw error;
    } else {
      // console.log(JSON.stringify(payment));
      // console.log("***************************")
      // console.log(payment.payer.payer_info.first_name,
      //   payment.payer.payer_info.last_name, 
      //   payment.payer.payer_info.email, 
      //  payment.transactions[0].amount.currency,
      //    payment.transactions[0].amount.total,
      //   payment.state)

      req.session.user.StageOnePaidStatus = payment.state
      req.session.user.StageOnePaidDate = new Date();
      req.session.user.StageOnePaidFirstName = payment.payer.payer_info.first_name
      req.session.user.StageOnePaidLastName = payment.payer.payer_info.last_name
      req.session.user.StageOnePaidEmail = payment.payer.payer_info.email
      req.session.user.StageOnePaidCurrency = payment.transactions[0].amount.currency
      req.session.user.StageOnePaidAmount =  payment.transactions[0].amount.total


      let user = req.session.user
      // console.log(user)

      user_helper.UpdateDataStageOne(user).then((response)=>{
       
      })

      res.redirect("/user/payment");
    }
  });
});


router.get("/cancelled_stageone", (req, res) => {

  // req.session.user.paymentStatus = {}
  let user = req.session.user
  // user.PaymentStatusDate = new Date();
  console.log("***********")
  console.log(user)
  // user.paymetnStatusDAte = new Date();

res.redirect("/user/payment")});





// stage 2------------------------------------------------------------------------



router.get("/pay_stage_two", verifyuser,(req, res) => {
  const create_payment_json = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "https://askinarchitects.in/user/stagetwo_success",
      cancel_url: "https://askinarchitects.in/user/cancelled_stagetwo",
    },
    transactions: [
      {
        item_list: {
          items: [
            {
              name: "Askin architects home design stage II",
              sku: "001",
              price: "137.61",
              currency: "USD",
              quantity: 1,
            },
          ],
        },
        amount: {
          currency: "USD",
          total: "137.61",
        },
        description: "Askin architects home design stage II",
      },
    ],
  };

  paypal.payment.create(create_payment_json, function (error, payment) {
    if (error) {
      console.log(error)
      res.redirect("/user/payment")
      throw error;
    } else {
      for (let i = 0; i < payment.links.length; i++) {
        if (payment.links[i].rel === "approval_url") {
          res.redirect(payment.links[i].href);
        }
      }
    }
  });
});

router.get("/stagetwo_success", verifyuser, (req, res) => {

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "137.61",
        },
      },
    ],
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error,payment) {
    if (error) {
      res.redirect("/user/payment")
      console.log(error.response);
      // throw error;
    } else {
      // console.log(JSON.stringify(payment));
      // console.log("***************************")
      // console.log(payment.payer.payer_info.first_name,
      //   payment.payer.payer_info.last_name, 
      //   payment.payer.payer_info.email, 
      //  payment.transactions[0].amount.currency,
      //    payment.transactions[0].amount.total,
      //   payment.state)

      req.session.user.StageTwoPaidStatus = payment.state
      req.session.user.StageTwoPaidDate = new Date();
      req.session.user.StageTwoPaidFirstName = payment.payer.payer_info.first_name
      req.session.user.StageTwoPaidLastName = payment.payer.payer_info.last_name
      req.session.user.StageTwoPaidEmail = payment.payer.payer_info.email
      req.session.user.StageTwoPaidCurrency = payment.transactions[0].amount.currency
      req.session.user.StageTwoPaidAmount =  payment.transactions[0].amount.total


      let user = req.session.user
      // console.log(user)

      user_helper.UpdateDataStageTwo(user).then((response)=>{
       
      })

      res.redirect("/user/payment");
    }
  });
});


router.get("/cancelled_stagetwo", (req, res) => {

  // req.session.user.paymentStatus = {}
  let user = req.session.user
  // user.PaymentStatusDate = new Date();
  console.log("***********")
  console.log(user)
  // user.paymetnStatusDAte = new Date();

res.redirect("/user/payment")});

// =========================================================




module.exports = router;
