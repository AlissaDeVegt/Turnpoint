import {ThreeScene} from "../component/ThreeScene";
import * as Server from "../grpc/server";
import * as client from "../grpc/testclient";
import * as calcul from "../Math/Calculation"
import { useState, useEffect } from 'react'

var prop={
  accel:0,
  rendertime:0.001,
  spacebetween:0,
  radius:0,
  left:false,
  load:0,
  mass:0,
  elect:0,
  collisionpoint:0,
  magneticflux:2,
  speedup:1
}

var Cyclotron={
  deesradius:1.2, //m
  spacebetween:0.5 //m
}
var particle={
  load:1,
  mass: 1,   ///1.67262192595*(10**-27),
  electricfield: 0.01 //the strenght of the electric field needs to be removed from this
}

export async function Servload(){
  client.main();
  var text = Server.startcyclotronbool;
  var accel = calcul.Accelaration(particle.load,particle.electricfield,particle.mass);
  console.log('accelaration : '+ accel);


  prop.accel=accel;
  prop.spacebetween=Cyclotron.spacebetween;
  prop.elect=particle.electricfield;
  prop.mass=particle.mass;
  prop.load=particle.load;
  prop.radius=Cyclotron.deesradius;
  prop.collisionpoint= Cyclotron.deesradius+2;

  if(text== true){
    return (   
      <div>
        <ThreeScene properties={prop}/>
      </div> 
      );
  }
  else{
    return (    
      <div>
      <p id="p1">falsed </p>
      </div>
      );
  }
}
