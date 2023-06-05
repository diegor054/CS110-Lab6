import react from "react";
import {io} from 'socket.io-client'

class Chatroom extends react.Component{
    constructor(props){
        super(props);
        this.socket = io('http://localhost:3001', {
        cors: {
        origin: 'http://localhost:3001',
        credentials: true
      }, transports: ['websocket']
    });
    }


    render(){
        return(
            <div>
                {/* show chats */}
                {/* show chat input box*/}
                Chatroom
            </div>
        );
    }
}

export default Chatroom;