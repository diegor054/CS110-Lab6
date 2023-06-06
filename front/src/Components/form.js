import react from "react";
import { Button, TextField } from "@mui/material";
import './../Screens/screens.css'; 

class Form extends react.Component{
    constructor(props){
        super(props);
        // for each item in props.fields, create an item in this.state.fields
        let fields = [];
        for (let i = 0; i < props.fields.length; i++) {
            fields.push(["", props.fields[i]]);
        }
        this.state = {
            fields: fields,
        }
    }

    handleChange = (event, index) => {
        let fields = this.state.fields;
        fields[index][0] = event.target.value;
        this.setState({fields: fields});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let fields = this.state.fields;
        let data = {};
        for (let i = 0; i < fields.length; i++) {
            data[fields[i][1]] = fields[i][0];
        }
        this.props.submit(data);
    }

    render(){
        return (
            <div>
                
                <Button onClick={this.props.close}> x </Button>
                <div class="user-form">
                    <h3> {this.props.type} </h3>

                    <form onSubmit={this.handleSubmit}>
                        {this.state.fields.map((field, index) => {
                            return(
                                <div>
                                    <TextField 
                                        variant="standard" 
                                        key={"auth"+field[1]} 
                                        label={field[1]} 
                                        onChange={(event) => this.handleChange(event, index)}
                                    />
                                </div>
                            );
                        })}
                        <input class="user-submit" type="submit"></input>
                    </form>
                </div>

            </div>
        );
    }
}

export default Form;