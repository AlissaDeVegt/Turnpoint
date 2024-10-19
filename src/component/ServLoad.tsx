import {ThreeScene} from "../component/ThreeScene";
import * as Server from "../grpc/server";
import * as client from "../grpc/testclient";
import * as calcul from "../Math/Calculation"


var obj={
  x:0.00,
  y:0.00,
  z:0.00
}

var Cyclotron={
  deesradius:10,
  spacebetween:16
}

var rendertime = 0.016; 
var currenttime = 0 ;
var speed =0;

export function calcbundle(time:any,accel:any){
  
  if(obj.x<=(0.5*Cyclotron.spacebetween) && obj.x >=-0.5*Cyclotron.spacebetween){ //todo when objects x is in one of dees aka 0+1/2 spacebetween or when-0+spacebetween
    speed = calcul.SpeedEndAccel(accel,speed,currenttime,currenttime+rendertime);
    obj.x += speed * rendertime ;
    currenttime +=rendertime;
  }
}


export async function Servload(){
  client.main();
  var text = Server.startcyclotronbool;
  var accel = calcul.Accelaration(1,2,1);
  console.log(accel);
  var t = calcul.AccelTime(accel,Cyclotron.spacebetween); 
  console.log(t);

  setInterval(()=>{calcbundle(t,accel);},rendertime);

  if(text== true){
    return (    
      <div>
      <p id="p1"> {speed}</p>
      <ThreeScene properties={obj}/>
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