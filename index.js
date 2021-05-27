//https://replit.com/@Haxxors/coinws
const APP_VERSION = "0.0.1";
var peernet = require("socket.io-client").connect("https://coinws.haxxors.repl.co", {reconnect: true});
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const axios = require('axios');
const crypto = require("crypto");
const fs = require("fs");
const express = require("express");
const app = express();
function hash(data){
  var hash = crypto.createHmac("sha256", "saltysalt").update(data).digest('hex');
  return hash;
}
function compareHash(str, hash){
  var chash = crypto.createHmac("sha256", "saltysalt").update(str).digest('hex');
  return chash == hash;
}
const findUnlike = arr => {
  var odder = undefined;
   for(let i = 1; i < arr.length-1; i++){
      if(arr[i] - arr[i-1] !== 0 && arr[i]-arr[i+1] === 0){
         odder = arr[i-1];
      }else if(arr[i] - arr[i-1] !== 0 && arr[i]-arr[i+1] === 0){
         odder = arr[i]
      }else if(arr[i] - arr[i-1] === 0 && arr[i]-arr[i+1] !== 0){
         odder = arr[i+1];
      };
      continue;
   };
   if(odder != undefined){
     return arr.indexOf(odder);
   } else {
     return undefined;
   }
};
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
const client = (process.env.REPL_SLUG+"."+process.env.REPL_OWNER+".repl.co").toLowerCase();
peernet.on("ping", (data => {
  console.log(data);
}));
var isRequesting = 0;
var BlockChain;
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
    while(findUnlike(requestResponse) != undefined){
      console.log("sent correct array to peer "+requestPeers[findUnlike(requestResponse)]);
      incoherentpeers.push(requestPeers[findUnlike(requestResponse)]);
      requestResponse.splice(findUnlike(requestResponse), 1);
      requestPeers.splice(findUnlike(requestResponse), 1);
    }
    BlockChain = requestResponse[0];
    for(i in incoherentpeers){
      axios.post("https://"+incoherentpeers[i]+"/fix", {
        sender: client,
        data: BlockChain
      });
    }
    console.log(BlockChain);
    isRequesting=0;
  }
});
peernet.on("chainrequest", (data => {
  if(isRequesting==0){
    console.log("sent request to "+"https://"+data["fullurl"]);
    axios.post("https://"+data["fullurl"]+"/block", {
      sender: client,
      data: BlockChain
    });
  }
}));
peernet.on("chainrequestres", (data => {
  if(isRequesting==1){
    requestResponse.push(data);
    console.log(requestResponse);
  }
}));
app.listen(8080,() => {});
