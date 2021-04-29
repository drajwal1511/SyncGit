const secret = "123456";
const repo = "../TestingWebhooks";
const crypto = require("crypto");
// to execute shell commands from script itself
const exec = require("child_process").exec;
const express = require("express");
const http = require("http");
const ngrok = require("ngrok");
(async () => {
    try {
        const url = await ngrok.connect();
        console.log(url);
    } catch(e){
        console.error(e);
    }
})();
const fetch = require("node-fetch");
const app = express();
app.post("/wh",(req,res)=>{
    // console.log(req);
    req.on('data', chunk => {
        var sig ="sha1="+crypto.createHmac('sha1',secret).update(chunk.toString()).digest('hex');
        if(req.headers['x-hub-signature']==sig){
            var cmd = 'cd '+repo+' && git pull origin main';
            console.log("running command",cmd);
            exec(cmd);
        }
    });
    res.end();
});
app.listen(80,()=>{
    console.log("server up");
})