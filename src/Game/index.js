// Import outside libraries
const Phaser = require('phaser');
// Local Modules
const SerialPortReader = require('./SerialPortReader');

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
};

const serial = new SerialPortReader();

// Phaser setup
function create() {
  graphics = this.add.graphics({
    fillStyle: { color: 0xeeeeee },
    lineStyle: { width: 3, color: 0xeeeeee }
  });
}

function update(totalTime, deltaTime) {
  graphics.clear();
  graphics.fillStyle(0xeeeeee, 1);
  graphics.save();
  if(isTouched){
    graphics.fillStyle(0x0000e2, 1);
    //console.log('eyy');
  }
  graphics.fillCircle(config.width/2, config.height/2, 20);
  graphics.restore();
}

let isTouched = false;

function onSerialMessage(msg) {
  // Put your serial reading code in here. msg will be a string
  if(msg[0] == "h"){
    isTouched = true;
    //console.log('here');
  }
  else if(msg[0] == 'l'){
    isTouched = false;
    //console.log('?')
  }
  //console.log(msg);
  //console.log(isTouched);
}


config.scene = {
  create: create,
  update: update
}

let game;
  
// Exported Module so game can be initialized elseware
const GameManager = {
  init: () => {
    // Set serial port listener. To keep the code clean we use a helper function defined above
    serial.setListener(onSerialMessage);
    // The openPort function takes a callback function for finding the correct arduino from a list
    // and whatever you want your delimiter to be between packets
    serial.openPort(p => /Arduino/.test(p.manufacturer), '\n');
    
    game = new Phaser.Game(config);
  },
};

module.exports = GameManager;
