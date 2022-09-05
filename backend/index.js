// Libraray
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const { addUser, removeUser, getUser, getRoomUsers } = require("./entity");
const mongoose = require('mongoose');
const { User } = require('./models/user');
const bodyParser = require('body-parser');
const crypto = require("crypto");
const ethers = require("ethers");
const { generateKeyPair } = require('crypto');

const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Instances
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } })

async function main() {
  mongoose.connect('mongo-URL').then(() => console.log("Mongoose connected")).catch((e) => console.log("mongoose not able to connect...", e.message));
}

main().catch(err => console.log(err));


// End point
app.get('/', (req, res) => {
  res.json("Api is working");
})

app.post('/api/register', (req, res) => {
    const user = new User(req.body);
    user.save((err, doc) => {
      if (err) {
        console.log(err)
        return res.json({ success: false });
      }
      res.status(200).json({
        success: true,
        user: doc
      })
    });
});

io.on('connect', (socket) => {
  socket.on('join', async ({ user, room }, callback) => {
    console.log(user, room)
    // const userInfo = await User.findOne({wallet: user});
    const { response, error } = addUser({ id: socket.id, user: user, room: room , /* publicKey: userInfo.publicKey */})
    console.log(response)
    if (error) {
      callback(error)
      return;
    }
    socket.join(response.room);

    io.to(response.room).emit('roomMembers', getRoomUsers(response.room))
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('message', { user: user.user, text: message })
    callback()
  })




  socket.on('disconnect', () => {
    console.log("User disconnected");
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.user} has left` })
    }
  })
})




server.listen(8000, () => console.log('Server started on 8000'))