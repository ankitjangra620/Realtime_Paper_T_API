import express from 'express'
const router = express.Router();
import {getTrades} from '../controllers/trading.js'

router.get("/",(req,res)=>{
    var io = req.app.get('socketio');
    getTrades(req,res)
})
export default router;