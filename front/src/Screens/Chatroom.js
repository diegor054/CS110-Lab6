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
      this.socket.emit("join", {"room": this.props.room.name, "username": this.props.user.userName});
      // Get initial message history from the db
      this.fetchMessages();
      // Start long polling to check for new messages periodically
      this.startLongPolling();
    }

    fetchMessages() {
      fetch(this.props.server_url + '/api/messages/' + this.props.room.name, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => {
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
        const url = `${this.props.server_url}/api/messages/check/${this.props.room.name}?lastMessageCount=${lastMessageCount}`;
  
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
    }

    handleSendMessage = () => {
      const data = {
        username: this.props.user.userName,
        room: this.props.room.name,
        message: this.state.message
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
      fetch(this.props.server_url + '/api/rooms/delete', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ "roomID": this.props.room._id, "roomName": this.props.room.name}),
      })
      .then((data) => {
         this.props.changeScreen("lobby");
      });
  };

  handleLeaveRoom = () => {
    fetch(this.props.server_url + '/api/rooms/leave', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "roomID": this.props.room._id, "roomName": this.props.room.name, "userID": this.props.user._id}),
    })
    .then((res) => {
        res.json().then(data => {
            this.setState({rooms:data, username: this.props.user.username, creator:this.props.room.creator});
            this.props.changeScreen("lobby"); 
        });
    });

};

    goBack = () => {
      this.props.changeScreen("lobby");
    }

    render() { 
      const isCreator = (this.props.user._id === this.props.room.creator);

      return (
        <div >
          <h2>Chatroom: {this.props.room.name}</h2>
          <h3>Invite friends with this code: {this.props.room.code}</h3>
          <div className="msg-container">
            {/* Show chats */}
            {this.state.messages.map((message, index) => (
              <div key={index}>{message.sender ? message.sender : message.username}: {message.message}</div>
            ))}
          </div>
          <div className="chat-div">
            {/* Show chat input box */}
            <input
              type="text"
              value={this.state.message}
              onChange={this.handleMessageChange}
            />
            <button className="msg-button" onClick={this.handleSendMessage}>Send</button>
            <button className="msg-button" onClick={this.goBack}>Back</button>
            {isCreator ? (
              <button className="msg-button" onClick={this.handleDeleteRoom}>Delete Room</button>
            )
          :
          (
            //<button className="msg-button" onClick={this.handleLeaveRoom}>Forget Room</button>
            <div/>
          )
          }
          </div>
        </div>
      );
    }
}

export default Chatroom;