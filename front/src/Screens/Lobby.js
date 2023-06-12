import react from "react";
import { Button, TextField } from "@mui/material";
import { io } from 'socket.io-client';
import DefaultPfp from "./../default-pfp.jpg"
import './screens.css';

class Lobby extends react.Component {
    constructor(props) {
        super(props);
        this.socket = io('http://localhost:3001', {
            cors: {
                origin: 'http://localhost:3001',
                credentials: true
            }, transports: ['websocket']
        });
        this.state = {
            rooms: undefined,
            room: '',
            screen: 'lobby',
            createRoomName: '',
            profilePic: '',
            nameChange: ''
        }
    }

    componentDidMount = (data) => {
        // fetch all rooms from server
        fetch(this.props.server_url + '/api/rooms/all', {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => {
            res.json().then(data => {
                this.setState({ rooms: data })
                this.setState({ profilePic: this.props.user.pfp })
                console.log("Component Mount in Lobby (User Data): ", this.props.user)
            });
        });
    }

    routeToRoom(room) {
        this.props.changeScreen("chatroom");
        this.props.setRoom(room);
        this.socket.emit("join", { "room": room.name, "username": this.props.user.userName, "creator": room.creator });
        this.setState({ room: room, username: this.state.username, screen: "chatroom", rooms: this.state.rooms });
    }

    handleJoinRoom = () => {
        fetch(this.props.server_url + '/api/rooms/join', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomCode: this.state.joinRoomName }),
        }).then((res) => {
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
        }).then((res) => {
            res.json().then((data) => {
                this.routeToRoom(data.room);
            })
        });
    };

    handleImageChange = async (event) => {
        const f = event.target.files[0];
        const b64 = await this.convertToBase64(f);
        this.props.setPFP(b64);
        this.setState({ profilePic: b64 })
        event.target.value = null;
    };

    convertToBase64 = (file) => {
        //used to convert to readable format
        return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                res(reader.result);
            };
            reader.onerror = (error) => {
                rej(error);
            };
        });
    };

    handleNameSubmit = (event) => {
        const newName = this.state.nameChange;
        this.setState({ nameOfUser: newName });
        this.props.setName(newName);
        this.setState({ nameChange: '' })
    };

    handleNameChange = (event) => {
        this.setState({ nameChange: event.target.value });
    };

    render() {
        return (
            <div>
                <h1>Lobby</h1>
                <h2>Welcome {this.props.user.userName}!</h2>
                <div style={{ display: "flex" }}>
                    <div className="room-buttons" style={{ width: "70%" }}>
                        {this.props.user.rooms ? this.props.user.rooms.map((room) => {
                            return <Button variant="contained" key={room._id} style={{ width: "160px", height: "100px" }} onClick={() => {this.routeToRoom(room);}}>
                                <div className="room-button">
                                    <div className="room-name">{room.name}</div>
                                    <div className="room-code">code: {room.code}</div>
                                </div>
                            </Button>
                        }) : <div> "loading..." </div>}
                    </div>
                    <div style={{ width: "30%", height: "100%", border: "solid  #e6ecf0", marginLeft: "70px" }}>
                        <div style={{ textAlign: "center", borderBottom: "solid  #e6ecf0" }}><h3>My Profile</h3></div>
                        <div>
                            {this.state.profilePic === null ? (
                                <img src={DefaultPfp} alt="ProfilePic." style={{ margin: "20px", objectFit: "contain", height: "100px", width: "100px" }}/>
                            ) : (
                                <img src={this.state.profilePic} alt="ProfilePic." style={{ margin: "20px", objectFit: "contain", height: "100px", width: "100px" }}/>
                            )}
                        </div>
                        <div style={{ paddingLeft: "5px" }}>
                            <input type="file" onChange={this.handleImageChange}/>
                            <br/>
                            small images only: 25.0 KB maximum
                        </div>
                        <div style={{ paddingLeft: "5px" }}><h4>Name: {this.props.user.nameOfUser}</h4></div>
                        <div style={{ paddingLeft: "5px" }}>
                            <input type="text" placeholder="Change Name" value={this.state.nameChange} onChange={this.handleNameChange}/>
                            <button onClick={this.handleNameSubmit}>Submit</button>
                        </div>
                        <div style={{ paddingLeft: "5px" }}><h4>Username: {this.props.user.userName}</h4></div>
                    </div>
                </div>
                <div className="room-buttons">
                    <TextField
                        label="Room Code"
                        variant="outlined"
                        value={this.state.joinRoomName}
                        onChange={(e) => this.setState({ joinRoomName: e.target.value })}
                    />
                    <Button variant="contained" onClick={this.handleJoinRoom}>Join Room</Button>
                    <TextField
                        label="Room Name"
                        variant="outlined"
                        value={this.state.createRoomName}
                        onChange={(e) => this.setState({ createRoomName: e.target.value })}
                    />
                    <Button variant="contained" onClick={this.handleCreateRoom}>Create Room</Button>
                </div>
            </div>
        );
    }
}

export default Lobby;
