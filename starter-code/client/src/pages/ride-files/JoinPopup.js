import React, { useState } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function JoinPopup({open,setOpen,handleSignup,handleCancel,rideInfo}) {
    const [address,setAddress] = useState('');
    const [notes,setNotes] = useState('');
    
    const handleClose = () => {
        setOpen(false);
    };
    var inRadius = true;
  
    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Join Ride</DialogTitle>
                <DialogContent>
                <form 
                      autoComplete="off"
                  >
                  {inRadius &&
                  <TextField
                    onChange={(e) => setAddress(e.target.value)}
                    autoFocus
                    margin="dense"
                    label="Pickup Address"
                    fullWidth
                    variant="standard"
                  />
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
                  <Button onClick={() => {handleCancel(); handleClose()}}>Cancel</Button>
                  <Button onClick={() => {handleSignup(address,notes); handleClose()}}>Sign Up</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}