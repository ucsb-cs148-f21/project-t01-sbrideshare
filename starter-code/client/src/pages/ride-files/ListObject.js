import React, {useState} from 'react'
import axios from 'axios';
import getBackendURL from "../../utils/get-backend-url";
import getUser from "../../utils/get-user";



//button values for if the user is in the ride
function isInRideValues(){
    var buttonText, buttonState, buttonColor;
    buttonText = "You signed up!";
    buttonState = false;
    buttonColor = 'blue';
    return [buttonText,buttonState,buttonColor];
}
//button values for if the user can signup for the ride
function signupAvailableValues(){
    var buttonText, buttonState, buttonColor;
    buttonText = "Sign up for this ride!";
    buttonState = true;
    buttonColor = 'green';
    return [buttonText,buttonState,buttonColor];
}
//button values for if the ride is already full
function rideFullValues(){
    var buttonText, buttonState, buttonColor;
    buttonText = "Ride is full."
    buttonState = false;
    buttonColor = 'gray';
    return [buttonText,buttonState,buttonColor];
}

//button values for if there is an error
function getErrorValues(){
    var buttonText, buttonState, buttonColor;
    buttonText = "Error.";
    buttonState = false;
    buttonColor = 'red';
    return [buttonText,buttonState,buttonColor];
}

//default button values for when the user first opens the page
//do not use this for updating button values for anything other than
    //the page being opened/refreshed
function getInitialButtonValues(rideInfo,user){
    var userInRide = rideInfo.riders.indexOf(user.id) > -1;
    //if the user is already in the ride
    if(userInRide){
        return isInRideValues();
    }
    //if there are seats left
    else if(rideInfo.seats_available>0){
        return signupAvailableValues();
    }
    //otherwise the user is not in the ride and there are no seats left
    //so the ride is full 
    else {
        return rideFullValues();
    }
}

export default function ListObject(props) {
    const user = getUser();

    var rideInfo = props.rideInfo;

    var postRiderURL = getBackendURL()+'/rides/'+rideInfo._id+'/riders';

    const [seats,decrement] = useState({
        numSeats: rideInfo.seats_available
    });

    var [buttonText,buttonState,buttonColor] = getInitialButtonValues(rideInfo,user);
    
    const [button,buttonChange] = useState({
        text: buttonText,
        //state true means ride not joined
        //state false means ride joined
        state: buttonState,
        color: buttonColor
    });

    const buttonClick = (event) =>{
        //if the user is allowed to click the signup button
        if(button.state === true){
            //send the signup request
            axios.post(postRiderURL, {
                "rider_id": user.id
            })
            //then change the button colors
            .then(function (response) {
                [buttonText,buttonState,buttonColor] = isInRideValues();
                buttonChange({...button, text: buttonText,
                state: buttonState,
                color: buttonColor});
                decrement({...seats, 
                numSeats: seats.numSeats-1});
            })
            //if there is an error, log it and change button colors
            .catch(function(error) {
                console.log(error);
                [buttonText,buttonState,buttonColor] = getErrorValues();
                buttonChange({...button, text: buttonText,
                state: buttonState,
                color: buttonColor});
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