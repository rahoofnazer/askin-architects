var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { reject, promise } = require('bcrypt/promises')
var objectId=require('mongodb').ObjectId
const { resolve } = require('path')
const session = require('express-session');


module.exports={
    doSignup: (userData) =>{
        // console.log(userData)
        return  new Promise(async(resolve,reject)=>{
    
            userData.Password=await bcrypt.hash(userData.Password, 10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                resolve(data.ops[0])
    
            })
        })
    },


    doLogin: (userData)=>{
            return new Promise( async(resolve,reject)=>{
                let loginStatus=false
                let response={}
        
        
                let user= await db.get().collection(collection.USER_COLLECTION).findOne({Username:userData.Username})
                if(user){
                    bcrypt.compare(userData.Password,user.Password).then((status)=>{
                        if(status){
                            console.log('user Login Success')
                            response.user=user
                            response.status=true   
                            resolve(response) 
                        }else{
                            console.log('user pwd not match, login failed')
                            resolve({status:false})
                        }
                    })
        
                }else{
                    console.log('admin username not found, login failed');
                    resolve({status:false})
                }
            })
        },

        UpdateDataStageOne: (user)=>{
            let response = {}
            console.log("53 rd line")
            console.log(user)
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.USER_COLLECTION)
                .updateOne({_id:objectId(user._id)},{
                    $set:{

                        StageOnePaidStatus:user.StageOnePaidStatus,
                        StageOnePaidDate:user.StageOnePaidDate,
                        StageOnePaidFirstName:user.StageOnePaidFirstName,
                        StageOnePaidLastName:user.StageOnePaidLastName,
                        StageOnePaidEmail:user.StageOnePaidEmail,
                        StageOnePaidCurrency:user.StageOnePaidCurrency,
                        StageOnePaidAmount:user.StageOnePaidAmount

                    }
                }).then((response)=>{
                    resolve()
                })
                
            })
        },
        UpdateDataStageTwo: (user)=>{
            let response = {}
            console.log("53 rd line")
            console.log(user)
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.USER_COLLECTION)
                .updateOne({_id:objectId(user._id)},{
                    $set:{

                        StageTwoPaidStatus:user.StageTwoPaidStatus,
                        StageTwoPaidDate:user.StageTwoPaidDate,
                        StageTwoPaidFirstName:user.StageTwoPaidFirstName,
                        StageTwoPaidLastName:user.StageTwoPaidLastName,
                        StageTwoPaidEmail:user.StageTwoPaidEmail,
                        StageTwoPaidCurrency:user.StageTwoPaidCurrency,
                        StageTwoPaidAmount:user.StageTwoPaidAmount

                    }
                }).then((response)=>{
                    resolve()
                })
                
            })
        }
    
}