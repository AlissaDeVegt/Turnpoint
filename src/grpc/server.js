
var fs = require('fs');
const grpc = require('@grpc/grpc-js');
const protoloader = require('@grpc/proto-loader');

const packageDef = protoloader.loadSync('src/grpc/product.proto',{
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const protoDescriptor = grpc.loadPackageDefinition(packageDef);

const productpackage = protoDescriptor.product;

export var startParameters;
export var durationR={        
    starttime:1,
    endtime:2};
export var startcyclotronbool = false


function warmup(duration){
    durationR = duration;
    var reply ={text: ''}
    reply.text = 'Warmup started with a duration of : ' + durationR.endtime;
    return reply;
}

function Start(startparameters){
    //refresher.refreshPage();
    startParameters =startparameters;
    startcyclotronbool = true
    var reply ={text: ''}
    reply.text = 'starting sim with  ' + startparameters.beamDurationend;
    return reply;
}

function WarmUpCyclotron(call, callback){
    callback(null,warmup(call.request));
}

function StartCyclotron(call, callback){
    callback(null,Start(call.request))
    
}


//add a test for fiinding working port mm 
export function StartServer(){
    
    const server = new grpc.Server();
    server.addService(productpackage.Product.service,{WarmUpCyclotron: WarmUpCyclotron,StartCyclotron:StartCyclotron});
    server.bindAsync('0.0.0.0:9090', grpc.ServerCredentials.createInsecure(),(error,port)=>{
        if (error){
            console.error('server has failes : ${error.message}')
        }
        console.log('server running at 0.0.0.0:9090');
    });
    
}
