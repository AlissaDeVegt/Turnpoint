var fs = require('fs');
var async = require('async');
const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');

const packageDef = protoloader.loadSync("./src/grpc/product.proto",{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDef);

const productpackage = protoDescriptor.product;
var client =new productpackage.Product('localhost:9090',grpc.credentials.createInsecure());


function runwarmup(callback){
    function warmupcallback(error, reply){
        if(error){
            callback(error);
            return;
        }
        console.log(reply.text);
    }

    var duration = {
        starttime : 1,
        endtime : 600
    }

    client.WarmUpCyclotron(duration,warmupcallback);
  
}

function runStart(callback){
    function startcallback(error, reply){
        if(error){
            callback(error);
            return;
        }
        console.log(reply.text);
    }

    var StartParamaters = {
        cyclotronDiameter : 1,
        inBetween : 0.5,
        beamcurrentstart : 5,
        beamcurrentend : 300
    }

    client.StartCyclotron(StartParamaters,startcallback);
  
}

function runStop(callback){
    function Stopcallback(error, reply){
        if(error){
            callback(error);
            return;
        }
        console.log(reply.text);
    }

    var Message = {
        text : 'stop this' 
    }

    client.StopCyclotron(Message,Stopcallback);
  
}

export function main(){
    var warmup =false,start=false;
    var time = 0;
    setInterval(() => {
        if(warmup ==false&&start==false&&time==0){
            async.series([runwarmup]);
            warmup =true
        }
        else if(warmup ==true&&start==false&&time<=1){
            async.series([runStart]);           
            start =true
        }
        else if(warmup ==true&&start==true&&time>=10){
            async.series([runStop]);
            warmup =false,start=false;
            time = -4;
        }
        time= time +1;

    }, 1000)
}

exports.runwarmup =runwarmup;
exports.runStart =runStart;
exports.runStop =runStop;