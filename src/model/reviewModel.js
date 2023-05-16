const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

  bookId: {type :ObjectId, required : true, ref : 'Book',trim : true},
  reviewedBy: {type :String, required : true, default :'Guest',trim : true},
  reviewedAt: {type : Date, required : true,trim : true},
  rating: {type :Number, required : true},
  review: {type :String,trim : true},
  isDeleted: {type :Boolean, default: false}
})

module.exports= mongoose.model('Review' , reviewSchema)