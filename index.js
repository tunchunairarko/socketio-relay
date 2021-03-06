const express = require("express");
require("dotenv").config();
const socketio = require("socket.io")
const io = require("socket.io-client")
const socketioclient = io("http://localhost:9000")

const app = express();
app.use(express.json());
// app.use(express.static("client/build"))
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === 'OPTIONS') {
      res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
      return res.status(200).json({});
  }
  next();
});

// set up routes


const server = app.listen(PORT, () => console.log(`RetraDev relay server has started on port: ${PORT}`));
console.log("Listening to the LocalCloud at port: 9000");
/////////////////////
//////////////////////
///////////////////

const sio = socketio(server,{pingTimeout: 0, origins:"*:*",allowEIO3: true})

let interval;

sio.on("connection", (socket) => {
  console.log("RetraDev robot client connected");  

  socket.on("frontenddata",function(data){
    //console.log(data)
    socketioclient.emit("FROMNODEAPI",data)
  })

  socket.on("frontendspeechdata",function(data){
    //console.log(data)
    socketioclient.emit("FROMNODESPEECHAPI",data)
  })
  
  socket.on("PEPPERBATTERY",function(data){
    //console.log(data)
    // data.relayservertime= new Date().getTime()
    socketioclient.emit("BATTERYDATA",data)
  })
  socket.on("FACETRACKSTATUS",function(data){
    //console.log(data)
    // data.relayservertime= new Date().getTime()
    socketioclient.emit("FACETRACKDATA",data)
  })
  socket.on("PEPPERSONAR",function(data){
    //console.log(data)
    // data.relayservertime= new Date().getTime()
    socketioclient.emit("SONARDATA",data)
  })
  
  socket.on("PEPPERCONTEST",function(data){
    //console.log(data)
  })
  socket.on("PONG",function(data){
    //console.log(data)
    socketioclient.emit("RELAYPONG",data)
  })

  
  socket.on("PING",function(data){
    // console.log("PING: "+data)
    socketioclient.emit("RELAYPING",data)
  })

  socket.on("RTT",function(data){
    socketioclient.emit("RELAYRTT",data)
  })


  socketioclient.on("PONG",function(data){
    // console.log("PONG: "+data)
    socket.emit("RELAYPONG",data)
  })
  socketioclient.on("RELAYPOINTAT",function(data){
    // console.log("PONG: "+data)
    socket.emit("TOPOINTAT",data)
  })
  socketioclient.on("RELAYFACETRACKSTATUS",function(data){
    // console.log("FROMLOCALCLOUD "+data)
    socket.emit("TOFACETRACKSTATUS",data)
  })
  socketioclient.on("RELAYWAVEHAND",function(data){
    //console.log(data)
    socket.emit("TOWAVEANIMATION",data)
  })
  socketioclient.on("RELAYMOTION",function(data){
    //console.log(data)
    socket.emit("TOMOTION",data)
  })
  ///////////////////////////////////////////////////////////
  ////////////////IP CAMERA RELAY AND RESET/////////////////
  socketioclient.on("RELAYSTARTIPCAM",function(data){
    socket.emit("STARTIPCAM",data)
  })
  socketioclient.on("RELAYRESETIPCAM",function(data){
    socket.emit("RESETIPCAM",data)
  })
  socket.on("IPCAMURL",function(data){
    socketioclient.emit("RELAYIPCAMURL",data)
  })

});




