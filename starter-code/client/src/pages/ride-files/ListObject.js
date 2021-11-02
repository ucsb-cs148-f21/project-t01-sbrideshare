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
function getCanRemove(){
    var buttonText, buttonState, buttonColor;
    buttonText = "Leave this ride";
    buttonState = true;
    buttonColor = 'red';
    return [buttonText,buttonState,buttonColor];
}
function getCannotRemove(){
    var buttonText, buttonState, buttonColor;
    buttonText = "You are not in this ride.";
    buttonState = false;
    buttonColor = 'gray';
    return [buttonText,buttonState,buttonColor];
}
//button values for the remove self button
function getSelfRemoveValues(rideInfo,user){
    //console.log(rideInfo);
    var userInRide = rideInfo.riders.indexOf(user.id) > -1;
    //if the user is in the ride
    if(userInRide){
        return getCanRemove();
    }
    //if they are not in the ride, they cannot have a leave button
    else {
        return getCannotRemove();
    }
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

    var rideURL = getBackendURL()+'/rides/'+rideInfo._id+'/riders';

    const [seats,update] = useState({
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

    var selfRemoveValues = getSelfRemoveValues(rideInfo,user);
    const [removeSelfButton,removeButtonChange] = useState({
        text: selfRemoveValues[0],
        //state true means ride not joined
        //state false means ride joined
        visible: selfRemoveValues[1],
        state: selfRemoveValues[1],
        color: selfRemoveValues[2]
    });

    const buttonClick = (event) =>{
        //if the user is allowed to click the signup button
        if(button.state === true){
            //send the signup request
            axios.post(rideURL, {
                "rider_id": user.id
            })
            //then change the button colors
            .then(function (response) {
                [buttonText,buttonState,buttonColor] = isInRideValues();
                buttonChange({...button, text: buttonText,
                state: buttonState,
                color: buttonColor});
                update({...seats, 
                numSeats: seats.numSeats-1});
            })
            //if there is an error, log it and change button colors
            .catch(function(error) {
                [buttonText,buttonState,buttonColor] = getErrorValues();
                buttonChange({...button, text: buttonText,
                state: buttonState,
                color: buttonColor});
            });
        }
    }

    const removeButtonClick = (event) =>{
        //if the user is allowed to click the remove button
        const id=101;
        if(removeSelfButton.state === true){
            //send the delete request
            axios.delete(rideURL, {
                "rider_id": id
            })
            //then change the button colors
            .then(function (response) {
                [buttonText,buttonState,buttonColor] = getCannotRemove();
                removeButtonChange({...button, text: buttonText,
                visible: buttonState,
                state: buttonState,
                color: buttonColor});
                update({...seats, 
                numSeats: seats.numSeats+1});
            })
            //if there is an error, log it and change button colors
            .catch(function(error) {
                console.log(error.response);
                console.log(rideURL);
                console.log(id);
                [buttonText,buttonState,buttonColor] = getErrorValues();
                removeButtonChange({...button, text: buttonText,
                visible: true,
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
            <p />
            {removeSelfButton.visible===true &&
                <button  style={{backgroundColor: removeSelfButton.color}} onClick={() => removeButtonClick()}>{removeSelfButton.text}</button>
            }
            <hr/>
        </div>
    );
}