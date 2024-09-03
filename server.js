const path = require('path')
const express = require('express')
const WebSocket = require('ws')
const http = require('http')

const app = express()

app.use(express.static(__dirname))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/server', (req, res) => {
  res.send('Chat server running')
})

const server = http.createServer(app)

const wss = new WebSocket.Server({ server })

const chatRooms = {}

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const messageObject = JSON.parse(message.toString())
    const { type, chatCode } = messageObject

    if (type === 'join') {
      chatRooms[chatCode] = chatRooms[chatCode] || new Set()
      return chatRooms[chatCode].add(ws)
    }

    const targetClients = chatRooms[chatCode]
    targetClients?.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(messageObject))
      }
    })
  })
})

server.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})
