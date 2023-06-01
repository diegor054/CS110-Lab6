import react from "react";
import Auth from './Screens/Auth.js';
import Lobby from "./Screens/Lobby.js";
import Chatroom from "./Screens/Chatroom.js";

const server_url = "http://localhost:3001";


class ScreenHandler extends react.Component{
    constructor(props){
        super(props);

        this.state = {
            screen: undefined,
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
                if (data.message == "logged in"){
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

    render(){
        let display = "loading...";
        if (this.state.screen == "auth"){
            display = <Auth server_url = {server_url} changeScreen={this.changeScreen}/>;
        }
        else if (this.state.screen == "lobby"){
            display = <Lobby server_url = {server_url}/>;
        }
        else if (this.state.screen == "chatroom"){
            display = <Chatroom server_url = {server_url}/>;
        }
        return(
            <div>
                {display}
            </div>
        );
    }
}

export default ScreenHandler;
