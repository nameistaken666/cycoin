in a iMessage group all clients have a copy of the conversation on their hard drive (in this case the repl) When a new client is added, another existing client provides the log of messages.
how do we know when a client is added?
manuall???
yeah ofc
 for eggcoin, whenever you fork it, people can see the forks, you need to fork it in order to work, at least that's what the readme says
uh that's not gonna work for non repl clients
in eggcoin look at peers.json
that is what we are trying to recreate
oh
no way
in coin_methods.py they have a ping_all_peers but i can't find the root of that function
i think we are going to have to create a websocket for the peer system
yea so I think they sdid that manually, because i saw that there were a lot more forks