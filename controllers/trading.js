import fetch from "node-fetch";

import { WebSocket } from "ws";
import tradeSchema from '../models/tradingData.js'
export const getTrades = async(req,res)=>{
    const io = req.io;
    try {
        const connection = new WebSocket('wss://stream.data.alpaca.markets/v2/iex')
        connection.onopen = () =>{
            connection.send(JSON.stringify({
                "action": "auth", 
                "key": process.env.ALPACA_KEY,
                "secret": process.env.ALPACA_SECRET
            }))
            io.emit('change','Database changed')
            connection.send(JSON.stringify({"action":"subscribe","bars":["AAPL"]}))
        }
        connection.onclose= () =>{
            console.log("connection to web socket is closed");
        }
        connection.onmessage = async(e) => {
            const trade = new tradeSchema({
                value:JSON.stringify(e.data)
            })
            try {
                io.emit('change','Database changed')
                const val = await trade.save();
                console.log('val',val)
            } catch (error) {
                console.log('errr',error.message)
            }

        }
    

        // await fetch('wss://stream.data.alpaca.markets/v2/iex',{
        //     headers:{
        //         "action": "auth", 
        //         "key": process.env.ALPACA_KEY,
        //         "secret": process.env.ALPACA_SECRET
        //     }
        // }).then(response=>response.json())
        // .then(data=>{
        //     console.log('data',data)
        // })
    } catch (error) {
        console.log(error.message);
    }
}