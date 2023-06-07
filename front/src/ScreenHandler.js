import react from "react";
import Auth from './Screens/Auth.js';
import Lobby from "./Screens/Lobby.js";
import Chatroom from "./Screens/Chatroom.js";
import { Button } from "@mui/material";
import "./Screens/screens.css"; 

const server_url = "http://localhost:3001";


class ScreenHandler extends react.Component{
    constructor(props){
        super(props);

        this.state = {
            rooms: undefined,
            username: '',
            room: '',
            screen: '',
            code: '',
            creator: '',
            creatorOfRoom: '',
            roomID:'',
        }
    }

    componentDidMount(){
        // checking if the user has active session
        // if yes, then show lobby. if no, then show auth
        fetch(server_url, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        }).then((res) => {
            res.json().then((data) => {
                if (data.message === "logged in"){
                    this.setState({screen: "lobby"});
                }
                else{
                    this.setState({screen: "auth"});
                }
            });
        });
    }

    changeScreen = (screen) => {
        this.setState({screen: screen});
        console.log("changeScreen: ", this.state.screen);
    }

    setRoom = (r) => {
        this.setState({room:r});
        console.log("setRoom: ", this.state.room);

    }
    setCode = (code) => {
        this.setState({code:code});
        console.log("setCode: ", this.state.code);
    }

    setUsername = (user) => {
        this.setState({username:user});
        console.log("setUsername: ", this.state.username);
    }

    setCreator = (c) => {
        this.setState({creator:c});
    }

    setCreatorOfRoom = (cor) => {
        this.setState({creatorOfRoom:cor});
    }

    setRoomID = (rid) => {
        this.setState({roomID: rid});
    }

    logout = (data) => {
        fetch(server_url + '/api/auth/logout', {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            
        }).then((res) => {
            res.json().then((data) => {
                if (data.msg === "logged out") {
                    this.changeScreen("auth");
                }
                else {
                    alert(data.msg);
                }
            });
        });
    }

    render(){
        let display = "loading...";
        if (this.state.screen === "auth"){
            display = <Auth server_url = {server_url} changeScreen={this.changeScreen} setUsername={this.setUsername} setCreator={this.setCreator}/>;
        }
        else if (this.state.screen === "lobby"){
            console.log("bruhhhhhh", this.state.creator)
            if (this.state.username === "") {
                this.changeScreen("auth"); 
                display = <Auth server_url = {server_url} changeScreen={this.changeScreen} setUsername={this.setUsername} setCreator={this.setCreator}/>;
            }
            display = <Lobby server_url = {server_url} changeScreen={this.changeScreen} setRoom={this.setRoom} username={this.state.username} setCode={this.setCode} creator={this.state.creator} setCreatorOfRoom={this.setCreatorOfRoom} setRoomID={this.setRoomID}/>;
        }
        else if (this.state.screen === "chatroom"){
            display = <Chatroom server_url = {server_url} changeScreen={this.changeScreen} room={this.state.room} username={this.state.username} code={this.state.code} creator={this.state.creator} roomCreator={this.state.creatorOfRoom} roomID={this.state.roomID} roomName={this.state.room}/>;
        }
        return( 
            <div>
                <div className="logout-button">
                <Button variant="contained"  
                    onClick={this.logout}
                    >Log out</Button>
                </div>
                {display}
            </div>
        );
    }
}

export default ScreenHandler;
