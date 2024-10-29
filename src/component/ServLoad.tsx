import {ThreeScene} from "../component/ThreeScene";
import * as threeinfo from "../component/ThreeScene";
import * as Server from "../grpc/server";
import * as client from "../grpc/testclient";
import * as calcul from "../Math/Calculation"



var prop={
  accel:0,
  rendertime:0.001,
  spacebetween:0,
  radius:0,
  left:false,
  load:0,
  mass:0,
  elect:0,
  collisionpoint:0
}

var Cyclotron={
  deesradius:10, //cm
  spacebetween:16 //cm
}
var particle={
  load:1,
  mass: 1,   ///1.67262192595*(10**-27),
  electricfield:2 //the strenght of the electric field needs to be removed from this
}

export async function Servload(){
  client.main();
  var text = Server.startcyclotronbool;
  var accel = calcul.Accelaration(particle.load,particle.electricfield,particle.mass);
  console.log(accel);
  var t = calcul.AccelTime(accel,(Cyclotron.spacebetween/2)); 
  console.log(t);
  var expectedspeed =calcul.SpeedEndAccel(accel,0,0,t);
  console.log(expectedspeed);
  var expectedrad =calcul.radius(expectedspeed,particle.mass,particle.load,2);
  console.log(expectedrad);
  

  let starttime = performance.now();
  var expecteanglespeed=calcul.angle(expectedspeed,expectedrad);
  console.log(expecteanglespeed);  
  let endtime = performance.now();
  var rendertime = endtime-starttime;
  console.log(rendertime);

  var expecteddistance=calcul.DistAccel(0,accel,rendertime);
  console.log(expecteddistance);  



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