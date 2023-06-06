import react from "react";
import { Button } from "@mui/material";
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
            username: '',
            room: '',
            screen: 'lobby',
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
            console.log("component did mount");
            res.json().then(data => {
                console.log("data:",data);
                this.setState({rooms:data, username: this.props.username}); 
                console.log("after setting rooms & username:",this.state.rooms, this.props.username); 
            });
        });
    }  
    routeToRoom(room) {
        console.log("route to room: room, username, rooms"); 
        console.log(room, this.state.username, this.state.rooms);
        this.props.changeScreen("chatroom");
        this.props.setRoom(room);

        this.socket.emit("join", {"room":room, "username":this.state.username});
        this.setState({room: room, username:this.state.username, screen: "chatroom", rooms: this.state.rooms});
        // console.log("after setting state: room, username, screen, rooms"); 
        // console.log(this.state.room, this.state.username, this.state.screen, this.state.rooms);
    }

    render(){
        return(
            <div>
                <h1>Lobby</h1>
                <h2>Welcome {this.state.username}!</h2>
                <div class="room-buttons">
                {this.state.rooms ? this.state.rooms.map((room) => {
                    return <Button variant="contained" key={"roomKey"+room} 
                    onClick={() => 
                        {
                            // console.log("clicked route to room"); 
                            this.routeToRoom(room);
                            // console.log("after calling function: room, username, screen, rooms"); 
                            // console.log(this.state.room, this.state.username, this.state.screen, this.state.rooms);
                        }
                    } >{room}</Button> 
                }) : <div> "loading..." </div> }
                </div>
                <div class="room-buttons">
                    <Button variant="contained">Join Room</Button>
                    <Button variant="contained">Create Room</Button>
                </div> 
                {/* write codes to join a new room using room id*/}
                {/* write codes to enable user to create a new room*/}
                
            </div>
        );
    }
}

export default Lobby;