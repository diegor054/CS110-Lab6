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
      this.state = {
        messages: [],
        text: "",
        message: " ",
      };
      
      this.socket.on("chat message", (message)=>{
        this.state.messages = [...this.state.messages, message];
        console.log("all messages in this room: ", this.state.messages)
      })
      
    }
    
    componentDidMount() {
      console.log("chatroom mount: ", this.props.room, this.props.user); 
      this.socket.emit("join", {"room": this.props.room, "username": this.props.user});
    };

    handleMessageChange = (event) => {
      this.setState({ message: event.target.value });
    };
  
    handleSendMessage = () => {
      const { message } = this.state;
      this.socket.emit("chat message", message);
      this.setState({ message: "" });
    };
  
    goBack = () => {
      this.props.changeScreen("lobby");
    }

    render() {
 
      return (
        <div>
          <h2>Chatroom</h2>
          <div>
            {/* Show chats */}
            {this.state.messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
          <div>
            {/* Show chat input box */}
            <input
              type="text"
              value={this.state.message}
              onChange={this.handleMessageChange}
            />
            <button onClick={this.handleSendMessage}>Send</button>
            <button onClick={this.goBack}>Back</button>
            
          </div>
        </div>
      );
    }
}

export default Chatroom;