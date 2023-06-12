import react from "react";
import Form from "../Components/form.js";
import { Button } from "@mui/material";

class Auth extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            showForm: false,
            selectedForm: undefined,
            tokenRequired: true
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
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Request failed with status: ' + res.status);
            }
            return res.json();
        })
        .then((data) => {
            console.log(data);
               if (data.msg === "logged in") {
                    if (this.state.tokenRequired) {
                        console.log(data.tokenRequired, "token in log in")
                        this.setState({ showForm: true, selectedForm: "code" });
                    } else {
                    console.log(data.user, "in login")
                    this.setState({ showForm: false});
                    //this.props.setUser(data.user)
                   // this.props.changeScreen("lobby");

                    }
                }
                else {
                    alert(data.msg);
                }
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
    verifyCode = (data) => {
        const { verificationCode:token } = data; 
        fetch(this.props.server_url + '/api/auth/verify', {
            method: "POST",
            mode: "cors",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ token }), 
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Request failed with status: ' + res.status);
            }
            return res.json();
        })
        .then((data) => {
            if (data.msg === "logged in") {
                console.log(data.user, "in verify")
                this.setState({tokenRequired:false})
                //this.props.setUser(data.user)
                //this.props.changeScreen("lobby");
                this.props.setUser(data.user)
                this.props.changeScreen("lobby");
            } else {  
                alert(data.msg);
            }
        })
        .catch((error) => {
            console.error(error);
            alert('An error occurred. Please try again.');
        });
    }
    render(){
        let display = null;
        if (this.state.showForm){
            let fields = [];
            if (this.state.selectedForm === "login"){
                fields = ['email', 'password'];
                display = 
                    <Form 
                        fields={fields} 
                        close={this.closeForm} 
                        type="login" 
                        submit={this.login} 
                        key={this.state.selectedForm}
                    />;
            }
            else if (this.state.selectedForm === "register"){
                fields = [ 'username', 'email', 'password', 'name'];
                display = 
                    <Form 
                        fields={fields} 
                        close={this.closeForm} 
                        type="register" 
                        submit={this.register} 
                        key={this.state.selectedForm}
                    />;
            } 
            else if (this.state.selectedForm === "code") {
                display = (
                  <Form
                    fields={['verificationCode']}
                    close={this.closeForm}
                    type="verificationCode"
                    submit={this.verifyCode}
                    key={this.state.selectedForm}
                  />
                );
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
                <h1> Welcome to our website! Hope you enjoy! - Ann, Diego, Daniel, and Zach   </h1>
                {display}
                
            </div>
        );
    }
}

export default Auth;


/*
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
                    this.props.setUser(data.user)
                    this.props.changeScreen("lobby");
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
                if (data.status === 200) {
                    alert("Account created");
                    //this.props.changeScreen("lobby");
                }
                else {
                    if(data.msg === undefined){
                        alert("Username not available.")
                    }else{
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
*/