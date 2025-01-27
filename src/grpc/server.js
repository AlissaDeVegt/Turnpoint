
var fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');
import * as Timer from '../grpc/ServerTimer';


const packageDef = protoloader.loadSync('src/grpc/product.proto',{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDef);

const productpackage = protoDescriptor.product;

function WarmUpCyclotron(call, callback){
    callback(null,Timer.warmupSim(call.request));
}

function StartCyclotron(call, callback){
    callback(null,Timer.startSim(call.request));
}

function StopCyclotron(call, callback){
    callback(null,Timer.stopSim(call.request));
}

//todo make function that breaks something

export function StartServer(){
        const server = new grpc.Server();
        server.addService(productpackage.Product.service,{WarmUpCyclotron:WarmUpCyclotron,StartCyclotron:StartCyclotron,StopCyclotron:StopCyclotron});
        server.bindAsync('0.0.0.0:9090', grpc.ServerCredentials.createInsecure(),(error,port)=>{ 
        if (error){
            console.error('server has failed : ${error.message}')
        }
        console.log('server running at 0.0.0.0:9090');
    })
        

}
