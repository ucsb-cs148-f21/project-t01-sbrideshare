import React, {useEffect, useState} from 'react'
import axios from 'axios';
import getBackendURL from "../../utils/get-backend-url";
import getUser from "../../utils/get-user";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@mui/material/Button';

import Avatar from '@mui/material/Avatar';

//button values for if the user can signup for the ride
function signupAvailableValues(){
    var buttonText, buttonState, inRide, buttonColor;
    buttonText = "Sign up for this ride!";
    buttonState = true;
    inRide = false;
    buttonColor = 'join';
    return [buttonText,buttonState,inRide,buttonColor];
}
//button values for if the ride is already full
function rideFullValues(){
    var buttonText, buttonState, inRide, buttonColor;
    buttonText = "Ride is full."
    buttonState = false;
    inRide = false;
    buttonColor = 'full';
    return [buttonText,buttonState,inRide,buttonColor];
}
//button values for if there is an error
function getErrorValues(){
    var buttonText, buttonState, buttonColor;
    buttonText = "Error.";
    buttonState = false;
    buttonColor = 'error';
    return [buttonText,buttonState,buttonColor];
}
function getCanRemove(){
    var buttonText, buttonState, inRide, buttonColor;
    buttonText = "Leave this ride";
    buttonState = true;
    inRide = true;
    buttonColor = 'leave';
    return [buttonText,buttonState,inRide,buttonColor];
}
function userIsDriver(){
    var buttonText, buttonState, inRide, buttonColor;
    buttonText = "You're the driver.";
    buttonState = false;
    inRide = true;
    buttonColor = 'driver';
    return [buttonText,buttonState,inRide,buttonColor];
}

//default button values for when the user first opens the page
//do not use this for updating button values for anything other than
    //the page being opened/refreshed
function getInitialButtonValues(rideInfo,user){
    var userInRide = rideInfo.riders.indexOf(user.id) > -1;
    if(rideInfo.driver_id === user.id){
        return userIsDriver();
    }
    //if the user is already in the ride
    else if(userInRide){
        return getCanRemove();
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

function dateToString(date){
    var weekday;
    switch(date.getDay()){
        case 0:
            weekday = "Sunday";
            break;
        case 1:
            weekday = "Monday";
            break;
        case 2:
            weekday = "Tuesday";
            break;
        case 3:
            weekday = "Wednesday";
            break;
        case 4:
            weekday = "Thursday";
            break;
        case 5:
            weekday = "Friday";
            break;
        case 6:
            weekday = "Saturday";
    }
    var monthday = (date.getDate()).toString();
    var monthnum = date.getMonth()+1;
    
    var month;
    switch(monthnum){
        case 1:
            month = "January";
            break;
        case 2:
            month = "February";
            break;
        case 3:
            month = "March";
            break;
        case 4:
            month = "April";
            break;
        case 5:
            month = "May";
            break;
        case 6:
            month = "June";
            break;
        case 7:
            month = "July";
            break;
        case 8:
            month = "August";
            break;
        case 9:
            month = "September";
            break;
        case 10:
            month = "October";
            break;
        case 11:
            month = "November";
            break;
        case 12:
            month = "December";
    }
    monthnum = monthnum.toString();
    var year = (date.getFullYear()).toString();
    var hour = (date.getHours()).toString();
    var min = (date.getMinutes()).toString();

    return weekday+", " + month + " " + monthday + " (" + monthnum + "/" + monthday + "/" + year + ") at " + hour + ":" + min;

}

export default function ListObject(props) {
    const user = getUser();

    var rideInfo = props.rideInfo;

    var rideURL = getBackendURL()+'/rides/'+rideInfo._id+'/riders';

    const driverURL = getBackendURL()+'/users/'+rideInfo.driver_id;
    const [driverImg,updateImg] = useState({
        link:""
    });
    useEffect(() => {
        axios.get(driverURL)
        .then(function (response) {
            updateImg({
                link: response.data.image_url
            })
        })
        .catch(function (error) {
        console.log(error);
        });
    }, []);

    const [seats,update] = useState({
        numSeats: rideInfo.seats_available
    });

    var [buttonText,buttonState,inRide,buttonColor] = getInitialButtonValues(rideInfo,user);
    
    const [button,buttonChange] = useState({
        text: buttonText,
        state: buttonState,
        inRide: inRide,
        disabled: false,
        color: buttonColor
    });

    const buttonClick = (event) =>{
        //if the user is allowed to click the signup button
        if(button.state === true){
            buttonChange({
                text: "...",
                disabled: true
            })
            if(button.inRide === false){
                //send the signup request
                axios.post(rideURL, {
                    "rider_id": user.id
                })
                //then change the button colors
                .then(function (response) {
                    //change button to be signed up
                    [buttonText,buttonState,inRide,buttonColor] = getCanRemove();
                    buttonChange({...button, text: buttonText,
                    state: buttonState,
                    inRide: inRide,
                    disabled: false,
                    color: buttonColor});

                    update({...seats, 
                    numSeats: seats.numSeats-1});
                })
                //if there is an error, log it and change button colors
                .catch(function(error) {
                    console.log(error.response);
                    [buttonText,buttonState,inRide,buttonColor] = getErrorValues();
                    buttonChange({...button, text: buttonText,
                    state: buttonState,
                    color: buttonColor});
                });
            }
            else {
                axios.delete(rideURL+"/"+user.id+"/", {

                })
                //then change the button colors
                .then(function (response) {
                    [buttonText,buttonState,inRide,buttonColor] = signupAvailableValues();
                    buttonChange({...button, text: buttonText,
                    state: buttonState,
                    inRide: inRide,
                    disabled: false,
                    color: buttonColor});

                    update({...seats, 
                    numSeats: seats.numSeats+1});
                })
                //if there is an error, log it and change button colors
                .catch(function(error) {
                    console.log(error.response);
                    [buttonText,buttonState,buttonColor] = getErrorValues();
                    buttonChange({...button, text: buttonText,
                    state: buttonState,
                    color: buttonColor});
                });
            }
        }
    }
    return (
        <div>
            <Card  elevation = {2}>
                <CardHeader
                    title = {rideInfo.start_location.formatted_address + 
                        " -> " + rideInfo.end_location.formatted_address}
                    titleTypographyProps = {{variant: "h5"}}
                    subheader = {dateToString(new Date(rideInfo.leave_datetime))}
                    subheaderTypographyProps = {{variant: "body2"}}
                    action={
                        <Button 
                            variant="contained"
                            color = {button.color}
                            onClick={() => buttonClick()}
                            disabled = {button.disabled}
                            >
                                {button.text}
                        </Button>
                      }
                    avatar = {<Avatar 
                        sx={{ width: 60, height: 60 }} 
                        src={driverImg.link}/>}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary">
                        Driver: {rideInfo.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Seats Available: {seats.numSeats}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Price: ${rideInfo.price}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    );
}