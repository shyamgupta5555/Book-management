const reviewModel = require("../model/reviewModel")
const bookModel = require("../model/bookModel")
const mongoose = require('mongoose')
const validRating= /^[1-5](\.\d)?$/
const regex = /^[a-zA-Z0-9% ]{3,60}$/
const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/

exports.createReview = async function(req,res){
    try {

        let id= req.params.bookId
        let data = req.body
        if (!mongoose.isValidObjectId(id)) return res.status(400).send({ status: false, message: "bookId is  invalid" })
        
        let {reviewedAt,review,rating} = data
 
        if(!rating) return res.status(400).send({status:false, message:"Pls provide rating "})
        

        if(!validRating.test(rating))return res.status(400).send({status: false , message :"rating invalid to use 1 to 5"})
        if(!review.match(regex))return res.status(400).send({status: false , message :" review invalid "})
        if(data["reviewer's name"]){
      if(!data["reviewer's name"].match(regex))return res.status(400).send({status: false , message :"reviewer's name invalid"})}
        
      if(reviewedAt){if(!dateRegex.test(reviewedAt))return res.status(400).send({status: false ,message :"reviewedAt invalid like => YYYY-MM-DD"})}else{
     reviewedAt =new Date()
      }
        let bookIdFind=await bookModel.findOne({_id:id, isDeleted:false})
        if(!bookIdFind){return res.status(400).send({status:false,message:"bookId is not exist in database"})}
        
        let obj = {bookId:id, reviewedBy:data["reviewer's name"] ,rating:rating,review:review,reviewedAt:reviewedAt }

        let createReview = await(await reviewModel.create(obj)).populate("bookId")

        await bookModel.findOneAndUpdate({_id :id},{$inc :{reviews:+1}},{new: true})
        res.status(201).send({status:true, message:"successful", data:createReview})

    } catch (error) {
        res.status(500).send({status:false,message :"successful created", message:error.message})
    }
}


exports.updateReview = async (req,res)=>{
  try{
  let id = req.params.bookId
  let reviewId = req.params.reviewId

if(!mongoose.isValidObjectId(reviewId))return res.status(400).send({status: false , message :"review id is invalid"})
if(!mongoose.isValidObjectId(id))return res.status(400).send({status: false , message :"Book id is invalid"})
let data= req.body
let {review ,rating , reviewedBy} = data

if(review){ if(!review.match(regex))return res.status(400).send({status: false , message :" review invalid "})}
if(rating){ if(!validRating.test(rating))return res.status(400).send({status: false , message :"rating invalid to use 1 to 5"})}     
if(reviewedBy){if(!reviewedBy.match(regex))return res.status(400).send({status:false , message:"reviewed invalid"})}  

let bookIdFind=await bookModel.findById({_id:id, isDeleted:false})
if(!bookIdFind){return res.status(400).send({status:false,message:"No book present with this ID"})} 

let update = await reviewModel.findOneAndUpdate({_id:reviewId,isDeleted: false},data,{new: true}).populate("bookId")
if(!update)return res.status(404).send({status:false , message:" review id not found"})
res.status(200).send({status:true,message :"successful update" ,data :update})

}catch(err){
  res.status(500).send({status:false,message: err.message})
}
}



exports.deleteReview = async (req ,res)=>{
  try{
  let bookId  =  req.params.bookId
  let ReviewId = req.params.reviewId
  if(!mongoose.isValidObjectId(ReviewId))return res.status(400).send({status: false , message :"reviews id is invalid"})
  if(!mongoose.isValidObjectId(bookId))return res.status(400).send({status: false , message :"Book id is invalid"})

  let bookIdFind=await bookModel.findOne({_id:bookId, isDeleted:false})
  if(!bookIdFind){return res.status(400).send({status:false,message:"bookId is not exist in database"})} 
  let deleted = await reviewModel.findOneAndUpdate({_id:ReviewId,isDeleted: false},{isDeleted: true},{new: true})
  if(!deleted)return res.status(404).send({status: false , message :"review id not found"})
  res.status(200).send({status:true,message :"successful deleted"})
  await bookModel.findOneAndUpdate({_id :bookId},{$inc :{reviews:-1}},{new: true})

}catch(err){
  res.status(500).send({status:false,message: err.message})
}

}


