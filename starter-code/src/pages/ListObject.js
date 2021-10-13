import React, {Component} from 'react'
import "./square.css"

class ListObject extends Component {

    constructor(props/*id,name,startLocation,endLocation,dayLeave,timeLeave*/){
        super()
        this.state = {
            id: props.id,
            name: props.name,
            startLocation: props.startLocation,
            endLocation: props.endLocation,
            dayLeave: props.dayLeave,
            timeLeave: props.timeLeave,
            buttonText: "Hello there!"
        }
    }

    buttonFnc() {
        if(this.state.buttonText === "Hello there!"){
            this.setState({
                buttonText: "General Kenobi!"
            })
        }
        else{
            this.setState({
                buttonText: "Hello there!"
            })
        }
    }

    render() {
        return (
            // className="square"
            <div>
                <p>Name: {this.state.name}</p>
                <p>Start Location: {this.state.startLocation}</p>
                <p>Leaving: {this.state.dayLeave}, {this.state.timeLeave}</p>
                <p>Destination: {this.state.endLocation}</p>
                <button onClick={() => this.buttonFnc()}>{this.state.buttonText}</button>
                <hr/>
            </div>
        )
    }
}
export default ListObject;