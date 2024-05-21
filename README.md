# chat-app-demo

The chat-app example with more detail.  
Taken from the example described here: https://docs.pears.com/guides/making-a-pear-terminal-app.

This example create a swarm where messages entered in input are send / broadcast to all peers in the swarm.  
There is no persistence of the messages.

## Running in DEV mode

Start multiple chat windows by repeating the following command (it uses a preset topic name)
```bash
gnome-terminal -- ./chat.sh
```
To create a new topic name execute ```pear dev . ```.

A message entered by a chat window is broadcast to all peers.  
Closing chat windows does not remove it from the connection list of the other peers.  
Removal happens on next (failed) delivery of a message.
