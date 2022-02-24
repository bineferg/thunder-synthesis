// General panner node

class Panner {
    // set our bounds
    constructor(posX, posY, posZ) {
        this.panner = new PannerNode(context, {
            panningModel: 'HRTF',
            distanceModel: 'linear',
            positionX: posX,
            positionY: posY,
            positionZ: posZ,
            orientationX: 0.0,
            orientationY: 0.0,
            orientationZ: -1.0,
            rolloffFactor: 10,
            coneInnerAngle: 60,
            coneOuterAngle: 90,
            coneOuterGain: 0.6
        })
        this.topBound = -posY;
        this.bottomBound = posY;
        this.rightBound = posX;
        this.leftBound = -posX;
        this.innerBound = 0.1;
        this.outerBound = 1.5;
    }
    connect(audioIn, audioOut) {
        audioIn.connect(this.panner).connect(audioOut);
    }
}