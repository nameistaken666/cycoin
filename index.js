//https://replit.com/@Haxxors/coinws
const APP_VERSION = "0.0.1";
var peernet = require("socket.io-client").connect("https://coinws.haxxors.repl.co", {reconnect: true});
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
const axios = require('axios');
const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());
app.get('/',(req, res) => {
  res.sendFile("/index.html");
});
app.post('/block',(req, res) => {
  console.log(req.body);
  res.send(JSON.stringify(req.body)+"<1");
});
const client = (process.env.REPL_SLUG+"."+process.env.REPL_OWNER+".repl.co").toLowerCase();
peernet.on("ping", (data => {
  console.log(data);
}));
var isRequesting = 0;
var BlockChain;
var requestResponse = [];
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
    console.log("peer exists");
    isRequesting=1;
    requestResponse = [];
    //peernet.emit("chainrequest", data);
    await delay(1000);
    console.log(requestResponse);
  }
});
peernet.on("chainrequest", (data => {
  if(isRequesting==0){
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
