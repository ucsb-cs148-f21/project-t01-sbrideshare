import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import axios from 'axios';
import DialogTitle from '@mui/material/DialogTitle';
import getBackendURL from "../../utils/get-backend-url";
import Typography from '@mui/material/Typography';

export default function JoinPopup({open,handleClose,rideInfo,user,loading_effect,signed_up_effect,decrement_seats,signup_available_effect}) {
    const [address,setAddress] = useState('');
    const [notes,setNotes] = useState('');
    const [pickup_error,setError] = useState(false);
    var rideURL = getBackendURL()+'/rides/'+rideInfo._id+'/riders';

    var driver_pickup = rideInfo.rider_radius!=0;

    const check_radius = () => {
      axios.get(getBackendURL()+"/locations", { 
          params: { input: address } 
      })
      .then(function(response){
          loading_effect();
          //send the signup request
          axios.post(rideURL, {
              "rider_id": user.id,
              "pickup_address": response.data.predictions[0].place_id,
              "note_to_driver": notes
          })
          //then change the button colors
          .then(function (response) {
              //change button to be signed up
              signed_up_effect();
              decrement_seats();
              handleClose();
              setError(false);
          })
          //if there is an error catch it
          .catch(function(error) {
              console.log(error.response);
              signup_available_effect();
              setError(true);
          });
      }).catch(function(error) {
          console.log("fail");
          console.log(error.response);
      });
    }
  
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Join Ride</DialogTitle>
                <DialogContent>
                <form 
                      autoComplete="off"
                  >
                  {driver_pickup && 
                    <Typography variant="body1" gutterBottom component="div">
                      Distance that the driver is willing to go to pick up riders: {rideInfo.rider_radius} meters
                    </Typography>
                  }
                  {driver_pickup &&
                    <TextField
                      onChange={(e) => setAddress(e.target.value)}
                      autoFocus
                      margin="dense"
                      label="Pickup Address"
                      fullWidth
                      variant="standard"
                    />
                  }
                  {!driver_pickup &&
                    <Typography variant="body1" gutterBottom component="div">
                      The driver wants to meet only at their specified leave location.
                    </Typography>
                  }
                  <TextField
                    onChange={(e) => setNotes(e.target.value)}
                    autoFocus
                    margin="dense"
                    label="Additional notes to the driver"
                    fullWidth
                    variant="standard"
                  />
                </form>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => {handleClose();}}>Cancel</Button>
                  <Button onClick={() => {check_radius();}}>Sign Up</Button>
                </DialogActions>
                {pickup_error &&
                  <Typography variant="body1" gutterBottom component="div" color = 'error'>
                     Your location is not within the driver's specified pickup radius.
                  </Typography>
                }
            </Dialog>
        </div>
    );
}