// General dynamic compression component

class Compressor{

    // Default values TODO override
    constructor(){
        this.compressor = new DynamicsCompressorNode(context);
        this.compressor.threshold.setValueAtTime(-45, context.currentTime);
        this.compressor.knee.setValueAtTime(5, context.currentTime);
        this.compressor.ratio.setValueAtTime(6, context.currentTime);
        this.compressor.attack.setValueAtTime(0.6, context.currentTime);
        this.compressor.release.setValueAtTime(0.15, context.currentTime);

    }

    connectAudio(audioIn, compOut){
        audioIn.connect(this.compressor);
        this.compressor.connect(compOut);
    }
}