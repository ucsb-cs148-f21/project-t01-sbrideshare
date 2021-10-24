import React from 'react'

import ListObject from "./ListObject";

export default function List(props) {
    var rideInfo = props.rideInfo;
    var list=[];
    if(rideInfo.length == 0){
        list = "No rides are available. :("
    }
    for(var i=0;i<rideInfo.length;i++){
        var ride = rideInfo[i];
        var obj = <ListObject 
            rideInfo = {ride}/>
        list[i] = obj;
    }

    return (
        <div>
            {list}
        </div>
    );
    
}