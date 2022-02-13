// Lightning module used for multistrike generation

// Code from https://nemisindo.com/app/main-panel/thunder.html

class Lightning {
    constructor() {
        this.freqAdd = 80;
        this.decTime = 240;
        this.strikeDelays = [0, 0, 0, 0];
        this.strikeCounts = [0, 0, 0, 0];
        this.filters = [];
        this.strikeGain = [];
        for (var i = 0; i < 8; i++) {
            this.filters[i] = new BiquadFilterNode(context, { type: 'bandpass', Q: 7 });
        }
        this.strikeOut = new GainNode(context, { gain: 0.4 });
        for (var i = 0; i < 4; i++) {
            this.strikeGain[i] = new GainNode(context, { gain: 0 });
        }
        this.canvas = new Canvas("myCanvas");
    }
    strike() {
        var splitRandom = Math.random() * this.canvas.height();
        var strikeNumber, strikeNumber2;
        var strikeTime, strikeTime2;
        var split = false;
        for (var i = 0; i < 20; i++) {
            if (this.canvas.myInitial < 100) {
                strikeNumber = i % 4;
                strikeTime = (100 - this.canvas.myInitial) / 100;
                this.strikeRoute(strikeNumber, strikeTime);
                // Draw
                this.canvas.draw();
                if (this.canvas.myInitial2 >= splitRandom) {
                    split = true;
                    strikeNumber2 = (i + 2) % 4;
                    strikeTime2 = (100 - this.canvas.myInitial2) / 100;
                    this.strikeRoute(strikeNumber2, strikeTime2);
                    this.canvas.draw2();
                }
            }
            this.canvas.update(split);
        }
    }
    applyFeedback(audioIn, audioOut) {
        let feedback = new Feedback(0.6, 0.15); //(delayTime, feedback)
        feedback.applyAndConnect(audioIn, audioOut);
    }
    pan(audioIn, audioOut, x, y, z) {
        var panner = new Panner(x, y, z);
        panner.connect(audioIn, audioOut);
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
    connectAudio(strikeNoise, delay, gainOut) {
        var strikeDelay = context.createDelay(5);
        strikeDelay.delayTime.value = delay;
        for (var i = 0; i < 4; i++) strikeNoise.connect(this.strikeGain[i]); // Connect incoming noise to 4 gains
        this.strikeGain[0].connect(this.filters[0]);
        this.strikeGain[0].connect(this.filters[1]);
        this.strikeGain[1].connect(this.filters[2]);
        this.strikeGain[1].connect(this.filters[3]);
        this.strikeGain[2].connect(this.filters[4]);
        this.strikeGain[2].connect(this.filters[5]);
        this.strikeGain[3].connect(this.filters[6]);
        this.strikeGain[3].connect(this.filters[7]); // All filters are bandpass, each is controlled in strikeEnvelopeX
        for (var i = 0; i < 8; i++) this.filters[i].connect(this.strikeOut); // Connect to out gain
        this.strikeOut.connect(strikeDelay); // Delay out gain by 5 seconds
        this.applyFeedback(this.strikeOut, gainOut); // Apply feedback with delayTime 1.6s and feedback 0.15
        this.pan(strikeDelay, gainOut, this.rand(800), this.rand(500), this.rand(50));
        return gainOut;
    }
    strikeRoute(myStrikeNumber, myStrikeTime) {
        switch (myStrikeNumber) {
            case 0: this.strikeEnvelopeZero(myStrikeTime);
                break;
            case 1: this.strikeEnvelopeOne(myStrikeTime);
                break;
            case 2: this.strikeEnvelopeTwo(myStrikeTime);
                break;
            case 3: this.strikeEnvelopeThree(myStrikeTime);
                break;
            default: this.strikeEnvelopeZero(myStrikeTime);
                break;
        }
    }
    strikeEnvelopeZero(time) {
        var decTime0 = this.decTime * Math.pow((1 - time) + 0.4, 5);
        this.strikeGain[0].gain.setValueAtTime(2 * strikeSlider.value, context.currentTime + ((this.strikeDelays[0]) / 1000));
        this.strikeGain[0].gain.linearRampToValueAtTime(0, context.currentTime + ((decTime0 + this.strikeDelays[0]) / 1000));
        this.filters[0].frequency.setValueAtTime((time * 1200) + this.freqAdd, context.currentTime + ((decTime0 + this.strikeDelays[0]) / 1000));
        this.filters[1].frequency.setValueAtTime(((time * 1200) + this.freqAdd) * 0.5, context.currentTime + ((decTime0 + this.strikeDelays[0]) / 1000));
        this.strikeCounts[0]++;
        this.strikeDelays[0] += decTime0;
    }
    strikeEnvelopeOne(time) {
        var decTime1 = this.decTime * Math.pow((1 - time) + 0.4, 5);
        this.strikeGain[1].gain.setValueAtTime(2 * strikeSlider.value, context.currentTime + ((this.strikeDelays[1]) / 1000));
        this.strikeGain[1].gain.linearRampToValueAtTime(0, context.currentTime + ((decTime1 + this.strikeDelays[1]) / 1000));
        this.filters[2].frequency.setValueAtTime((time * 1200) + this.freqAdd, context.currentTime + ((decTime1 + this.strikeDelays[1]) / 1000));
        this.filters[3].frequency.setValueAtTime(((time * 1200) + this.freqAdd) * 0.5, context.currentTime + ((decTime1 + this.strikeDelays[1]) / 1000));
        this.strikeCounts[1]++;
        this.strikeDelays[1] += decTime1;
    }
    strikeEnvelopeTwo(time) {
        var decTime2 = this.decTime * Math.pow((1 - time) + 0.4, 5);
        this.strikeGain[2].gain.setValueAtTime(2 * strikeSlider.value, context.currentTime + ((this.strikeDelays[2]) / 1000));
        this.strikeGain[2].gain.linearRampToValueAtTime(0, context.currentTime + ((decTime2 + this.strikeDelays[2]) / 1000));
        this.filters[4].frequency.setValueAtTime((time * 1200) + this.freqAdd, context.currentTime + ((decTime2 + this.strikeDelays[2]) / 1000));
        this.filters[5].frequency.setValueAtTime(((time * 1200) + this.freqAdd) * 0.5, context.currentTime + ((decTime2 + this.strikeDelays[2]) / 1000));
        this.strikeCounts[2]++;
        this.strikeDelays[2] += decTime2;
    }
    strikeEnvelopeThree(time) {
        var decTime3 = this.decTime * Math.pow((1 - time) + 0.4, 5);
        this.strikeGain[3].gain.setValueAtTime(2 * strikeSlider.value, context.currentTime + ((this.strikeDelays[3]) / 1000));
        this.strikeGain[3].gain.linearRampToValueAtTime(0, context.currentTime + ((decTime3 + this.strikeDelays[3]) / 1000));
        this.filters[6].frequency.setValueAtTime((time * 1200) + this.freqAdd, context.currentTime + ((decTime3 + this.strikeDelays[3]) / 1000));
        this.filters[7].frequency.setValueAtTime(((time * 1200) + this.freqAdd) * 0.5, context.currentTime + ((decTime3 + this.strikeDelays[3]) / 1000));
        this.strikeCounts[3]++;
        this.strikeDelays[3] += decTime3;
    }
}
