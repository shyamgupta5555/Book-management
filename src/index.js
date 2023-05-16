const express = require('express')
const mongoose= require('mongoose')
const route = require('./route/route')
const app = express()
mongoose.set('strictQuery', true)

app.use(express.json())
mongoose.connect('mongodb+srv://shyamgupta:.T!8NRrzf6FyMYc@cluster0.dbdyccj.mongodb.net/group1Database').then(()=>{console.log("MONGO db is connect")}).catch((err)=>{console.log(err.message)})

app.use('/',route)

app.listen(3000 , (err)=>{
  if(err)return console.log(err.message)
  console.log("express is running :" ,3000)
})