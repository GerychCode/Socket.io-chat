import express from 'express';
import { Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server);
let connection_count = 0;

io.on('connection', (socket) => {
    connection_count++; 
    console.log(`Socket: ${socket.id} connected. Connected Users: ${connection_count}`);
    io.emit("client-get-connection", connection_count)
    socket.on("server-get-msg", (data) => {
        io.emit("client-get-msg", data);
    })
    socket.on("disconnect", () => {
        connection_count--;
        io.emit("client-get-connection", connection_count);
        console.log(`Socket: ${socket.id} disconnect. Connected Users: ${connection_count}`);
    });
});

server.listen(3001, () => {
    console.log('Server started on 3001 port');
});