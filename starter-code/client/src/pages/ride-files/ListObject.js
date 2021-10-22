import React, {useState} from 'react'

export default function ListObject(props) {
    var rideInfo = props.rideInfo;

    const [seats,decrement] = useState({
        numSeats: rideInfo.numSeats
    });
    
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
            decrement({...seats, 
            numSeats: seats.numSeats-1})
        }
    }

    return (
        <div>
            <h4>{rideInfo.startLocation} -> {rideInfo.endLocation}</h4>
            <p>Leaving: {rideInfo.dayLeave}, {rideInfo.timeLeave}</p>
            <p>Seats Available: {seats.numSeats}</p>
            <button  style={{backgroundColor: button.color}} onClick={() => buttonClick()}>{button.text}</button>
            <hr/>
        </div>
    );
}