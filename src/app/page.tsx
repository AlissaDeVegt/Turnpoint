
import {NavButtons} from "../component/NavButtons";
import * as Server from "../grpc/server";
import * as TimerServer from "../grpc/ServerTimer";
import * as client from "../grpc/testclient";
import "../css/style.css"

/////-------------HOME PAGE-------------\\\\\
Server.StartServer(); 
TimerServer.Timer();
client.main();

///start page so to speak
//owns all timers and server.
//meant to only start once.

export default function Home(){
  return(
    <div>
      <NavButtons/>
    </div>
  )
}