/* Uncomment this code to debug in dev - first install pear-inspect 
if (Pear.config.dev) {
  const { Inspector } = await import('pear-inspect')
  const inspector = await new Inspector()
  const key = await inspector.enable()
  console.log(`Debug with pear://runtime/devtools/${key.toString('hex')}`)
} */
/* global Pear */
import Localdrive from 'localdrive'  // Module to interact with the local filesystem
import Hyperswarm from 'hyperswarm'   // Module for P2P networking and connecting peers
import b4a from 'b4a'                 // Module for buffer-to-string and vice-versa conversions 
import crypto from 'hypercore-crypto' // Cryptographic functions for generating the key in app
import readline from 'bare-readline'  // Module for reading user input in terminal
import tty from 'bare-tty'            // Module to control terminal behavior


const { teardown, config } = Pear    // Import configuration options and cleanup functions from Pear
const key = config.args.pop()       // Retrieve a potential chat room key from command-line arguments
const shouldCreateSwarm = !key      // Flag to determine if a new chat room should be created

// Create the local swarm and set the peer name
const swarm = new Hyperswarm()
const myName = b4a.toString(swarm.keyPair.publicKey, 'hex').substr(0, 6)
console.log('[info] My Peer Identifier: ', myName)

// Unannounce the public key before exiting the process
// (This is not a requirement, but it helps avoid DHT pollution)
teardown(() => swarm.destroy())

const rl = readline.createInterface({
  input: new tty.ReadStream(0),
  output: new tty.WriteStream(1)
})

// When there's a new connection, listen for new messages, and output them to the terminal
swarm.on('connection', peer => {
  const name = b4a.toString(peer.remotePublicKey, 'hex').substr(0, 6)
  console.log(`[info] New peer joined, ${name}`)
  peer.on('data', message => appendMessage({ name, message }))
  peer.on('error', e => console.log(`Connection error: ${e}`))
})

// When there's updates to the swarm, update the peers count
swarm.on('update', () => {
  console.log(`[info] Number of connections is now ${swarm.connections.size}`)
})

if (shouldCreateSwarm) {
  await createChatRoom()
} else {
  await joinChatRoom(key)
}

rl.input.setMode(tty.constants.MODE_RAW) // Enable raw input mode for efficient key reading
rl.on('data', line => {
  if(line==='.exit') { rl.input.setMode(tty.constants.MODE_NORMAL); console.log('\nPress Crtl^C and ENTER'); }
  else { sendMessage(line); rl.prompt(); }
})
rl.prompt()

async function createChatRoom () {
  // Generate a new random topic (32 byte string)
  const topicBuffer = crypto.randomBytes(32)
  // Create a new chat room for the topic
  await joinSwarm(topicBuffer)
  const topic = b4a.toString(topicBuffer, 'hex')
  console.log(`[info] Created new chat room: ${topic} - Enter .exit to exit`)
  const drive = new Localdrive('.')
  const command = 'pear dev . ' + topic
  if(config.dev) {
    console.log('Updating _chat.sh file with new key')
    await drive.put('/_chat.sh', Buffer.from(command),{ executable: true })
    await drive.put('/_pear_dev', Buffer.from('gnome-terminal -- pear dev .'),{ executable: true })
    await drive.put('/_pear_dev_chat', Buffer.from('gnome-terminal -- ./_chat.sh'),{ executable: true })
  }
 }

async function joinChatRoom (topicStr) {
  const topicBuffer = b4a.from(topicStr, 'hex')
  await joinSwarm(topicBuffer)
  console.log(`[info] Joined chat room: ${topicStr} - Enter .exit to exit`)
}

async function joinSwarm (topicBuffer) {
    // Join the swarm with the topic. Setting both client/server to true means that this app can act as both.
  const discovery = swarm.join(topicBuffer, { client: true, server: true })
  await discovery.flushed()
}

function sendMessage (message) {
  // Send the message to all peers (that you are connected to)
  const peers = [...swarm.connections]
  for (const peer of peers) peer.write(message)
}

function appendMessage ({ name, message }) {
  // Output chat msgs to terminal
  console.log(`[${name}] ${message}`)
}
