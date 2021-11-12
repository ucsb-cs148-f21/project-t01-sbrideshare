import React from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { purple, lightBlue, grey, red, lightGreen } from '@mui/material/colors';

import ListObject from "./ListObject";

const theme = createTheme({
    palette: {
        join: {
            main: lightBlue[200]
        },
        driver: {
            main: lightGreen[400]
        },
        full: {
            main: grey[400]
        },
        leave: {
            main: purple[200]
        },
        error: {
            main: red[300]
        },
    },
});

export default function List(props) {
    var rideInfo = props.rideInfo;
    var list=[];
    //if there are no rides, tell the user that
    if(rideInfo.length === 0){
        list = "No rides are available. :("
    }
    for(var i=0;i<rideInfo.length;i++){
        var ride = rideInfo[i];
        var obj = <ListObject 
            rideInfo = {ride}/>
        list[i] = obj;
    }
//{list}
    return (
        <Container>
            <Grid container spacing={3}>
                <ThemeProvider theme={theme}>
                    {list.map(item => (
                        <Grid item xs={12} key={item._id}>
                            
                                {item}
                        </Grid>
                        ))}
                </ThemeProvider>
            </Grid>
        </Container>
    );
    
}