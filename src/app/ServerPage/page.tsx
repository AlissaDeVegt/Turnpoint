'use server'
import "../../css/style.css"
import {NavButtons} from "../../component/NavButtons";
import {Reloadbutton} from "../../component/ReloadComp";
import { ThreeScene } from "@/component/ServerThree";
import * as ServerData from '../../grpc/ServerTimer';

//properties that will be sent to serverpage.
//these props are for location purpose not for calculation
var prop={
  spacebetween:0.5,
  radius:1.2,
  objx:0,
  objy:0,
  collisionpoint: 0,
  left: false
}

//serverpage
//gets the info from serverdata and sends it to the 3d server scene
//because the 3d scene is webclient based we use the page to send serversideproperties to the client.
//its also why we need the reload button so it gets reloaded every so often.
export default async function ServerPage(){
  prop.objx=ServerData.getObjX();
  prop.objy=ServerData.getObjY();
  prop.left=ServerData.getLeft();
    return(
      <div>
        <div>
          <NavButtons/>
          <p > this is the server page</p>
          <Reloadbutton/>
        </div>
        <div>
          <ThreeScene properties={prop}/> 
        </div>
      </div>
    )
}


