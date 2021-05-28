//https://replit.com/@Haxxors/coinws
const APP_VERSION = "0.0.1";
var peernet = require("socket.io-client").connect("https://coinws.haxxors.repl.co", {reconnect: true});
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const axios = require('axios');
const crypto = require("crypto");
const fs = require("fs");
const express = require("express");
const app = express();
function jstr(json){
  return JSON.stringify(json);
}
function hash(data){
  var hash = crypto.createHmac("sha256", "saltysalt").update(data).digest('hex');
  return hash;
}
function compareHash(str, hash){
  var chash = crypto.createHmac("sha256", "saltysalt").update(str).digest('hex');
  return chash == hash;
}
app.use(express.json());
app.get('/',(req, res) => {
  res.send("ok");
  console.log("got pinged " + Date.now());
});
app.post('/block',(req, res) => {
  requestResponse.push(req.body.data);
  requestPeers.push(req.body.sender);
  res.send("thx for that yummy yum json file");
});
app.post('/fix',(req, res) => {
  if(jstr(req.body.your) != jstr(lastsentdata) || req.body.sender != lastsentadress){
    console.log("Malicious data 'fix' intercepted and rejected");
    res.send("rejected");
  } else {
    BlockChain = req.body.data;
    console.log("Recived Fix");
    res.send("thx for that yummy yum json file");
  }
});
const client = (process.env.REPL_SLUG+"."+process.env.REPL_OWNER+".repl.co").toLowerCase();
peernet.on("ping", (data => {
  console.log(data);
}));
var isRequesting = 0;
var BlockChain;
//var BlockChain = {"json":"sus"};
var requestResponse = [];
var requestPeers = [];
fs.readFile("self.json", async function(err, data){
  if(err+"".match("No such file")){
    console.log("peer setup");
    const replname = process.env.REPL_SLUG;
    const newPeerData = {
      "replname": replname,
      "fullurl": (replname+"."+process.env.REPL_OWNER+".repl.co").toLowerCase(),
      "app_version": APP_VERSION
    }
    fs.writeFileSync("self.json", JSON.stringify(newPeerData));

  } else {
    data=JSON.parse(data.toString('utf8'))
    console.log("peer exists");
    isRequesting=1;
    requestResponse = [];
    requestPeers = [];
    var incoherentpeers = [];
    peernet.emit("chainrequest", data);
    await delay(1000);
    var count = [];
    var count2 = [];
    for(i in requestResponse){
      if(count.indexOf(JSON.stringify(requestResponse[i])) == -1){
          count.push(JSON.stringify(requestResponse[i]))
          count2.push(1);
      } else {
        count2[count.indexOf(JSON.stringify(requestResponse[i]))]=count2[count.indexOf(JSON.stringify(requestResponse[i]))]+1;
      }
    }
    var high = 0;
    var highId = -1;
    for(i in count){
      if(count2[i]>high){
        high=count2[i];
        highId = i;
      }
    }
    for(i in requestResponse){
      if(JSON.stringify(requestResponse[i]) != JSON.stringify(requestResponse[highId])){
        console.log(requestPeers[i]+" sent incorrect data: "+JSON.stringify(requestResponse[i]))
        axios.post("https://"+requestPeers[i]+"/fix", {
          sender: client,
          data: BlockChain,
          your: requestResponse[i]
        });
      }
    }
    BlockChain = requestResponse[highId];
    console.log(BlockChain);
    isRequesting=0;
  }
});
var lastsentdata;
var lastsentadress;
peernet.on("chainrequest", (data => {
  if(isRequesting==0){
    console.log("sent request to "+"https://"+data["fullurl"]);
    axios.post("https://"+data["fullurl"]+"/block", {
      sender: client,
      data: BlockChain
    });
    lastsentadress = data["fullurl"];
    lastsentdata = BlockChain;
  }
}));
peernet.on("chainrequestres", (data => {
  if(isRequesting==1){
    requestResponse.push(data);
    console.log(requestResponse);
  }
}));
app.listen(8080,() => {});
