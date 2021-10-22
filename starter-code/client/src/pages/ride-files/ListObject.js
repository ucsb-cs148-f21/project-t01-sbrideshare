import React, {useState} from 'react'
import axios from 'axios';
import getBackendURL from "../../utils/get-backend-url";
import getUser from "../../utils/get-user";

export default function ListObject(props) {
    const user = getUser();

    var rideInfo = props.rideInfo;

    var postRiderURL = getBackendURL()+'/rides/'+rideInfo._id+'/riders';

    const [seats,decrement] = useState({
        numSeats: rideInfo.seats_available
    });

    if(rideInfo.seats_available>0){
        var buttonText = "Sign up for this ride!";
        var buttonColor = 'green';
        var buttonState = true;
    } 
    else {
        var buttonText = "Ride is full."
        var buttonColor = 'gray';
        var buttonState = false;
    }
    
    
    const [button,buttonChange] = useState({
        text: buttonText,
        //state true means ride not joined
        //state false means ride joined
        state: buttonState,
        color: buttonColor
    });

    const buttonClick = (event) =>{
        if(button.state == true){
            axios.post(postRiderURL, {
                //TODO insert user id here later
                "rider_id": 123
            })
            .then(function (response) {
                buttonChange({...button, text: "You signed up!",
                state: false,
                color: 'blue'});
                decrement({...seats, 
                numSeats: seats.numSeats-1});
            })
            .catch(function(error) {
                console.log(error)
                buttonChange({...button, text: "Error",
                state: false,
                color: 'red'});
            });

            
        }
    }

    return (
        <div>
            <h4>{rideInfo.start_location} to {rideInfo.end_location}</h4>
            <p>Driver: {rideInfo.name}</p>
            <p>Leaving: {rideInfo.leave_datetime}</p>
            <p>Seats Available: {seats.numSeats}</p>
            <button  style={{backgroundColor: button.color}} onClick={() => buttonClick()}>{button.text}</button>
            <hr/>
        </div>
    );
}