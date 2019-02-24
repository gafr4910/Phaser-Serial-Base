const SerialPort = require('serialport');
const DelimiterParser = require('@serialport/parser-delimiter');

// Creates a serial port connection automatically with
class SerialPortReader {
  constructor() {
    this.port = undefined;
    this.parser = undefined;
    this.listener = undefined;
  }

  openPort(testFunction, delimiter) {
    if (!this.port && !this.parser) {
      SerialPort.list()
      // find the good port
      .then(ports => ports.find(testFunction))
      .then(portInfo => {
        this.port = new SerialPort(portInfo.comName);
        this.parser = this.port.pipe(new DelimiterParser({ delimiter: delimiter }));

        // Connect listener to port
        this.parser.on('data', d => {
          if (this.listener) this.listener(d.toString());
        });
      });
    } else {
      throw new Error('Serial Port Reader Instance Already Connected!');
    }
  }
  
  setListener(listener) {
    this.listener = listener;
    if (this.parser) this.parser.on('data', d => listener.next(d));
  }
}

module.exports = SerialPortReader;
