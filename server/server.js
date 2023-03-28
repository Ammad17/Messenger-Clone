const io = require('socket.io')(5000, {
  cors: {
    origin: ['https://localhost:3000', 'http://localhost:3000'],
  },
})
// const io = require('socket.io')(5000)
io.on('connection', (socket) => {
  console.log('new client connected', socket.id)
  const id = socket.handshake.query.id
  socket.join(id)

  socket.on('send-message', ({ recipients, text }) => {
    recipients.forEach((recipient) => {
      const newRecipients = recipients.filter((r) => r !== recipient)
      newRecipients.push(id)
      socket.broadcast.to(recipient).emit('receive-message', {
        recipients: newRecipients,
        sender: id,
        text,
      })
    })
  })
})
