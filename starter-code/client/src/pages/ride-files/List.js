import React from 'react'

import ListObject from "./ListObject";

export default function List(props) {
    var rideInfo = props.rideInfo;
    var list=[];
    for(var i=0;i<rideInfo.length;i++){
        var ride = rideInfo[i][0];
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