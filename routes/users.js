var express = require('express');
const user_helper = require('../helpers/user-helper');
const { route } = require('./public');
var router = express.Router();
const paypal = require('paypal-rest-sdk');

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
  res.redirect('/user/message')
  })
})

router.get('/message',(req,res)=>{
  let user=req.session.user

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
      return_url: "http://localhost:3000/user/stageone_success",
      cancel_url: "http://localhost:3000/user/cancelled_stageone",
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
      return_url: "http://localhost:3000/user/stagetwo_success",
      cancel_url: "http://localhost:3000/user/cancelled_stagetwo",
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
