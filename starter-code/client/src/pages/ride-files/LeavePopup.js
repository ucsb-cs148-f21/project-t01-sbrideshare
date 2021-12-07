import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function LeavePopup({open,handleLeave,handleClose}) {
    return (
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Leave Ride</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to leave this ride?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => {handleClose();}}>Don't Leave</Button>
            <Button onClick={() => {handleLeave();}}>Leave</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
}