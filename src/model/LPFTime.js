// General low pass filter component
// Applied to the whole signal after generation

class LPFTime {
    constructor() {
        this.lpfNode = new BiquadFilterNode(context, { type: 'lowpass', Q: -8 });

    }
    capture(time, startF, endF) {
        this.lpfNode.frequency.setValueAtTime(startF, context.currentTime + time);
        this.lpfNode.frequency.linearRampToValueAtTime(endF, context.currentTime + time + (200 / 1000) + (16000 / 1000));
    }
    connectAudio(audioIn, audioOut) {
        audioIn.connect(this.lpfNode);
        this.lpfNode.connect(audioOut);
    }
}