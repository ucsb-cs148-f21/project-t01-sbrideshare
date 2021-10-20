import React, {useState} from 'react'

export default function ListObject(props) {
    var rideInfo = props.rideInfo;
    
    const [button,buttonChange] = useState({
        text: "Sign up for this ride!",
        //state false means ride not joined
        //state true means ride joined
        state: false,
        color: 'green'
    });

    const buttonClick = (event) =>{
        if(button.state == false){
            buttonChange({...button, text: "You signed up!",
            state: true,
            color: 'blue'})
        }
    }

    return (
        <div>
            <p>Name: {rideInfo.name}</p>
            <p>Start Location: {rideInfo.startLocation}</p>
            <p>Leaving: {rideInfo.dayLeave}, {rideInfo.timeLeave}</p>
            <p>Destination: {rideInfo.endLocation}</p>
            <button  style={{backgroundColor: button.color}} onClick={() => buttonClick()}>{button.text}</button>
            <hr/>
        </div>
    );
}