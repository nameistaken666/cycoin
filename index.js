//https://replit.com/@Haxxors/coinws
var io = require("socket.io-client");
var peernet = io.connect("https://coinws.haxxors.repl.co", {reconnect: true});
peernet.on("ping", (data => {
  console.log(data);
}));
peernet.emit("ping", {"alive": true});