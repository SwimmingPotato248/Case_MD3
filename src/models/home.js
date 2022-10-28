const socket = io('http://localhost:3000')
const fs = require('fs');
const qs = require('qs');
const url = require('url');
const connection = require("../utils/database");


function sendNotification() {
    socket.emit("sendNotification",{


    })
}





