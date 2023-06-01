import react from "react";
import { Button } from "@mui/material";

class Lobby extends react.Component{
    constructor(props){
        super(props);
        this.state = {
            rooms: undefined,
        }
    }

    componentDidMount(){
        // TODO: write codes to fetch all rooms from server
    }


    render(){
        return(
            <div>
                <h1>Lobby</h1>
                {this.state.rooms ? this.state.rooms.map((room) => {
                    return <Button variant="contained" key={"roomKey"+room} onClick={() => alert(room)}>{room}</Button>
                }) : "loading..."}
                {/* write codes to join a new room using room id*/}
                {/* write codes to enable user to create a new room*/}
                
            </div>
        );
    }
}

export default Lobby;