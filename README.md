# chat-app-demo

The holepunchto chat-app example revisited.  
The original example is here: https://docs.pears.com/guides/making-a-pear-terminal-app.

This example create a swarm where messages entered in input are send / broadcast to all peers in the swarm.  
There is no persistence of the messages.

## Running in DEV mode

Using the ```pear dev .``` command in the root project folder runs the app from the codebase.

### Test Run 1

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

Type something in one of the app windows. The two apps are now connected peer-to-peer.

### Test Run 2

Start multiple chat apps by repeating the following command (it uses a preset topic name)
```bash
gnome-terminal -- ./chat.sh
```
It is not necessary to create a new topic, but if other/multiple users were to use the same topic then the chat apps across those users would be in the same swarm.

When multiple chat apps for the same topic are created on a machine with no internet access then they won't join into a swarm.  
The apps discover each other through the swarm of the __Pear__ application which is bootstrapped with external servers.  
Pear would need bootstrapped with local servers to achieve local discovery.

A message entered in one chat app is broadcast to all peers.  
Closing the chat apps does not remove it from the connection list of the other peers.  
Removal happens on next (failed) delivery of a message.

## Sharing the app

Applications can be shared with peers by __seeding__ them to the network from an efficient local data structure (a __hypercore__).  
The mirroring of a local file system into the __Pear__ platform Application Storage is called __staging__.  
__Seeding__ is sharing an app from a machine over the __Distributed Hash Table (DHT)__ (via __hyperswarm__) so that other peers can replicate, consume and reseed the application.

### Staging the app

