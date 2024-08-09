require('dotenv').config();
var helmet=require("helmet")
const { createServer } = require("http");
const { Server } = require("socket.io");

const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();

app.use(helmet())
const httpServer = createServer(app);
global.io = new Server(httpServer);

app.use(express.json());
app.use(fileUpload());
app.use(cookieParser());

function get_random(arr){
    return arr[Math.floor(Math.random()*arr.length)]
}

const admins = [];
let activeChats=[];  //clientId: socket.id , adminId: admin.id
io.on("connection", (socket) => {
  socket.on("server:admin-connected",(adminName)=>{ //admin connected with server
    admins.push({id: socket.id, admin:adminName})
  })
  
  socket.on("client:message", (msg) => { //client send message
    if (admins.length === 0) {
      socket.emit("server:no-admin","");
    } else {
        let client= activeChats.find((client)=> client.clientId === socket.id)
        let targetAdminId;
        if(client){
            targetAdminId= client.adminId
        }
        else{
            let admin=get_random(admins)
            activeChats.push({ clientId: socket.id , adminId: admin.id})
            targetAdminId=admin.id
          }
        socket.broadcast.to(targetAdminId).emit("server:client-admin-message", {
            user: socket.id,
            message: msg,
        });
    }
  });

  socket.on("admin:message", ({ user,message }) => {
    socket.broadcast.to(user).emit("server:admin-client-message", 
      message
    );
  });

  socket.on("admin:closeChat",(socketId)=>{
    socket.broadcast.to(socketId).emit("admin closed chat","")
    let c= io.sockets.sockets.get(socketId)
    c.disconnect()
  })

  socket.on("disconnect", (reason) => {
    //admin disconnect
    const removeIndex = admins.findIndex((item) => item.id === socket.id);
    if (removeIndex !== -1) {
      admins.splice(removeIndex, 1);
    }
    activeChats=activeChats.filter((item)=> item.adminId !==socket.id)
    
    //client disconnect
    const removeIndexClient= activeChats.findIndex((item)=> item.clientId === socket.id)
    if(removeIndexClient !== -1){
        activeChats.splice(removeIndexClient,1)
    }
    socket.broadcast.emit("disconnected",{reason: reason, socketId: socket.id})
  });
});

const apiRoutes = require("./Routes/apiRoute");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res, next) => {
  res.json({ message: "API running" });
});

const connectDB = require("./config/db");
connectDB();

app.use("/api/v1", apiRoutes);

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});

app.use((error, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(500).json({
      message: error.message,
    });
  }
  next(error);
});

httpServer.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});
