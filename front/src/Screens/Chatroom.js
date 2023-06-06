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
          messages: [...prevState.messages, data],
        }));
        console.log("all messages in this room: ", this.state.messages)
      });
      
    }

    handleMessageChange = (event) => {
      this.setState({ message: event.target.value });
    };
  
    componentDidMount = (data) => {
      console.log("chatroom mount: ", this.props.room, this.props.username, this.props.creator, this.props.code); 
      this.socket.emit("join", {"room": this.props.room, "username": this.props.username});
      // Get initial message history from the db
      this.fetchMessages();
      // Start long polling to check for new messages periodically
      this.startLongPolling();
    }

    fetchMessages() {
      fetch(this.props.server_url + '/api/messages/' + this.props.room, {
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

    pollingTimeout;
    isPolling = false; // Flag to track if a polling request is in progress

    startLongPolling() {
      const pollInterval = 2000; // Polling interval in milliseconds
  
      const checkForNewMessages = () => {
        if (this.isPolling) {
          return; // If a polling request is already in progress, do nothing
        }
  
        this.isPolling = true; // Set the flag to indicate that a request is now in progress
  
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
            console.log("data in poll: ", data.newMessages);
            if (data.newMessages) {
              // New messages are available, so fetch and update the message list
              this.fetchMessages();
            }
          })
          .catch((error) => {
            console.log("Error checking for new messages:", error);
          })
          .finally(() => {
            this.isPolling = false; // Reset the flag to indicate that the request has completed
            this.pollingTimeout = setTimeout(checkForNewMessages, pollInterval);
          });
      };
  
      // Start the initial polling request
      checkForNewMessages();
    }

    componentWillUnmount() {
      clearTimeout(this.pollingTimeout);
      console.log("CHATROOM UNMOUNT");
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
    handleDeleteRoom = () => {
      this.socket.emit("delete room", this.props.room);
    }
    goBack = () => {
      this.props.changeScreen("lobby");
    }

    render() {
      const isCreator = this.props.creator === this.props.username;
      console.log("Render props: ", this.props.room, this.props.username, this.props.creator, this.props.code, isCreator);

      return (
        <div >
          <h2>Chatroom: {this.props.room} - invite friends with this code:{this.props.code} </h2>
          <div>
            {/* Show chats */}
            {this.state.messages.map((message, index) => (
              <div key={index}>{message.sender ? message.sender : message.username}: {message.message}</div>
            ))}
          </div>
          <div>
            {/* Show chat input box */}
            <input
              type="text"
              value={this.state.message}
              onChange={this.handleMessageChange}
            />
            <button className="msg-button" onClick={this.handleSendMessage}>Send</button>
            <button className="msg-button" onClick={this.goBack}>Back</button>
            {isCreator && (
              <button className="msg-button" onClick={this.handleDeleteRoom}>Delete Room</button>
            )}
          </div>
        </div>
      );
    }
}

export default Chatroom;