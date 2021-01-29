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
        console.log(userData)
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
        }




    // ,
    // doLogin: (adminData)=>{
    //     return new Promise( async(resolve,reject)=>{
    //         let loginStatus=false
    //         let response={}
    
    
    //         let admin= await db.get().collection(collection.ADMIN_COLLECTION).findOne({Username:adminData.Username})
    //         if(admin){
    //             bcrypt.compare(adminData.Password,admin.Password).then((status)=>{
    //                 if(status){
    //                     console.log('Admin Login Success')
    //                     response.admin=admin
    //                     response.status=true   
    //                     resolve(response) 
    //                 }else{
    //                     console.log('Admin pwd not match, login failed')
    //                     resolve({status:false})
    //                 }
    //             })
    
    //         }else{
    //             console.log('admin username not found, login failed    ');
    //             resolve({status:false})
    //         }
    //     })
    // }
    
}