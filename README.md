# chat-app-demo

Leg 2 of the journey, the terminal chat-app example revisited. Contains a Pear app life cycle walk-through.  
The original example is here: https://docs.pears.com/guides/making-a-pear-terminal-app.

This example create a swarm where messages entered in one chat-app are send / broadcast to all peers in the swarm.  
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

*** LINUX ONLY ***  
For the first chat app instance, execute ```./_pear_dev``` from the root of the project folder.  
For subsequent chat app instances, execute ```./_pear_dev_chat```.  
Each instance opens in a new terminal. The first chat instance sets the new topic name in the __chat.sh_ file.  
*** LINUX ONLY ***

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

The command signature for pear stage is ```pear stage <channel|key> [dir]```.  
There is no need to specify the directory if it is executed in the root folder of the project.

Before a project is staged for the first time there is no key and only the channel must be used. The channel name can continued to be used thereafter.    
The application name and channel name are involved in generating the application key, which is later used to run the application from the DHT. 
The channel name can be any valid name. Use ```pear stage dev``` for local development checks and internal collaboration, and ```pear stage production``` for production. A custom channel can be used for any customizations/specializations of the application, be it for dev or production purposes. 

```bash
pear stage dev
```

Stage will output a diff of changes - the first time will all be additions of course - and then it will output the application key.  
All state associated with this command is local and by default only the original machine that stages an application can write to this application-dedicated hypercore.

### Running the app on the staging machine

Now that the app is staged within __Pear__ it can be executed using the __run__ command and passing the stage __key__ to it.

```bash
pear run pear://<key>
```

Where ```pear dev``` opens an application from the filesystem, ```pear run``` opens the application from __Pear__'s application storage.  
So far the application has remained local, in order to share it with other peers it must be seeded.

### Seeding the app

The application can be shared with other peers by announcing the application to the DHT and then supplying the application key to other peers.  
The command signature for pear seed is ```pear seed <channel|key> [dir]`.

The staged application can be seeded with:
```bash
pear seed dev
```

The application name and channel name are involved in generating the application key so pear seed uses the project folder to determine the application name from the package.json (pear.name or else name field). There is no need to specify __[dir]__ when executing the command in the root of the project folder.  
This will output something similar to the following

```bash
🍐 Seeding: chat [ dev ]
   ctrl^c to stop & exit

-o-:-
    pear://nykmkrpwgadcd8m9x5khhh43j9izj123eguzqg3ygta7yn1s379o
...
^_^ announced
```

As long as the process is running the application is being seeded. If other peers reseed the application the original process could be closed.  
Be sure to keep the terminal open while this process is running.

### Running the app on another machine

It's important that the application seeding process from the former step is up and running otherwise peers will not be able to connect and replicate state.

From another machine that has pear installed execute the ```pear run pear://<key>``` command to load the application directly peer-to-peer.  
So with the same example application key it would be:

```bash
pear run pear://nykmkrpwgadcd8m9x5khhh43j9izj123eguzqg3ygta7yn1s379o
```
When pear run is executed on the peer machine the staged application should open on that peer.  
If the application is being opened for the first time on the peer it has no state at all, so the application may show a loader until it's ready to reveal.

## Marking a Release

Pear applications are stored in an append-only log (hypercore).  
Each version is identified by __<fork>.<length>.<key>__.  
The length corresponds to the length of the application's append-only log at the time.

The default version opened by the ```pear run pear://<key>``` command before making a release is the latest version.  
Once a release has been marked, the default version opened by the ```pear run pear://<key>``` command is the latest marked release.

Marking a release is typically done in prodution.  
```bash
pear stage production
pear release production
```
Keep in mind that changes to an application can only propagate to peers when the application is being seeded.  

If you want to run the latest staged versions rather than the marked version, then use the following command:
```bash
pear run pear://<key> --checkout=staged
```

### The dump-stage-release strategy

It is best practice to use different machines to stage __dev__ and __production__.
A dump-stage-release strategy seperates the concerns between development and production.

On the machine that holds the production key, run:

```bash
pear dump <internal-key> <path-to-app-production-dir>
```
This is a reverse stage: it extracts the app from the __Pear__ platform storage and saves the files to disk.
Once complete, the project can be staged and released from the production machine with:

```bash
pear stage production
pear release production
```
To allow other peers access to the new release, have ```pear seed production``` running.

## Debugging the app

Uncomment the debug code at the top of the index.js file and install the package.  
This code must be the first item to run.

As the code specifies, pear-inspect is only running when in dev mode, so start the app:
```bash
pear dev .
```

The application will output something similar to:
```bash
Debug with pear://runtime/devtools/a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
```

Start the debugger with the key:
```bash
pear run pear://runtime/devtools/a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2
```
In __Pear__ Desktop go to Developer Tooling and paste in the key.
Note that the key can also be sent to someone else and they can debug the app remotely.

Click on Open in Chrome or copy the link into a tool that support DevTools.
