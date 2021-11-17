import React from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function LeavePopup({open,setOpen,handleLeave,handleCancel,rideInfo}) {

    const handleClose = () => {
        setOpen(false);
    };
  
    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to leave this ride?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleCancel(); handleClose()}}>Don't Leave</Button>
            <Button onClick={() => {handleLeave(); handleClose()}}>Leave</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}