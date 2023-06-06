import react from "react";
import { Button } from "@mui/material";
import {io} from 'socket.io-client'


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
            body: JSON.stringify(data),
        }).then((res) => {
            console.log("component did mount");
            res.json().then(data => {
                console.log("data:",data);
                this.setState({rooms:data}); 
                console.log("after setting rooms:",this.state.rooms, this.state.username); 
            });
        });
    }  
    routeToRoom(prop_room) {
        console.log("route to room"); 
        console.log(prop_room, this.state.username, this.state.rooms);
        this.props.changeScreen("chatroom");
        this.props.setRoom(prop_room);
        this.socket.emit("join", {"room":prop_room, "username":this.state.username});
        this.setState({room: prop_room, username:this.state.username, screen: "chatroom", rooms: this.state.rooms});
        console.log(this.state.room, this.state.username, this.state.screen, this.state.rooms);
    }

    render(){
        return(
            <div>
                <h1>Lobby</h1>
                {this.state.rooms ? this.state.rooms.map((room) => {
                    return <Button variant="contained" key={"roomKey"+room} 
                    onClick={() => 
                        {
                            console.log("clicked route to room"); 
                            this.routeToRoom(room);
                        }
                    } >{room}</Button> 
                }) : <div> "loading..." </div> }
                <div style={{padding:"20px 0px 0px 0px"}}>
                    <button variant="contained">Join Room</button>
                    <button variant="contained">Create Room</button>
                </div> 
                {/* write codes to join a new room using room id*/}
                {/* write codes to enable user to create a new room*/}
                
            </div>
        );
    }
}

export default Lobby;