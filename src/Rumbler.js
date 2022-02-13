// Synthesised component of rumbling/growl
// Most generating frequency content in the mid ranges

// Code from https://nemisindo.com/app/main-panel/thunder.html

class Rumbler {
    constructor(rumbleVal) {
        this.rumbleGain = new GainNode(context, { gain: 1 });
        this.rumbleGain1 = new GainNode(context, { gain: 3 });
        this.rumbleValue = rumbleVal;
        this.rumbleLPfilters = [];
        for (var i = 0; i < 8; i++) this.rumbleLPfilters[i] = new BiquadFilterNode(context, { Q: 3 });
        this.rumbleHPfilter = new BiquadFilterNode(context, { type: 'highpass', frequency: 300, Q: 9 });
        this.Max = new AudioWorkletNode(context, 'clip-processor', { parameterData: { LowThreshold: 0 } });
        this.Phasor = new AudioWorkletNode(context, 'phasor-generator');
        this.merger = context.createChannelMerger(2);
        this.rumbleSample = new AudioWorkletNode(context, 'sample-and-hold');
        this.splitter = context.createChannelSplitter(2);
        this.MaxRumble = new AudioWorkletNode(context, 'max-signal', { parameterData: { max: 0 } });
        this.MinRumble = new AudioWorkletNode(context, 'min-signal', { parameterData: { min: 0 } });
        this.rumbleInv = new AudioWorkletNode(context, 'invert-processor');
    }
    // Added hardcoded sinusoidal envelop for gain
    // LP filters applied linearly over time
    rumble(distanceDelay) {
        this.rumbleGain1.gain.setValueAtTime(0, context.currentTime);
        var distanceDelayTime = context.currentTime + distanceDelay;
        this.rumbleGain1.gain.setValueAtTime(this.rumbleValue * 2.5, distanceDelayTime);
        this.rumbleGain1.gain.linearRampToValueAtTime(this.rumbleValue * 0.15, distanceDelayTime + (500 / 1000));
        this.rumbleGain1.gain.linearRampToValueAtTime(this.rumbleValue * 1.7, distanceDelayTime + (800 / 1000));
        this.rumbleGain1.gain.linearRampToValueAtTime(this.rumbleValue * 0.12, distanceDelayTime + (1000 / 1000));
        this.rumbleGain1.gain.linearRampToValueAtTime(this.rumbleValue * 0.8, distanceDelayTime + (1300 / 1000));
        this.rumbleGain1.gain.linearRampToValueAtTime(this.rumbleValue * 0.25, distanceDelayTime + (2000 / 1000));
        this.rumbleGain1.gain.linearRampToValueAtTime(this.rumbleValue * 0.05, distanceDelayTime + (6000 / 1000));
        this.rumbleGain1.gain.linearRampToValueAtTime(this.rumbleValue * .00001, distanceDelayTime + (9000 / 1000));
        for (var i = 0; i < 4; i++) {
            this.rumbleLPfilters[i].frequency.setValueAtTime(1000, distanceDelayTime);
            this.rumbleLPfilters[i].frequency.linearRampToValueAtTime(0, context.currentTime + distanceDelayTime + (12000 / 1000));
        }
        return this.rumbleGain
    }
    connectAudio(rumbleNoise1, rumbleNoise2, delayTime, gainOut) {
        var rumbleDelay = context.createDelay(20);
        rumbleDelay.delayTime.value = delayTime;

        rumbleNoise1.connect(this.rumbleLPfilters[0]); // rumbleNoise1 filtered by rumbleLPfilters[0]
        this.rumbleLPfilters[0].connect(this.Max); // max(rumbleLPfilters[0], 0)
        this.Max.connect(this.rumbleGain1); // gain of max'd rumbleLPfilters[0] is rumbleGain1
        var shiftMax = new addSigVal(this.rumbleGain1, 1, context); // rumbleGain1 + 1
        shiftMax.connect(this.Phasor.parameters.get('frequency')); // frequency of phasor is rumbleGain1 + 1

        rumbleNoise2.connect(this.rumbleLPfilters[1]);
        rumbleNoise2.connect(this.merger, 0, 0);
        this.Phasor.connect(this.merger, 0, 1);
        this.merger.connect(this.rumbleSample);
        this.rumbleSample.connect(this.splitter);
        var splitMult = new multiplySigVal(this.splitter, 0.4, context);
        splitMult.connect(this.MaxRumble);
        splitMult.connect(this.MinRumble);
        var negMult = new multiplySigVal(this.MinRumble, -1, context); //[-1,0]
        var rumbleAdd1 = new addSignals(negMult, this.MaxRumble, context); //[-2,0]
        var subRumble1 = new subtractSigVal(rumbleAdd1, 0.5, context); //[-2.5,-0.5]
        var rumbleMult1 = new multiplySignals(subRumble1, subRumble1, context); //[0.25,6.25]
        var rumbleMult2 = new multiplySigVal(rumbleMult1, -4, context); //[-3.75,2.25]
        var rumbleAdd2 = new addSigVal(rumbleMult2, 1, context); //[-2.75,3.25]
        var rumbleMult3 = new multiplySigVal(rumbleAdd2, 0.5, context); //[-1.375,1.625]
        var rumbleMult3 = new multiplySignals(rumbleMult3, rumbleAdd1, context); //[-3.25,2.75]
        rumbleMult3.connect(this.rumbleHPfilter);
        this.rumbleHPfilter.connect(this.rumbleGain1);
        this.rumbleGain1.connect(gainOut);
        //this.gainOut.connect(rumbleGain);
        rumbleDelay.connect(gainOut);
        return this.pan(gainOut, Math.random() * 900, Math.random() * 100, Math.random() * 50);
    }
    pan(audioIn, x, y, z) {
        var audioOut = new GainNode(context, { gain: 1 });
        var panner = new Panner(x, y, z);
        panner.connect(audioIn, audioOut);
        return audioOut;
    }
}
