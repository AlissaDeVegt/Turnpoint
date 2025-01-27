import * as cyclotron from "../Cyclotron/Controle"

//prop to which get written to
var prop={
    accel:0,
    rendertime:0.1, //aka 0.1 seconds aka 100 miliseconds equal to timers
    spacebetween:0.5, //meters
    radiusCycl:1.2, //meters
    left:false,
    load:1,
    mass:1,
    collisionpoint:0,
    magneticflux:2,
    speedup:1,
    electricfield: 1,
    obj: {
        x:0.00, //meters
        y:0.00, //meters
        z:0.00 //meters
    },
    backupx : 0, //meters
    backupy :0, //meters
    radius:0,
    angle:0,
    speed:0, //meters/sec
}

//start timeloop of server sim
export function Timer(){
    console.log ("Timer started")
    globalThis.serverTimer == true;
    var canchange =false
    setInterval(() => {
        if(globalThis.running==true){
            if (prop.radius>(prop.radiusCycl)){
                prop = cyclotron.moveBehindDees(prop);
                globalThis.left = prop.left;
                globalThis.objx= prop.obj.x;
                globalThis.objy= prop.obj.y;
                canchange =false;
            }
            else if(globalThis.objx <(0.5*prop.spacebetween) && globalThis.objx >(-0.5*prop.spacebetween)){ 

                prop = cyclotron.moveBetweenDees(prop);
                globalThis.left = prop.left;
                globalThis.objx= prop.obj.x;
                globalThis.objy= prop.obj.y;

                if(canchange ==false && globalThis.left == true){
                    globalThis.redleft =false;
                    globalThis.redright =true;
                    canchange =true;
                }
                else if(canchange ==false && globalThis.left == false){
                    globalThis.redleft =true;
                    globalThis.redright =false;
                    canchange =true;
                }
            }
            else{
                prop = cyclotron.moveInDees(prop);
                globalThis.left = prop.left;
                globalThis.objx= prop.obj.x;
                globalThis.objy= prop.obj.y;
                canchange =false;
            }
        }
    }, 100)
}

//warms the cyclotron up/in the programs case resets the sim.
export function warmupSim(properties){

    globalThis.running = false;
    globalThis.simstatus = 'Warming sim up';
    globalThis.objx = 0;
    globalThis.objy = 0;
    prop.obj.x =0;
    prop.obj.y = 0;
    prop.backupx = 0;
    prop.backupy =0;
    prop.radius=0;
    prop.angle=0;
    prop.speed=0;

    var reply ={text: ''};
    reply.text ="status : " + globalThis.simstatus

    return reply;
}

//starts the sim which is called by external client
export function startSim(properties){

    globalThis.running = true;
    globalThis.simstatus = 'sim started';
    var reply ={text: ''};
    reply.text =  "status : " +  globalThis.simstatus;
    return reply;
}

//stops the sim which is called by external client
export function stopSim(properties){

    globalThis.simstatus = 'sim has finished';
    globalThis.running = false;
    var reply ={text: ''};
    reply.text = "status : " + globalThis.simstatus + ". Final speed reached : " + prop.speed;

    return reply;
}

//returns global running value
export function getRunning(){

    return globalThis.running;
}

//returns global X  value
export function getObjX(){

    return globalThis.objx;
}

//returns global Y  value
export function getObjY(){

    return globalThis.objy;
}

//returns global left  value
export function getLeft(){
    return globalThis.left;
}

//returns global redleft  value
export function getRedLeft(){
    return globalThis.redleft;
}

//returns global red right value
export function getRedRight(){
    return globalThis.redright;
}
