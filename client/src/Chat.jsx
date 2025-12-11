import { useContext, useEffect, useRef, useState } from "react"
import Avatar from "./Avatar"
import Logo from "./Logo"
import axios from "axios"
import { UserContext } from "./UserContext"
import Contact from "./Contact"

function Chat() {
  const [ws, setWs] = useState(null)
  const [onlinePeople, setOnlinePeople] = useState({})
  const [offlinePeople, setOfflinePeople] = useState({})
  const [selectedUser, setSelectedUser] = useState(null)
  const [newMessageText, setNewMessageText] = useState('')
  const [messages, setMessages] = useState([])
  const { id, username, setId, setUsername } = useContext(UserContext)
  const divUnderMessages = useRef()

  useEffect(() => {
    connectToWebSocket()
  }, [])

  function connectToWebSocket() {
    const ws = new WebSocket('ws://localhost:4000')
    setWs(ws)
    ws.addEventListener('message', handleMessage)
    ws.addEventListener('close', () => {
      setTimeout(() => {
        console.log("Disconnected. Trying to reconnect...")
        connectToWebSocket()
      }, 1000);
    })
  }

  function showOnlinePeople(peopleArray) {
    const people = {}
    peopleArray.forEach(({ userID, username }) => {
      people[userID] = username
    })
    setOnlinePeople(people)
  }

  function handleMessage(e) {
    const messageData = JSON.parse(e.data)
    if ('online' in messageData) {
      showOnlinePeople(messageData.online)
    }
    else {
      setMessages(prev => ([...prev, messageData]))
    }
  }

  function sendMessage(ev) {
    ev.preventDefault()
    ws.send(JSON.stringify({
      recepient: selectedUser,
      text: newMessageText,
    }))
    setMessages(prev => ([...prev, {
      text: newMessageText,
      sender: id,
      recepient: selectedUser,
    }]))
    setNewMessageText('')
  }

  function logout() {
    axios.post('/logout').then(() => {
      setWs(null)
      setId(null)
      setUsername(null)
    })
  }

  function handleExitChat(ev) {
    if (ev.key === 'Escape') {
      setSelectedUser(null)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleExitChat)
  })

  useEffect(() => {
    const div = divUnderMessages.current
    if (div) {
      div.scrollIntoView({ behaviour: 'smooth', block: 'end' })
    }
  }, [messages])

  useEffect(() => {
    if (selectedUser) {
      axios.get('/messages/' + selectedUser).then(res => {
        setMessages(res.data)
      })
    }
  }, [selectedUser])

  useEffect(() => {
    axios.get('/people').then(res => {
      const offlinePeopleArr = res.data
        .filter(p => p._id !== id)
        .filter(p => !Object.keys(onlinePeople).includes(p._id))

      const offline = {}
      offlinePeopleArr.forEach(p => {
        offline[p._id] = p.username;
      })
      setOfflinePeople(offline)
    })
  }, [onlinePeople])

  const onlinePeopleExcludingUser = { ...onlinePeople }
  delete onlinePeopleExcludingUser[id]

  return (
    <div className='flex h-screen font-geom'>

      {/* Sidebar */}
      <div className='bg-background w-1/4 flex flex-col select-none px-3'>
        <div className="text-white font-bold text-3xl py-3 px-3">My Chats</div>
        <div className="overflow-y-scroll h-full no-scrollbar">
          {Object.keys(onlinePeopleExcludingUser).map(id => (
            <Contact
              key={id}
              id={id}
              selected={id === selectedUser}
              username={onlinePeopleExcludingUser[id]}
              online={true}
              onClick={() => setSelectedUser(id)}
            />
          ))}
          {Object.keys(offlinePeople).map(id => (
            <Contact
              key={id}
              id={id}
              selected={id === selectedUser}
              username={offlinePeople[id]}
              online={false}
              onClick={() => setSelectedUser(id)}
            />
          ))}
        </div>

        {/* Sidebar buttons */}
        <div className="flex items-center py-3 justify-between px-5 gap-5">
          <div className="text-text">
            Logged in as {username}
          </div>
          <button
            onClick={logout}
            className="bg-primary p-2 rounded-lg text-text hover:cursor-pointer hover:shadow-lg hover: shadow-primary/60 hover:bg-primary/90 hover:scale-103 transition-all duration-300"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className='flex flex-col bg-background-secondary w-3/4'>

        {/* Chat Header */}
        {selectedUser && (
          <div className="bg-background p-3 border-b border-primary/50 flex items-center gap-3 text-text select-none">
            <Avatar
              username={(onlinePeople[selectedUser] ? onlinePeople[selectedUser] : offlinePeople[selectedUser])}
              userID={selectedUser}
              online={(onlinePeople[selectedUser] ? true : false)}
            />
            {(onlinePeople[selectedUser] ? onlinePeople[selectedUser] : offlinePeople[selectedUser])}
          </div>
        )}

        {/* Messages Area */}
        <div className="grow">
          {!selectedUser && (
            <div className="flex items-center justify-center h-full text-text text-2xl font-medium flex-col opacity-60 select-none">
              <div className="scale-150">
                <Logo />
              </div>
              Select a chat
            </div>
          )}
          {!!selectedUser && (
            <div className="relative h-full">
              <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-0 py-2">
                {messages.map((message, _) => (
                  <div key={_} className={(message.sender === id ? 'text-right' : 'text-left')}>
                    <div
                      className={"mx-2 my-1 inline-block text-left rounded-lg p-2 text-text " + (message.sender === id ? "bg-primary" : "bg-background")}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                <div ref={divUnderMessages}></div>
              </div>
            </div>
          )}
        </div>

        {/* Message Box */}
        {!!selectedUser && (
          <form
            className="flex bg-white border-t border-primary"
            onSubmit={sendMessage}
          >
            <input
              value={newMessageText}
              onChange={ev => setNewMessageText(ev.target.value)}
              type="text"
              placeholder='Message'
              className='bg-white w-full p-3 focus:outline-none'
            />
            <button type="submit" className="bg-primary w-1/10 flex justify-center items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 12l-.604-5.437C4.223 5.007 5.825 3.864 7.24 4.535l11.944 5.658c1.525.722 1.525 2.892 0 3.614L7.24 19.465c-1.415.67-3.017-.472-2.844-2.028L5 12Zm0 0h7" /></svg>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Chat