const secret = "123456";
const repo = "../TestingWebhooks";
const crypto = require("crypto");
// to execute shell commands from script itself
const exec = require("child_process").exec;
const express = require("express");
const app = express();
const env = require("./env");
app.post("/wh",(req,res)=>{
    // console.log(req);
    req.on('data', chunk => {
        var sig ="sha1="+crypto.createHmac('sha1',secret).update(chunk.toString()).digest('hex');
        if(req.headers['x-hub-signature']==sig){
            var cmd = 'cd '+repo+' && git pull origin '+env.BRANCH;
            console.log("running command",cmd);
            exec(cmd);
        }
    });
    res.end();
});
app.listen(env.PORT,()=>{
    console.log("server up");
});
