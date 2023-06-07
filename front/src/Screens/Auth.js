/*import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";

class Auth extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            showForm: false,
            selectedForm: undefined,
        }
    }

    closeForm = () => {
        this.setState({showForm: false});
    }

    login = (data) => {
        fetch(this.props.server_url + '/api/auth/login', {
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
                if (data.msg === "logged in") {
                    //this.setState({screen: "lobby"});
                    this.props.changeScreen("lobby");
                    console.log("this is my data", data.creator)
                    this.props.setCreator(data.creator);
                    this.props.setUsername(data.user)
                }
                else {
                    alert(data.msg);
                }
            });
        });
    }

    register = (data) => {
        fetch(this.props.server_url + '/api/auth/signup', {
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
                    alert("Account created. Please log in");
                    //this.props.changeScreen("lobby");
                }
                else {
                    if(data.msg === undefined){
                        alert("Not available.")
                    }else{
                    console.log("failed")
                    alert(data.msg);
                    }
                }
            });
        });
    }

    render(){
        let display = null;
        if (this.state.showForm){
            let fields = [];
            if (this.state.selectedForm === "login"){
                fields = ['email', 'password'];
                display = <Form fields={fields} close={this.closeForm} type="login" submit={this.login} key={this.state.selectedForm}/>;
            }
            else if (this.state.selectedForm === "register"){
                fields = [ 'username', 'email', 'password', 'name'];
                display = <Form fields={fields} close={this.closeForm} type="register" submit={this.register} key={this.state.selectedForm}/>;
            }   
        }
        else{
            display = <div>
                <Button onClick={() => this.setState({showForm: true, selectedForm:"login"})}> Login </Button>
                <Button onClick={() => this.setState({showForm: true, selectedForm: "register"})}> Register </Button>
                </div>              ;
        }
        return(
            <div>
                <h1> Welcome to our website! </h1>
                {display}
                
            </div>
        );
    }
}
export default Auth;
*/

import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";

class Auth extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            showForm: false,
            selectedForm: undefined,
        }
    }

    closeForm = () => {
        this.setState({showForm: false});
    }

    login = (data) => {
        fetch(this.props.server_url + '/api/auth/login', {
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
                if (data.msg === "logged in") {
                    //this.setState({screen: "lobby"});
                    this.props.changeScreen("lobby");
                    console.log("this is my data", data.creator)
                    this.props.setCreator(data.creator);
                    this.props.setUsername(data.user)
                }
                else {
                    alert(data.msg);
                }
            });
        });
    }

    register = (data) => {
        fetch(this.props.server_url + '/api/auth/signup', {
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
                    alert("Account created");
                    //this.props.changeScreen("lobby");
                }
                else {
                    if(data.msg === undefined){
                        alert("Username not available.")
                    }else{
                    console.log("failed")
                    alert(data.msg);
                    }
                }
            });
        });
    }

    render(){
        let display = null;
        if (this.state.showForm){
            let fields = [];
            if (this.state.selectedForm === "login"){
                fields = ['username', 'password'];
                display = <Form fields={fields} close={this.closeForm} type="login" submit={this.login} key={this.state.selectedForm}/>;
            }
            else if (this.state.selectedForm === "register"){
                fields = [ 'username', 'password', 'name'];
                display = <Form fields={fields} close={this.closeForm} type="register" submit={this.register} key={this.state.selectedForm}/>;
            }   
        }
        else{
            display = <div>
                <Button onClick={() => this.setState({showForm: true, selectedForm:"login"})}> Login </Button>
                <Button onClick={() => this.setState({showForm: true, selectedForm: "register"})}> Register </Button>
                </div>              ;
        }
        return(
            <div>
                <h1> Welcome to our website! </h1>
                {display}
                
            </div>
        );
    }
}

export default Auth;