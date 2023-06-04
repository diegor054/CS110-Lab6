import react from "react";
import { Button } from "@mui/material";
import {io} from 'socket.io-client'
import Chatroom from "./Chatroom";

class Lobby extends react.Component{
    constructor(props){
        super(props);
        this.socket = io('http://localhost:3001');
        console.log("here")
        this.state = {
            rooms: undefined,
            username: '',
           // room: '',
            screen: "starting",
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

    render(){
        return(
            <div>
                <h1>Lobby</h1>
                {this.state.rooms ? this.state.rooms.map((room) => {
                    return <Button variant="contained" key={"roomKey"+room} 
                    onClick={() => 
                        //alert(room)
                        this.socket.emit("join", {"room":room, "username":this.username})
                    } >{room}</Button> 
                }) : <div> "loading..." </div> }
                {/* write codes to join a new room using room id*/}
                {/* write codes to enable user to create a new room*/}
                
            </div>
        );
    }
}

export default Lobby;