const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=function(done){
    // const url='mongodb+srv://askin:admin@askin@cluster0.n7l1e.mongodb.net/askin?retryWrites=true&w=majority'
    const url='mongodb://localhost:27017'

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
