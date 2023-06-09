import react from "react";
import { Button, TextField } from "@mui/material";
import {io} from 'socket.io-client';
import './screens.css'; 



class Lobby extends react.Component{
    constructor(props){
        super(props);
        this.socket = io('http://localhost:3001', {
            cors: {
            origin: 'http://localhost:3001',
            credentials: true
          }, transports: ['websocket']
        });
        this.state = {
            rooms: undefined,
            //username: '',
            room: '',
            screen: 'lobby',
            //creator: '',
            createRoomName:''
        }
    }

    componentDidMount = (data) =>{
        // fetch all rooms from server
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            res.json().then(data => {
                this.setState({rooms:data})
                console.log("hooooooooo", this.props.user)
            });
        });
    }  
    routeToRoom(room) {
        this.props.changeScreen("chatroom");
        this.props.setRoom(room);
        console.log("route to route ", room)
        this.socket.emit("join", {"room":room.name, "username":this.props.user.username, "creator":room.creator});
        this.setState({room: room, username:this.state.username, screen: "chatroom", rooms: this.state.rooms});
    }

    handleJoinRoom = () => {
        fetch(this.props.server_url + '/api/rooms/join', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomCode: this.state.joinRoomName }),
        })
        .then((res) => {
            res.json().then((data) => {
            this.routeToRoom(data.room); 
            })
        });
    };
    
    handleCreateRoom = () => {
        fetch(this.props.server_url + '/api/rooms/create', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomName: this.state.createRoomName }),
        })
        //.then((response) => response.json())
        .then((res) => {
            res.json().then((data) => {
            this.routeToRoom(data.room); 
        })
    });
    };
    
    render(){
        return(
            <div>
                <h1>Lobby</h1>
                <h2>Welcome {this.props.user.userName}!</h2>
                <div className="room-buttons">
                {this.props.user.rooms ? this.props.user.rooms.map((room) => {
                    return <Button variant="contained" key={room._id} 
                    onClick={() => 
                        {
                            this.routeToRoom(room);
                        }
                    } >
                        <div className="room-button">
                            <div className="room-name">{room.name}</div>
                            <div className="room-code">code: {room.code}</div> 
                        </div>
                    </Button> 
                }) : <div> "loading..." </div> }
                </div>
                <div className="room-buttons">
                    <TextField
                        label="Room Code"
                        variant="outlined"
                        value={this.state.joinRoomName}
                        onChange={(e) => this.setState({ joinRoomName: e.target.value })}
                    />
                    <Button variant="contained" onClick={ this.handleJoinRoom}>Join Room</Button>
                    <TextField
                        label="Room Name"
                        variant="outlined"
                        value={this.state.createRoomName}
                        onChange={(e) => this.setState({ createRoomName: e.target.value })}
                    />
                    <Button variant="contained" onClick={this.handleCreateRoom}>Create Room</Button>
                </div> 
                {/* write codes to join a new room using room id*/}
                {/* write codes to enable user to create a new room*/}
                
            </div>
        );
    }
}

export default Lobby;
