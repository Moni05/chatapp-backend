const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');

dotenv.config();

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");

const db = require("./mongoose");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) =>{
    res.send("API is running");
})

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

const port = process.env.PORT || 5000;

const apiServer = app.listen(process.env.PORT || 5000,()=>console.log(`Api running at port ${port}`));

const io = require("socket.io")(apiServer, {
    cors: {
      origin: "https://frosty-brattain-784a4c.netlify.app",
    },
});

let users = [];

const addUser = (userId, socketId) => {
    !users.some(user => user.userId === userId) && users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId);
}

io.on('connection',  (socket) => {
    console.log('user connected');

    socket.on("addUser", userId => {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    })

    socket.on('sendMessage', ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user.socketId).emit('getMessage', {
            senderId, text
        })
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
        removeUser(socket.id);
        io.emit('getUsers', users);
    })
})
