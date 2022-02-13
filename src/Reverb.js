// Reverb module - for storing in buffer in browser, not currently in use
// TODO use for more versitility in reverb effects

class Reverb {
    constructor(audioFile) {
        var convolver = context.createConvolver();
        this.fileReader = new FileReaderSync();
        this.convoler.buffer = this.fileReader.readAsArrayBuffer(audioFile);
        console.log(convolver);
    }
    applyAndConnect(gainOut) {
        gainOut.connect(this.convolver);
        this.convolver.connect(context.destination);
    }
}