
const ws = new WebSocket('ws://localhost:3000/server')

ws.onmessage = (event) => {
  console.log('Message received from server')
  const message = JSON.parse(event.data)
  console.log(message)
  chatMessages.innerHTML += createChatMessageElement(message)
}

const userInfoModal = document.querySelector('.user-info-modal')
const userInfoForm = document.querySelector('.user-info-form')

const chatHeader = document.querySelector('.chat-header')
const chatMessages = document.querySelector('.chat-messages')
const chatInputForm = document.querySelector('.chat-input-form')
const chatInput = document.querySelector('.chat-input')
const clearChatBtn = document.querySelector('.clear-chat-button')
const chatContainer = document.querySelector('.chat-container') 
let messageSender = ''
let chatCode = ''
let timeoutId = null

const createChatMessageElement = (message) => `
  <div class="message ${message.sender === messageSender ? 'blue-bg' : 'gray-bg'}">
    <div class="message-sender">${message.sender}</div>
    <div class="message-text">${message.text}</div>
    <div class="message-timestamp">${message.timestamp}</div>
  </div>
`

const updateMessageSender = (name, code) => {
  messageSender = name
  chatCode = code
  chatHeader.innerText = `${name} chatting with code: ${code}`
  chatInput.placeholder = `Type here, ${messageSender}...`

  chatInput.focus()
}

userInfoForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = e.target.username.value
  const chatCode = e.target.chatCode.value

  updateMessageSender(username, chatCode)

  ws.send(JSON.stringify({ type: 'join', chatCode }))
  userInfoModal.style.display = 'none'
})

const clearChat = () => {
  chatMessages.innerHTML = ''
}

const sendMessage = (e) => {
  e.preventDefault()

  const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const message = {
    sender: messageSender,
    text: chatInput.value,
    timestamp,
    chatCode,
  }

  ws.send(JSON.stringify(message))

  chatInputForm.reset()

  chatMessages.scrollTop = chatMessages.scrollHeight

  if (timeoutId) {
    clearTimeout(timeoutId)
  }

  timeoutId = setTimeout(clearChat, 120000)
}

chatContainer.style.backgroundImage = 'url(https://hdwpro.com/wp-content/uploads/2017/01/Red-Love-Heart-Wallpaper.jpg)';
chatContainer.style.backgroundSize = 'cover';
chatContainer.style.backgroundRepeat = 'no-repeat';

chatInputForm.addEventListener('submit', sendMessage)

clearChatBtn.addEventListener('click', () => {
  localStorage.clear()
  clearChat()
})