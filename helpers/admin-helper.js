var db = require('../config/connection')
var collection = require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { reject, promise } = require('bcrypt/promises')
var objectId = require('mongodb').ObjectId
const { resolve } = require('path')
const session = require('express-session');


module.exports = {
    doSignup: (adminData) => {
        console.log(adminData)
        return new Promise(async (resolve, reject) => {

            adminData.Password = await bcrypt.hash(adminData.Password, 10)
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
                resolve(data.ops[0])

            })
        })
    },
    doLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false
            let response = {}


            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Username: adminData.Username })
            if (admin) {
                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if (status) {
                        console.log('Admin Login Success')
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        console.log('Admin pwd not match, login failed')
                        resolve({ status: false })
                    }
                })

            } else {
                console.log('admin username not found, login failed    ');
                resolve({ status: false })
            }
        })
    },

    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    
    
    getPaidUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find({StageOnePaidStatus:"approved"}).toArray()
            resolve(users)
            console.log(users)
            
        })
    },
    getUserDetails: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) }).then((user) => {
                resolve(user)
            })
        })
    },
    updateUploadLink: (userId, data)=>{
        let response = {}
        console.log(userId)
        console.log(data)

        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION)
            .updateOne({_id:objectId(userId)},{
                $set:{

                    gdrive:data.gdrive
               
                }
            }).then((response)=>{
                resolve()
            })
            
        })
    }



}