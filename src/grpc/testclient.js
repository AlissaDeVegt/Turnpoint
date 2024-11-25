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
        beamDurationstart : 1,
        beamDurationend : 100,
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
    async.series([runwarmup]);
    async.series([runStart]);

    //async.series([runStop]);
}

exports.runwarmup =runwarmup;
exports.runStart =runStart;
exports.runStop =runStop;