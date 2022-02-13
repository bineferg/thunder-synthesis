// Attempt at synthesising the elctrical discharge crackle
// Used still for multistrike clap generation as a deepening effect

// TODO IMPROVE

class Crackle {
    constructor(numCrackles) {
        this.total = numCrackles;
        this.crackleDelay = context.createDelay(20);
        this.crackleOut = new GainNode(context, { gain: 1 });
    }
    crackle(time) {
        var source = new ConstantSourceNode(context, { offset: 0 });
        let now = context.currentTime
        source.start(now + time);
        source.offset.setValueAtTime(1, now + time);
        source.offset.setValueAtTime(0, now + 0.0005 + time);
        return source;
    }
    multiCrackle() {
        for (var i = 0; i < this.total; i++) {
            var cc = this.crackle(Math.random());
            cc.connect(this.crackleOut);
        }
    }
    applyAndConnect(audioOut) {
        this.multiCrackle();
        this.crackleOut.connect(audioOut);
    }
}