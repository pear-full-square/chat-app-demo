# chat-app-demo

The holepunchto chat-app example revisited.  
Taken from the example described here: https://docs.pears.com/guides/making-a-pear-terminal-app.

This example create a swarm where messages entered in input are send / broadcast to all peers in the swarm.  
There is no persistence of the messages.

## Running in DEV mode

To test this chat app, in one terminal run ```pear dev``` .

The app will output something similar to:

```bash
[info] Created new chat room: a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a
```

In another terminal use this key as input, ```pear dev . a1b2c35fbeb452bc900c5a1c00306e52319a3159317312f54fe5a246d634f51a```

The app will output:

```bash
[info] Number of connections is now 0
[info] New peer joined, 6193ec
[info] Number of connections is now 1
[info] Joined chat room
```

Type something in one of the applications. Two Terminal Applications are now connected peer-to-peer.

Start multiple chat windows by repeating the following command (it uses a preset topic name)
```bash
gnome-terminal -- ./chat.sh
```
To create a new topic name execute ```pear dev . ```.  
There is no need to create a new topic, but if multiple users were to use the same topic then the chat windows across the multiple users would be in one swarm.

When multiple chat windows for the same topic are created while the computer has no internet access then they won't join into a swarm.  
The nodes discover each other through the swarm of the pear application which is bootstrapped with external servers.  
Pear would need bootstrapped with local servers to achieve local discovery.

A message entered by a chat window is broadcast to all peers.  
Closing the chat windows does not remove it from the connection list of the other peers.  
Removal happens on next (failed) delivery of a message.

## Staging the app

