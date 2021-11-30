import React, {useEffect, useState} from 'react'
import axios from 'axios';
import getBackendURL from "../../utils/get-backend-url";
import getUser from "../../utils/get-user";
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import JoinPopup from './JoinPopup';
import LeavePopup from './LeavePopup';

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
    var riderIdArray=[];
    for(var i=0;i<rideInfo.riders.length;i++){
        riderIdArray[i] = rideInfo.riders[i].rider_id;
    } 
    var userInRide = riderIdArray.indexOf(user.id) > -1;
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
    var tempHour = date.getHours();
    var timeSuffix;
    if(tempHour<12){
        timeSuffix = "AM";
        if(tempHour == 0)
            tempHour=12;
    }
    else{
        timeSuffix = "PM";
        if(tempHour!=12)
            tempHour -= 12;
    }
    
    var hour = tempHour.toString();
    var min = date.getMinutes();

    if(min<10){
        min = "0"+min.toString();
    }else{
        min = min.toString();
    }

    return weekday+", " + month + " " + monthday + " (" + monthnum + "/" + monthday + "/" + year + ") at " + hour + ":" + min +" "+timeSuffix;

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

    const loading_effect = () => {
        buttonChange({
            text: "...",
            disabled: true
        })
    }
    const signed_up_effect = () => {
        [buttonText,buttonState,inRide,buttonColor] = getCanRemove();
        buttonChange({...button, text: buttonText,
        state: buttonState,
        inRide: inRide,
        disabled: false,
        color: buttonColor});
    }
    const decrement_seats = () => {
        update({...seats, 
        numSeats: seats.numSeats-1});
    }
    const error_effect = () => {
        [buttonText,buttonState,inRide,buttonColor] = getErrorValues();
        buttonChange({...button, text: buttonText,
        state: buttonState,
        color: buttonColor})
    }
    const signup_available_effect = () => {
        [buttonText,buttonState,inRide,buttonColor] = signupAvailableValues();
        buttonChange({...button, text: buttonText,
        state: buttonState,
        inRide: inRide,
        disabled: false,
        color: buttonColor});
    }

    const leave = (event) =>{
        loading_effect();
        axios.delete(rideURL+"/"+user.id+"/", {

        })
        //then change the button colors
        .then(function (response) {
            signup_available_effect();

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
        setLeaveOpen(false);
    }
    const buttonClick = (event) =>{
        //if the user is allowed to click the signup button
        if(button.state === true){
            if(button.inRide === false){
                handleClickJoin();
            }
            else {
                handleClickLeave();
            }
        }
    }

    
    const [signupOpen, setSignupOpen] = React.useState(false);
    const [leaveOpen, setLeaveOpen] = React.useState(false);
  
    const handleClickJoin = () => {
        setSignupOpen(true);
    };
    const handleClickLeave = () => {
        setLeaveOpen(true);
    };
    const handleClose = () => {
        setSignupOpen(false);
        setLeaveOpen(false);
    };
    const startAddress = rideInfo.start_location.formatted_address.split(/[,]+/);
    const endAddress = rideInfo.end_location.formatted_address.split(/[,]+/);

    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const riderInfo = () => {
        return(
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    
                    {
                    rideInfo.riders.length != 0 && 
                    rideInfo.riders.map(item => (
                        <Typography  variant="body2" color="textSecondary">
                            {item.rider_name}: {item.pickup_address}
                        </Typography>
                    ))}
                    {
                    rideInfo.riders.length === 0 &&
                    <Typography  variant="body2" color="textSecondary">
                        Your ride currently has no riders.
                    </Typography>
                    
                    }
                </CardContent>
            </Collapse>
        )
        
    }
    const moreDriveInfo = () => {
        const driver_pickup = rideInfo.rider_radius!=0;
        var pickup_message;
        if(driver_pickup){
            pickup_message = "The driver will pick up riders within "+rideInfo.rider_radius+" meters of the specified start location.";
        }
        else{
            pickup_message = "The driver will only pick up riders from the listed start location.";
        }
        return(
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography  variant="body2" color="textSecondary">{pickup_message}</Typography>
                </CardContent>
            </Collapse>
        )
    }

    return (
        <div>
            <Card  elevation = {2}>
                <CardHeader
                    title = {startAddress[0]+", "+startAddress[1] + 
                        " -> " + endAddress[0]+", "+endAddress[1]}
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
                <ListItemButton onClick={handleExpandClick}>
                    {
                        rideInfo.driver_id === user.id  ?
                        <ListItemText primary="See Riders" /> : <ListItemText primary="Additional Information" />
                    }
                    
                    {expanded ? <ExpandLess /> : <ExpandMoreIcon />}
                </ListItemButton>
                {
                    rideInfo.driver_id === user.id  ?
                    riderInfo() : moreDriveInfo()
                }
            </Card>
            <JoinPopup open = {signupOpen} handleClose = {handleClose} 
            rideInfo = {rideInfo} user = {user}
            loading_effect = {loading_effect} signed_up_effect = {signed_up_effect} 
            decrement_seats = {decrement_seats} signup_available_effect = {signup_available_effect}
            />
            <LeavePopup open = {leaveOpen} handleLeave = {leave} handleClose = {handleClose}/>
        </div>
    );
}