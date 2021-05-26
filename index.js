//https://replit.com/@Haxxors/coinws
const APP_VERSION = "0.0.1";
var peernet = require("socket.io-client").connect("https://coinws.haxxors.repl.co", {reconnect: true});
const fs = require("fs");
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
    peernet.emit("chainrequest", data);
  }
});
peernet.on("chainrequest", (data => {
  if(isRequesting==0){
    peernet.emit("chainrequestres", BlockChain);
  }
}));
peernet.on("chainrequestres", (data => {
  if(isRequesting==1){
    requestResponse.push(data);
    console.log(requestResponse);
  }
}));