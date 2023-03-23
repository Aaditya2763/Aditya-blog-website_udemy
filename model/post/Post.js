// importing mongoose
const mongoose=require('mongoose');

const Post=mongoose.Schema({
 title:{
    type:String,
    required:[true,"Post title is required"],

 },
 content:{
    type:String,
    required:[true,"content is required"],
 },
 author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
})

export default Post;
