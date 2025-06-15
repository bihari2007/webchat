import {WebSocketServer, WebSocket} from "ws";

const wss = new WebSocketServer({port:8080});

interface Users{
    socket: WebSocket,
    room: string
}

let allSockets: Users[] = [];

wss.on("connection", (socket) => {

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string);

        // users join
        if(parsedMessage.type === "join"){
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }

        // checking the user before he sends message
        if(parsedMessage.type === "chat"){
            let currentUserRoom = null;
            for(let i=0; i<allSockets.length; i++){
                if(allSockets[i].socket == socket){
                currentUserRoom = allSockets[i].room
            }
        }
        
        // sending message to all present in the room
        for(let i=0; i<allSockets.length; i++){
            if(allSockets[i].room === currentUserRoom && allSockets[i].socket !=socket){
                allSockets[i].socket.send(JSON.stringify({ type: "chat", message: parsedMessage.payload.message }))

            }
        }}
    })
    
});