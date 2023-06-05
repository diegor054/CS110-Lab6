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
            res.json().then((data) => {
                this.setState({rooms:data})
            });
        });
    }  
    routeToRoom(room) {
        this.props.changeScreen("chatroom");
        this.socket.emit("join", {"room":room, "username":this.state.username});
        this.setState({room:room, username:this.state.username, screen: "chatroom", rooms: this.state.rooms});
    }

    render(){
        return(
            <div>
                <h1>Lobby</h1>
                {this.state.rooms ? this.state.rooms.map((room) => {
                    return <Button variant="contained" key={"roomKey"+room} 
                    onClick={() => 
                      this.routeToRoom(room)
                    } >{room}</Button> 
                }) : <div> "loading..." </div> }
                {/* write codes to join a new room using room id*/}
                {/* write codes to enable user to create a new room*/}
                
            </div>
        );
    }
}

export default Lobby;