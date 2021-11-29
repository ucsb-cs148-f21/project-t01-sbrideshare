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
import usePlacesAutocomplete from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";
import Autocomplete from '@mui/material/Autocomplete';

export default function JoinPopup({open,handleClose,rideInfo,user,loading_effect,signed_up_effect,decrement_seats,signup_available_effect}) {
    const [id,setID] = useState('');
    const [address,setAddress] = useState('');
    const [notes,setNotes] = useState('');
    const [pickup_error,setError] = useState(false);
    const [input_error,setInputError] = useState(false);
    const [options,setOptions] = useState(["hi"]);

      const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
      } = usePlacesAutocomplete({
        requestOptions: {
          /* Define search scope here */
        },
        debounce: 300,
      });
      const ref = useOnclickOutside(() => {
        // When user clicks outside of the component, we can dismiss
        // the searched suggestions by calling this method
        setValue(address,false);
        clearSuggestions();
      });
    
      const handleInput = (e) => {
        // Update the keyword of the input element
        setValue(e.target.value);
        setOptions(data);
      };
    
      const handleSelect =
        ({ description,place_id }) =>
        () => {
          // When user selects a place, we can replace the keyword without request data from API
          // by setting the second parameter to "false"
          setValue(description, false);
          setID(place_id);
          setAddress(description);
          clearSuggestions();
        };
    
      const renderSuggestions = () =>
        data.map((suggestion) => {
          const {
            place_id,
            structured_formatting: { main_text, secondary_text },
          } = suggestion;
          return (
            <li key={place_id} onClick={handleSelect(suggestion)}>
              <strong>{main_text}</strong> <small>{secondary_text}</small>
            </li>
          );
        });
        

    var rideURL = getBackendURL()+'/rides/'+rideInfo._id+'/riders';

    var driver_pickup = rideInfo.rider_radius!=0;

    const check_radius = () => {
        if(id == ""){
          setInputError(true);
          return;
        }else{
          setInputError(false);
        }
        loading_effect();
        //send the signup request
        axios.post(rideURL, {
            "rider_id": user.id,
            "pickup_address": id,
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
                  <div ref = {ref}>
                    {driver_pickup &&
                      <TextField
                        value = {value}
                        onChange={handleInput}
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
                    {status === "OK" && <ul>{renderSuggestions()}</ul>}
                  </div>
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
                {input_error &&
                  <Typography variant="body1" gutterBottom component="div" color = 'error'>
                     Please select a valid location from the dropdown suggestions.
                  </Typography>
                }
            </Dialog>
        </div>
    );
}