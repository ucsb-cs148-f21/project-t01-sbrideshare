import React from "react";
import styled from "styled-components";

import getUser from "../utils/get-user";
import Layout from "../components/Layout";
import Container from "react-bootstrap/Container";
import ListObject from "./ListObject";


const TextWrapper = styled.div`
  width: 700px;
  max-width: 100%;
`;

function printList(index){
  var id = [0,1,2,3,4,5,6,7,8,9];
  var name = ["Speed Demon", "Turtle", "Grandma", "Joe", "The Fast",
    "Ben Quadinaros", "A Ghost", "Someone", "Not You", "Google"];
  var startLocation = ["Here","UCSB","IV","Santa Barbara","Goleta",
    "California","The Ocean","Behind You","The Moon","Space"];
  var endLocation = ["There","Home","Dreams","Nowhere","Somewhere",
    "Fires","Flooding","Grave","Mars","Darkness"];
  var dayLeave = ["Today","Never","Tomorrow","Sometime","Monday",
    "Yesterday","Future","Now","Soon","idk"];
  var timeLeave = ["14:00","12:00","13:00","5:00","4:00",
    "3:00","25:00","o'Clock","TM","in a bit"];
  
  var obj = <ListObject 
  id={id[index]} name={name[index]} startLocation={startLocation[index]} 
  endLocation={endLocation[index]} dayLeave={dayLeave[index]} timeLeave={timeLeave[index]}/>
  return obj;
  /*
  axios.get(/url)
  .then(function (response) {
    //do something with response.data
  })*/
  
}
export default function RideList() {
  const user = getUser();
  var list = [];
  for(var i=0;i<10;i++){
    list = [list, printList(i)];
  }

  return (
    <Layout user={user}>
      <Container>
        <h1>Rides</h1>
        <TextWrapper>
          See all rides below.
        </TextWrapper>
        <br />
        <TextWrapper>
          You can click on a button for some fun!
        </TextWrapper>
        <br />
        <hr/>
        {list}

      </Container>
    </Layout>
  );
}
