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
            room: '',
            screen: '',
            user: {
                    userName: '',
                    userID: '',
                    rooms: [],
                    nameOfUser: '',
                    pfp: '',
            }
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
    }

    setRoom = (r) => {
        this.setState({room:r});
    }

    setRooms = (rs) => {
        this.state.user.rooms = rs;
    }

    setPFP = (p) => {
        this.state.user.pfp = p;
        fetch(server_url + '/api/auth/editPFP', {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ newProfilePic: p, username: this.state.user.userName }),
        })
    }

    setUser = (u) => {
        let newUser = {
            userName: u.username,
            userID: u._id,
            rooms: u.rooms,
            nameOfUser: u.name,
            pfp: u.pfp
        }
        console.log("in screen handler", newUser)
        this.setState({user: newUser})
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
            display = <Auth server_url = {server_url} changeScreen={this.changeScreen} setUser={this.setUser}/>;
        }
        else if (this.state.screen === "lobby"){
            if (this.state.user.nameOfUser === "") {
                this.changeScreen("auth"); 
                display = <Auth server_url = {server_url} changeScreen={this.changeScreen} setUser={this.setUser}/>;
            }
            else {
                display = <Lobby server_url = {server_url} changeScreen={this.changeScreen} setRoom={this.setRoom} user={this.state.user} setPFP={this.setPFP}/>;
            }
        }
        else if (this.state.screen === "chatroom"){
            display = <Chatroom server_url = {server_url} changeScreen={this.changeScreen} room={this.state.room} user={this.state.user} setRooms={this.setRooms} pfp={this.state.user.pfp}/>;
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
