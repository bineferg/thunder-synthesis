// General delay code implementing a feedback effect

class Delay {
    constructor(delayTime, feedback) {
        this.delayTime = delayTime;
        this.feedback = feedback;
    }
    applyAndConnect(audioIn, gainOut) {
        var delay = context.createDelay(this.delayTime + 1);
        delay.delayTime.value = this.delayTime;
        audioIn.connect(delay);
        var feedback = context.createGain();
        feedback.gain.value = this.feedback;
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(gainOut);
        return gainOut;
    }
}