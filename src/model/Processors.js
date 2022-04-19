// All registered processors for AudioNodes used in this model

// Model available at https://nemisindo.com/models/thunder.html

registerProcessor('phasor-generator', class extends AudioWorkletProcessor {
  constructor() {
    super();
    this.phase = 0;
  }
  static get parameterDescriptors() {
    return [ {name:"phase",defaultValue: 0,max: 1,min:0},{name:"frequency",defaultValue: 1000},{name:"sync",defaultValue: 0,min: 0},{name:"duty",defaultValue:1,max: 1,min:0.000001}];
  }
  process(inputs, outputs, params) {
    let input = inputs[0],output = outputs[0];
    let frequency = params.frequency;
    let duty = params.duty;
    for (let channel = 0; channel < output.length; ++channel) {
      let inputChannel = input[channel],outputChannel = output[channel];
      if (frequency.length === 1)
      {
        for (let i = 0; i < outputChannel.length; ++i) {
          if (this.phase > duty) outputChannel[i]=0;
          else outputChannel[i]=this.phase * (1/duty);
          this.phase += frequency[0] / sampleRate;
          this.phase = this.phase-Math.floor(this.phase);
        }
      }
      else
      {
        for (let i = 0; i < outputChannel.length; ++i) {
          if (this.phase > duty) outputChannel[i]=0;
          else outputChannel[i]=this.phase * (1/duty);
          this.phase += frequency[i] / sampleRate;
          this.phase = this.phase-Math.floor(this.phase);
        }
      }
    }
    return true;
  }
});

registerProcessor('snap-noise-generator',class extends AudioWorkletProcessor {
    process(inputs, outputs) {
      for (let i=0;i<outputs[0][0].length;++i)  outputs[0][0][i]=2*Math.random()-1;
      return true;
    }
});

registerProcessor('snap-single-pole-lpf', class extends AudioWorkletProcessor {
    static get parameterDescriptors() { return [{ name: 'frequency',defaultValue: 100,minValue: 0 }]; }
    constructor() {
      super();
      this.lastOut = 0,this.coeff;
      this.updateCoefficientsWithFrequency_(100);
    }
    updateCoefficientsWithFrequency_(frequency) {
      this.coeff = 2 * Math.PI * frequency / sampleRate;
      if (this.coeff > 1.0) this.coeff = 1.0;
      else if (this.coeff < 0) this.coeff = 0;
    }
    process(inputs, outputs, parameters) {
      let input = inputs[0],output = outputs[0];
      let frequency = parameters.frequency;
      for (let channel = 0; channel < output.length; ++channel) {
        let inputChannel = input[channel],outputChannel = output[channel];
        if (frequency.length === 1)
        {
          this.updateCoefficientsWithFrequency_(frequency[0]);
          for (let i = 0; i < outputChannel.length; ++i) {
            outputChannel[i]=inputChannel[i] * this.coeff +(1-this.coeff)*this.lastOut;
            this.lastOut=outputChannel[i];
          }
        }
        else {
          for (let i = 0; i < outputChannel.length; ++i) {
            this.updateCoefficientsWithFrequency_(frequency[i]);
            outputChannel[i]=inputChannel[i] * this.coeff +(1-this.coeff)*this.lastOut;
            this.lastOut=outputChannel[i];
          }
        }
      }
      return true;
    }
});

registerProcessor('white-noise-generator',class extends AudioWorkletProcessor {
  constructor() { super(); }
  process(inputs, outputs) {
    let output = outputs[0];
    for (let channel=0;channel<output.length;++channel) {
      let outputChannel = output[channel];
      for (let i=0;i<outputChannel.length;++i)  outputChannel[i]=2*Math.random()-1;
    }
    return true;
  }
});

registerProcessor('clip-processor', class extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: 'LowThreshold',
            defaultValue: -1
        }, {
            name: 'HighThreshold',
            defaultValue: 1
        }];
    }
    constructor() {
        super();
    }
    process(inputs, outputs, parameters) {
        let input = inputs[0],
            output = outputs[0];
        let _loThres = parameters.LowThreshold,
            _hiThres = parameters.HighThreshold;
        for (let channel = 0; channel < input.length; ++channel) {
            let inputChannel = input[channel],
                outputChannel = output[channel];
            if (_loThres.length === 1) {
                for (let i = 0; i < inputChannel.length; ++i) {
                    if (inputChannel[i] < _loThres[0]) outputChannel[i] = _loThres[0];
                    else if (inputChannel[i] > _hiThres[0]) outputChannel[i] = _hiThres[0];
                    else outputChannel[i] = inputChannel[i];
                }
            } else {
                for (let i = 0; i < inputChannel.length; ++i) {
                    if (inputChannel[i] < _loThres[i]) outputChannel[i] = _loThres[i];
                    else if (inputChannel[i] > _hiThres[i]) outputChannel[i] = _hiThres[i];
                    else outputChannel[i] = inputChannel[i];
                }
            }
        }
        return true;
    }
});

registerProcessor('min-signal', class extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: 'min',
            defaultValue: 0
        }];
    }
    constructor() {
        super();
    }
    process(inputs, outputs, parameters) {
        let input = inputs[0],
            output = outputs[0]; // input1 = inputs[1],
        let min = parameters.min;
        let inputChannel = input[0]; // input2Channel = input[2];
        for (let channel = 0; channel < input.length; ++channel) {
            let outputChannel = output[channel];
            for (let i = 0; i < inputChannel.length; ++i) {
                if (inputChannel[i] <= min) outputChannel[i] = inputChannel[i];
                else outputChannel[i] = min;
            }
        }
        return true;
    }
});

registerProcessor('max-signal', class extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: 'max',
            defaultValue: 0
        }];
    }
    constructor() {
        super();
    }
    process(inputs, outputs, parameters) {
        let input = inputs[0],
            output = outputs[0]; // input1 = inputs[1],
        let max = parameters.max;
        let inputChannel = input[0]; // input2Channel = input[2];
        for (let channel = 0; channel < input.length; ++channel) {
            let outputChannel = output[channel];
            for (let i = 0; i < inputChannel.length; ++i) {
                if (inputChannel[i] >= max) outputChannel[i] = inputChannel[i];
                else outputChannel[i] = max;
            }
        }
        return true;
    }
});

registerProcessor('invert-processor', class extends AudioWorkletProcessor {
    constructor() {
        super();
    }
    process(inputs, outputs) {
        let input = inputs[0],
            output = outputs[0];
        for (let channel = 0; channel < input.length; ++channel) {
            let inputChannel = input[channel],
                outputChannel = output[channel];
            for (let i = 0; i < inputChannel.length; ++i) outputChannel[i] = 1 / inputChannel[i];
        }
        return true;
    }
});

registerProcessor('sample-and-hold', class extends AudioWorkletProcessor {
    constructor() {
        super();
        this.prevHold = 0, this.prevOut = 0;
    }
    process(inputs, outputs) {
        let input = inputs[0],
            output = outputs[0];
        let inputChannel = input[0],
            triggerChannel = input[1];
        for (let channel = 0; channel < 1; ++channel) {
            let outputChannel = output[channel];
            // test against last frame
            if (triggerChannel[0] < this.prevHold) outputChannel[0] = inputChannel[0]; // y[0] = x[0] if t[0] < previous frame t[i]
            else if (triggerChannel[0] >= this.prevHold) {
                outputChannel[0] = this.prevOut; // y[0] = previous frame y[i] if t[0] >= previous frame t[i]
            }
            for (let i = 1; i < inputChannel.length; ++i) {
                if (triggerChannel[i] < triggerChannel[i - 1]) {
                    outputChannel[i] = inputChannel[i]; // y[n] = x[n] if t[n] < t[n-1]
                    this.prevOut = outputChannel[i];
                    this.prevHold = triggerChannel[i];
                } else if (triggerChannel[i] >= triggerChannel[i - 1]) {
                    outputChannel[i] = outputChannel[i - 1]; // y[n] = y[n-1] if t[n] >= t[n-1]
                    this.prevOut = outputChannel[i];
                    this.prevHold = triggerChannel[i];
                }
            }
        }
        return true;
    }
});

// One pole IIR low pass filter with approximate cutoff frequency
registerProcessor('single-pole-lpf', class extends AudioWorkletProcessor {
    static get parameterDescriptors() {
        return [{
            name: 'frequency',
            defaultValue: 100,
            minValue: 0
        }];
    }
    constructor() {
        super();
        this.lastOut = 0, this.coeff;
        this.updateCoefficientsWithFrequency_(100);
    }
    updateCoefficientsWithFrequency_(frequency) {
        // loose approximation of the actual coefficient
        this.coeff = 2 * Math.PI * frequency / sampleRate;
        if (this.coeff > 1.0) this.coeff = 1.0;
        else if (this.coeff < 0) this.coeff = 0;
    }
    process(inputs, outputs, parameters) {
        let input = inputs[0],
            output = outputs[0];
        let frequency = parameters.frequency;
        for (let channel = 0; channel < input.length; ++channel) {
            let inputChannel = input[channel],
                outputChannel = output[channel];
            if (frequency.length === 1) {
                this.updateCoefficientsWithFrequency_(frequency[0]);
                for (let i = 0; i < outputChannel.length; ++i) {
                    outputChannel[i] = inputChannel[i] * this.coeff + (1 - this.coeff) * this.lastOut;
                    this.lastOut = outputChannel[i];
                }
            } else {
                for (let i = 0; i < outputChannel.length; ++i) {
                    this.updateCoefficientsWithFrequency_(frequency[i]);
                    outputChannel[i] = inputChannel[i] * this.coeff + (1 - this.coeff) * this.lastOut;
                    this.lastOut = outputChannel[i];
                }
            }
        }
        return true;
    }
});
