import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
    value:{
        type:String,
        required:true,
    }
})

export default mongoose.model('candels',tradeSchema)