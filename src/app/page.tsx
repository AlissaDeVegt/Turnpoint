var fs = require('fs');
//import { Router, useRouter } from "next/router";
import {Servload} from "../component/ServLoad";
import {Testfunction} from "../component/ReloadComp";
import * as Server from "../grpc/server";

Server.StartServer();

// kan elke naam hebben, hoeft geen Home te zijn! zolang je default maar benoemt
export default function Home(){
  
  return(
    <div>
      <Testfunction/>
      <Servload/>
    </div>
  )
}