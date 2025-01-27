import {NavButtons} from "../../component/NavButtons";
import "../../css/style.css"
import {ThreeScene} from "../../component/ThreeScene";


export default function ClientPage(){
    return(
      <div>
        <div>
          <NavButtons/>
          <p> this is the client page</p>
          <p> The following variables are set due to it otherwise not showing of the speed.</p>
          <p> Particle weight is 1 kilogram, as going lower will increase the speed so much the particle will move to fast </p>
        </div>
        <div>
          <ThreeScene/>
        </div>
      </div>
    )
  }