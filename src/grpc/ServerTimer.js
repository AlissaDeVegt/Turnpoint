import * as cyclotron from "../Cyclotron/Controle"

//prop to which get written to
var prop={
    accel:0,
    rendertime:0.1, //aka 0.1 seconds aka 100 miliseconds equal to timers
    spacebetween:0.5,
    radiusCycl:1.2,
    left:false,
    load:1,
    mass:1,
    collisionpoint:0,
    magneticflux:2,
    speedup:1,
    electricfield: 1,
    obj: {
        x:0.00,
        y:0.00,
        z:0.00
    },
    backupx : 0,
    backupy :0,
    radius:0,
    angle:0,
    speed:0,
}

//start timeloop of server sim
export function Timer(){
    console.log ("Timer started")
    globalThis.serverTimer == true;
    setInterval(() => {
        if(globalThis.running==true){
            if (prop.radius>(prop.radiusCycl)){
                prop = cyclotron.moveBehindDees(prop);
                globalThis.left = prop.left;
                globalThis.objx= prop.obj.x;
                globalThis.objy= prop.obj.y;
            }
            else if(globalThis.objx <(0.5*prop.spacebetween) && globalThis.objx >(-0.5*prop.spacebetween)){ 

                prop = cyclotron.moveBetweenDees(prop);
                globalThis.left = prop.left;
                globalThis.objx= prop.obj.x;
                globalThis.objy= prop.obj.y;
            }
            else{
                prop = cyclotron.moveInDees(prop);
                globalThis.left = prop.left;
                globalThis.objx= prop.obj.x;
                globalThis.objy= prop.obj.y;
                
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

    var reply ={text: ''};
    reply.text = globalThis.simstatus

    return reply;
}

//starts the sim which is called by external client
export function startSim(properties){

    globalThis.running = true;
    globalThis.simstatus = 'sim started';
    var reply ={text: ''};
    reply.text =     globalThis.simstatus;
    return reply;
}

//stops the sim which is called by external client
export function stopSim(properties){

    globalThis.simstatus = 'sim has finished';
    globalThis.running = false;
    var reply ={text: ''};
    reply.text = globalThis.simstatus;

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
