import react from "react";
import {io} from 'socket.io-client';
import './screens.css'; 

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
        message: "",
      };
      
      this.socket.on("chat message", (data) => {
        this.setState((prevState) => ({
          messages: [...prevState.messages, data.message],
        }));
        console.log("all messages in this room: ", this.state.messages)
      });
      
    }

    handleMessageChange = (event) => {
      this.setState({ message: event.target.value });
    };
  
    componentDidMount = (data) => {
      console.log("chatroom mount: ", this.props.room, this.props.username); 
      this.socket.emit("join", {"room": this.props.room, "username": this.props.username});
      // Get initial message history from the db
      this.fetchMessages();
      // Start long polling to check for new messages periodically
      this.startLongPolling();
    }

    fetchMessages() {
      fetch(this.props.server_url + '/api/messages/' + `${this.props.room}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
        console.log("pulled messages from db");
        res.json().then(data => {
          this.setState({ messages: data });
          //this.setState({rooms:data, username: this.props.username}); 
        });
      }).catch((error) => {
        console.log("Error fetching messages:", error);
      });
    }

    startLongPolling() {
      const pollInterval = 5000; // Polling interval in milliseconds
      const checkForNewMessages = () => {
        const lastMessageCount = this.state.messages.length;
        const url = `${this.props.server_url}/api/messages/check/${this.props.room}?lastMessageCount=${lastMessageCount}`;
        
        fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            } else {
              throw new Error("Failed to check for new messages.");
            }
          })
          .then((data) => {
            if (data.newMessageCount > 0) {
              // New messages are available, so fetch and update the message list
              this.fetchMessages();
            }
          })
          .catch((error) => {
            console.log("Error checking for new messages:", error);
          })
          .finally(() => {
            // Schedule the next polling request
            setTimeout(checkForNewMessages, pollInterval);
          });
      };
      // Start the initial polling request
      checkForNewMessages();
    }

    handleSendMessage = () => {
      const { message } = this.state;
      const {username, room} = this.props;
      const data = {
        username: username,
        room: room,
        message: message
      }
      this.socket.emit("chat message", data);
      this.setState({ message: "" });
      fetch(this.props.server_url + '/api/messages', {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
    }).then((res) => {
        res.json().then((data) => {
            console.log(data.status)
            if (data.status === 200) {
                //alert("Account created");
                //this.props.changeScreen("lobby");
            }
            else {
                console.log("failed to send message to database")
                alert(data.msg);
            }
        });
    });
    };
  
    goBack = () => {
      this.props.changeScreen("lobby");
    }

    render() {
 
      return (
        <div >
          <h2>Chatroom {this.props.room}</h2>
          <div>
            {/* Show chats */}
            {this.state.messages.map((message, index) => (
              <div key={index}>{message.sender}: {message.message}</div>
            ))}
          </div>
          <div>
            {/* Show chat input box */}
            <input
              type="text"
              value={this.state.message}
              onChange={this.handleMessageChange}
            />
            <button class="msg-button" onClick={this.handleSendMessage}>Send</button>
            <button class="msg-button" onClick={this.goBack}>Back</button>
          </div>
        </div>
      );
    }
}

export default Chatroom;