import {NavButtons} from "../../component/NavButtons";
import "../../css/style.css"
import {ThreeScene} from "../../component/ThreeScene";
import * as calcul from "../../Math/Calculation"


var prop={
  accel:0,
  rendertime:0.001,
  spacebetween:0.5,
  radius:1.2,
  left:false,
  load:1,
  mass:1,
  elect:0,
  collisionpoint:0,
  magneticflux:2,
  speedup:1,
  electricfield: 1 //the strenght of the electric field needs to be removed from this
}


export default function ClientPage(){
    //var text = Server.startcyclotronbool;
    var accel = calcul.Accelaration(prop.load,prop.electricfield*0.01,prop.mass);
    console.log('accelaration : '+ accel);
  
    prop.accel=accel;

    return(
      <div>
        <div>
          <NavButtons/>
          <p> this is the client page</p>
        </div>
        <div>
          <ThreeScene properties={prop}/>
        </div>
      </div>
    )
  }