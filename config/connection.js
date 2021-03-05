const mongoClient=require('mongodb').MongoClient

const state={
    db:null
}

module.exports.connect=function(done){

    //const url='mongodb://localhost:27017/askin'
    const url='mongodb://askinAdmin:admin%40$.890@localhost:27017/askin'

    const dbname='askin'

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
    })

    done()
}

module.exports.get=function(){
    return state.db
}
