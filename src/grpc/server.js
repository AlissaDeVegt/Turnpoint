
var fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
import { ThreeScene } from "@/component/ServerThree";

const packageDef = protoloader.loadSync('src/grpc/product.proto',{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDef);

const productpackage = protoDescriptor.product;

export var startParameters= {
    cyclotronDiameter: 0.0,
    inBetween : 0.0,
    beamcurrentstart : 0,
    beamcurrentend : 0
};
export var durationR;
export var startcyclotronbool = false
export var message;

function warmup(duration){
    durationR = duration;
    var reply ={text: ''}
    reply.text = 'Warmup started with a duration of : ' + durationR.endtime;
    return reply;
}

function Start(startparameters){

    startParameters =startparameters;
    startcyclotronbool = true
    var reply ={text: ''}
    reply.text = 'starting sim with  ' + startParameters.cyclotronDiameter + ' also starting sim with  ' + startParameters.inBetween;

    return reply;
}

function WarmUpCyclotron(call, callback){
    callback(null,warmup(call.request));

}

function StartCyclotron(call, callback){
    callback(null,Start(call.request));
}

function Stop(Message){
    startcyclotronbool = false;
    message = Message;
    var reply ={text: ''};
    reply.text = 'stopping sim';
    return reply;
}

function StopCyclotron(call, callback){
    callback(null,Stop(call.request));
}

export function StartServer(){
        const server = new grpc.Server();
        server.addService(productpackage.Product.service,{WarmUpCyclotron: WarmUpCyclotron,StartCyclotron:StartCyclotron,StopCyclotron:StopCyclotron});
        server.bindAsync('0.0.0.0:9090', grpc.ServerCredentials.createInsecure(),(error,port)=>{ 
        if (error){
            console.error('server has failed : ${error.message}')
        }
        console.log('server running at 0.0.0.0:9090');
    })
        

}
