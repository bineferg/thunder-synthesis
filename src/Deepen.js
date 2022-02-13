// Synthesised component of the deepening roll
// Most generating frequency content in the low ranges

// Code from https://nemisindo.com/app/main-panel/thunder.html


class Deepen {
    constructor() {
        this.deepGain1 = new GainNode(context, { gain: 0 });
        this.deepHPfilter = new BiquadFilterNode(context, { type: 'highpass', frequency: 30, Q: 3 });
        this.deepLPfilter1 = new BiquadFilterNode(context, { frequency: 60, Q: 3 });
        this.deepLPfilter2 = new BiquadFilterNode(context, { frequency: 80, Q: 3 });
        this.deepClip = new AudioWorkletNode(context, 'clip-processor', { parameterData: { LowThreshold: -1, HighThreshold: 1 } });
    }
    // Hard coded sinusoidal gain evenlop
    apply(growlValue, distanceValue) {
        this.deepGain1.gain.setValueAtTime(0, context.currentTime);
        var distanceDelayTime = context.currentTime + distanceValue;
        this.deepGain1.gain.linearRampToValueAtTime(6 * growlValue, distanceDelayTime);
        this.deepGain1.gain.linearRampToValueAtTime(1.75 * growlValue, distanceDelayTime + (2000 / 1000));
        this.deepGain1.gain.linearRampToValueAtTime(5 * growlValue, distanceDelayTime + (3000 / 1000));
        this.deepGain1.gain.linearRampToValueAtTime(1.5 * growlValue, distanceDelayTime + (6000 / 1000));
        this.deepGain1.gain.linearRampToValueAtTime(4.15 * growlValue, distanceDelayTime + (7000 / 1000));
        this.deepGain1.gain.exponentialRampToValueAtTime(growlValue * 0.001, distanceDelayTime + (18000 / 1000));
        setTimeout(function () {
            this.deepGain1.gain.linearRampToValueAtTime(0, (5000 / 1000));
        }.bind(this), 18000);
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
    pan(audioIn, audioOut, x, y, z) {
        var panner = new Panner(x, y, z);
        panner.connect(audioIn, audioOut);
    }
    // Connect audio sources
    connectAudio(deepNoise, delayTime, deepOut) {
        var deepDelay = context.createDelay(20); // create delay with default value of 20s
        deepDelay.delayTime.value = delayTime; // set delay time to distanceSlider.value / C
        deepNoise.connect(this.deepLPfilter1); // low-pass WN by H_LP,1
        this.deepLPfilter1.connect(this.deepHPfilter); // high-pass this signal H_HP
        var deepMult1 = new multiplySigVal(this.deepHPfilter, 3.5, context); // multiply the signal by 3.5
        deepMult1.connect(this.deepClip); // clip the signal in (-1,1)
        this.deepClip.connect(this.deepLPfilter2); // low-pass the clipped signal by H_LP,2
        this.deepLPfilter2.connect(this.deepGain1); // connect gain of H_LP,2 to envelope 
        this.deepGain1.connect(deepDelay); // here's where the signal is delayed
        this.pan(deepDelay, deepOut, this.rand(900), this.rand(100), this.rand(400));
    }
}