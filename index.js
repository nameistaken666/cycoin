//https://replit.com/@Haxxors/coinws
var peernet = require("socket.io-client").connect("https://coinws.haxxors.repl.co", {reconnect: true});
peernet.on("ping", (data => {
  console.log(data);
}));
peernet.emit("ping", {"alive": true});