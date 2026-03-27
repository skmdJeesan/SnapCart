import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()

const app = express()
app.use(express.json())
const server = http.createServer(app)

const io = new Server(server, {
  cors: {origin: process.env.NEXT_BASE_URL}
})

io.on('connection', (socket) => {
  //console.log('user connected', socket.id)
  socket.on('identity', async (userId) => {
    //console.log(userId)
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {userId, socketId: socket.id})
  })
  socket.on('update-location', async ({userId, latitude, longitude}) => {
    const location = {type: 'Point', coordinates: [longitude, latitude]}
    await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/update-location`, {userId, location})
    io.emit('update-deliveryBoy-location', {userId, location})
  })
  socket.on('join-room', (roomId) => {
    console.log('join room with', roomId)
    socket.join(roomId)
  })
  socket.on('send-message', async (msg) => {
    // console.log(msg)
    await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`, msg)
    io.to(msg.roomId).emit('send-message', msg)
  })
  socket.on('disconnect', (reason) => {
    console.log('user disconnected', socket.id, '\nreason:', reason)
  })
})

app.post('/notify', (req, res) => {
  try {
    const {event, data, socketId} = req.body
    if(socketId) io.to(socketId).emit(event, data)
    else io.emit(event, data) // Broadcast to all if no socketId provided
    res.status(200).json({message: 'Notification sent'})
  } catch (error) {
    res.status(500).json({message: 'Error sending notification', error: error.message})
  }
})

const port = process.env.PORT || 5000; // Always use the PORT env variable provided by Render
server.listen(port, '0.0.0.0', () => { // Bind to 0.0.0.0 to accept connections from outside
  console.log(`Server is running on port ${port}`);
});