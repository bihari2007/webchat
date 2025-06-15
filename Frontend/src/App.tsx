import { useEffect, useRef, useState } from 'react'
import './App.css'

function App(){

  const [messages, setMessages] = useState<string[]>([]);
  const roomIdRef = useRef<string | null>(null);
  const RoomIdInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<WebSocket>(null);
  const SendMessageInputRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    const Socket = new WebSocket("wss://web2-chat-app.onrender.com");
    socketRef.current = Socket;
  
    Socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "chat" && data.message) {
        setMessages((m) => [...m, `Stranger: ${data.message}`]);
      }
    };
  }, []);
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364] font-sans text-white">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-7xl">
        
        <div className="w-full lg:w-96 h-auto bg-[#1e293b] rounded-2xl shadow-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-center text-xl font-semibold mb-6">Enter Room Id</div>
            <input 
              ref={RoomIdInputRef}
              className="w-full p-3 mb-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Room Id"
            />
          </div>
          <button 
            onClick={() => {
              const createdroomID = RoomIdInputRef.current?.value;
              if (socketRef.current && createdroomID) {
                socketRef.current.send(JSON.stringify({ type: "join", payload: { roomId: createdroomID } }));
                roomIdRef.current = createdroomID;
              }
            }}
            className="w-full p-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium text-white"
          >
            Join Room
          </button>
        </div>

        <div className="w-full h-[500px] bg-[#1e293b] rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="overflow-y-auto p-4 space-y-3 h-[400px] custom-scrollbar">
            {messages.map((msg, idx) => (
              <div key={idx} className="bg-gray-100 text-gray-800 p-3 rounded-lg shadow-sm max-w-[90%]">
                {msg}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 p-4">
            <input
              ref={SendMessageInputRef}
              className="flex-1 p-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
            />
            <button 
              onClick={() => {
                const sentMessage = SendMessageInputRef.current?.value;
                if (SendMessageInputRef.current && socketRef.current?.readyState === WebSocket.OPEN && roomIdRef.current && sentMessage) {
                  socketRef.current.send(JSON.stringify({ type: "chat", payload: { message: sentMessage }}));
                  setMessages((prev) => [...prev, `You: ${sentMessage}`]);
                  SendMessageInputRef.current.value = '';
                }
              }}
              className="w-full sm:w-auto p-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
