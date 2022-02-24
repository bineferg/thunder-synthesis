// Basic positioning of listener for HRTF spatialisation
// Same position each time, TODO: make mutable

class Listener {
    constructor(posX, posY, posZ){
        this.listener = context.listener;
        this.listener.positionX.value = posX;
        this.listener.positionY.value = posY;
        this.listener.positionZ.value = posZ-5;
    }

    position(){
        this.listener.forwardX.value = 0;
        this.listener.forwardY.value = 0;
        this.listener.forwardZ.value = -1;
        this.listener.upX.value = 0;
        this.listener.upY.value = 1;
        this.listener.upZ.value = 0;
    }
}