# chat-app-demo

The chat-app example with more detail.  
Taken from the example described here: https://docs.pears.com/guides/making-a-pear-terminal-app.

This example create a swarm where messages entered in input are send / broadcast to all peers in the swarm.  
There is no persistence of the messages.

Start a chat window with the following command (it uses a preset topic name)
```bash
gnome-terminal -- ./chat.sh
```
You can create your own topic name with ```pear dev . ```

