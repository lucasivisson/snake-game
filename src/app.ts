import express, { Request, Response } from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
// const io = new Server(server);

app.listen(3000);
app.use(express.static("public"));
