const jwt=require("jsonwebtoken")
const bookModel=require("../model/bookModel")
const { isValidObjectId } = require("mongoose")
const userModel = require('../model/userModel')




exports.authentication=async function(req,res,next){
    try{
        let token=req.headers["x-api-key"] 
        if(!token) return res.status(400).send({status:false,message:"Missing authentication token"})

            jwt.verify(token,'key',(err , token)=>{
              if(err)return res.status(401).send({status: false , message: err.message})
              req.id = token.userId
              next()
            })
           
    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}


exports.authorization=async function(req,res,next){
    try{
       let loginUser=req.id
      let BookId=req.params.bookId
      let userId = req.body.userId
       
      if(BookId){

       if(!isValidObjectId(BookId))return res.status(400).send({status:false,message:"please Enter valid Object Id"})

         let findId=await bookModel.findOne({_id:BookId ,isDeleted :false})
         if(!findId) return res.status(404).send({status: false,message:"Book id not found"})

         if(loginUser != findId.userId)return res.status(403).send({status: false ,message : "unAuthorization"})
         
         next()
        }
        else{

        if(!userId ||userId.trim()=="")return res.status(400).send({status: false ,message:"userId required"})
        if(userId){
            if(!isValidObjectId(userId))return res.status(400).send({status:false,message:"please Enter valid user Id"})

            let findUser = await userModel.findById({_id:userId})
            if(!findUser)return res.status(404).send({status: false , message :"user not exist our data base"})

           if(loginUser != findUser._id)return res.status(403).send({status: false , message:"unAuthorization"})
           next()
        }}

    }catch(err){
        return res.status(500).send({status:false,message:err.message})
    }
}