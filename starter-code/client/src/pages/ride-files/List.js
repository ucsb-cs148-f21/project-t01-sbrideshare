import React from 'react'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid';

import ListObject from "./ListObject";

export default function List(props) {
    var rideInfo = props.rideInfo;
    var list=[];
    //if there are no rides, tell the user that
    if(rideInfo.length === 0){
        list = ["No rides are available. :("];
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
                    {list.length!==0 &&
                    list.map(item => (
                        <Grid item xs={12} key={item._id}>
                            
                                {item}
                        </Grid>
                        ))}
            </Grid>
        </Container>
    );
    
}