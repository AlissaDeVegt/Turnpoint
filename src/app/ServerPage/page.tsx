import "../../css/style.css"
import {NavButtons} from "../../component/NavButtons";
import * as Server from "../../grpc/server";
import {Reloadbutton} from "../../component/ReloadComp";
import * as client from "../../grpc/testclient";
import * as calcul from "../../Math/Calculation"
import { ThreeScene } from "@/component/ServerThree";

////-----------SERVER----------\\\\\\\\

Server.StartServer(); 

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
  speedup:1,
  electricfield: 1 //the strenght of the electric field needs to be removed from this
}

var Cyclotron={
  deesradius:1.2, //m
  spacebetween:0.5 //m
}

var particle={
  load:1,
  mass: 1,   ///1.67262192595*(10**-27),
}
//change some things 

export default function ServerPage(){
  client.main();
  var accel = calcul.Accelaration(particle.load,prop.electricfield*0.01,particle.mass);
  console.log('accelaration : '+ accel);

  if(Server.startcyclotronbool == true){

    prop.accel=accel;
    prop.spacebetween=Server.startParameters.inBetween;
    prop.mass=particle.mass;
    prop.load=particle.load;
    prop.radius=Server.startParameters.cyclotronDiameter;
    prop.collisionpoint= Cyclotron.deesradius+2;
      return(
        <div>
          <NavButtons/>
          <p > this is the server page</p>
          <Reloadbutton/>
          <div>
            <ThreeScene properties={prop}/>
          </div>
        </div>
      )
    }
  else{
    return(
      <div>
        <NavButtons/>
        <p > this is the server page</p>
        <Reloadbutton/>
      </div>
    )
  }
}