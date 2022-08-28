dotenv.config();
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose'
import {createServer} from 'http'
import initialRoutes from './routes/initialRoutes.js'
import {Server} from 'socket.io'
import bodyparser from 'body-parser'
import candels from './models/tradingData.js'
const app = express();
mongoose.connect(process.env.DB_URL,{useNewUrlParser : true,useUnifiedTopology: true})

const db = mongoose.connection.useDb("candels");
db.once('open',()=>{
    console.log("Mongo Db connected successfully")
})
db.on('error',(error)=>{
    console.log(`Error occured while connecting to mongodb = ${error}`)
})

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

//creating a http server
// const changeStream = candels.watch();
const http = createServer(app);
const io = new Server(http);
io.on('connection',socket => {
    console.log('connection')
    io.emit('connected',"Connected to trading database");
})
// changeStream.on('change',change => {
//     console.log(change);
//     io.emit('changeData', change);
// })
app.use('/',(req,res,next)=>{
    req['io']=io;next();
},initialRoutes)
const PORT = process.env.PORT || 5000

http.listen(PORT,(req,res)=>{
    console.log(`Server is starting at PORT : ${PORT}`)
})