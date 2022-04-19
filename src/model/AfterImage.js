// Synthesised component of long delays following the clap
// Most generating frequency content in the mid ranges

// Model available at https://nemisindo.com/models/thunder.html


class AfterImage {
    constructor() {
        this.afterGain1 = new GainNode(context, { gain: 0 });
        this.afterLPfilter = new BiquadFilterNode(context, { frequency: 3, Q: 3 });
        this.afterClip = new AudioWorkletNode(context, 'clip-processor', { parameterData: { LowThreshold: -1, HighThreshold: 1 } });
        this.afterBPfilter = new BiquadFilterNode(context, { type: 'bandpass', frequency: 333, Q: 4 });

    }
    // Add sinusoidal (hardcoded) gain envelope depenedent on distance
    capture(strikeValue, distanceValue) {
        this.afterGain1.gain.setValueAtTime(0, context.currentTime);
        var distanceDelayTime = context.currentTime + distanceValue;
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 2, distanceDelayTime);
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 0.4, distanceDelayTime + (300 / 1000));
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 1.5, distanceDelayTime + (800 / 1000));
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 0.25, distanceDelayTime + (1200 / 1000));
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 1.25, distanceDelayTime + (2000 / 1000));
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 0.6, distanceDelayTime + (3000 / 1000));
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 1.15, distanceDelayTime + (5000 / 1000));
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 0.35, distanceDelayTime + (7000 / 1000));
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 0.15, distanceDelayTime + (9500 / 1000));
        this.afterGain1.gain.linearRampToValueAtTime(strikeValue * 0.001, distanceDelayTime + (14000 / 1000));
        this.afterLPfilter.frequency.setValueAtTime(33, distanceDelayTime + (200 / 1000));
        this.afterLPfilter.frequency.linearRampToValueAtTime(0, distanceDelayTime + (200 / 1000) + ((14000) / 1000));
    }
    rand(mulVal) {
        var neg = Math.random();
        var num = Math.random();

        if (neg < 0.5)
            num = Math.floor(-mulVal * num);
        else
            num = Math.ceil(mulVal * num);

        return num;
    }
    // Connect audio sources
    connectAudio(afterNoise1, afterNoise2, delayTime, afterOut) {
        var afterDelay = context.createDelay(20); // delay by 20s
        afterDelay.delayTime.value = delayTime; // delay by distanceSlider / C
        afterNoise1.connect(this.afterLPfilter); // connect afterNoise1 to afterLPFilter
        var afterMult1 = new multiplySigVal(this.afterLPfilter, 80, context); // multiply afterLPFilter signal by 80
        var afterMult2 = new multiplySignals(afterMult1, afterNoise2, context); // multiply afterNoise2 by (afterLPfilter * 80)
        afterMult2.connect(this.afterClip); // clip between (-1,1)
        this.afterClip.connect(this.afterBPfilter); // bandpass the clipped signal
        this.afterBPfilter.connect(this.afterGain1); // connect this bandpassed signal to the ramping gain
        var afterMult3 = new multiplySigVal(this.afterGain1, 0.9, context); // multiply delayed signed by 0.9 
        afterMult3.connect(afterDelay); // this is where the signal is actually delayed
        afterOut = this.pan(this.afterGain1, afterOut, this.rand(800), this.rand(800), this.rand(100));
        return afterOut;
    }
    pan(audioIn, audioOut, x, y, z) {
        var panner = new Panner(x, y, z);
        panner.connect(audioIn, audioOut);
        return audioOut;
    }
}