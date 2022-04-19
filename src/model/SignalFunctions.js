// Signal functions used for interacting oscillators

// Model available at https://nemisindo.com/models/thunder.html

function addSignals(inputA, inputB, context) {
  this.context = context ||  plugin.context;
  this.addGain = this.context.createGain();
  inputA.connect(this.addGain);
  inputB.connect(this.addGain);
  this.connect = function(destination) { this.addGain.connect(destination); };
  this.disconnect = function(destination) { this.addGain.disconnect(destination); };
};
function multiplySignals(inputA, inputB, context) {
  this.context = context;
  this.multGain = new GainNode(this.context,{gain:0});
  inputA.connect(this.multGain);
  inputB.connect(this.multGain.gain);
  this.connect = function(destination) { this.multGain.connect(destination); };
  this.disconnect = function(destination) { this.multGain.disconnect(destination); };
};
function addSigVal(inputA, val, context) {
  this.context = context;
  this.val = val;
  this.addGain = this.context.createGain();
  this.csNode = new ConstantSourceNode(this.context,{offset:this.val});
  this.csNode.start();
  inputA.connect(this.addGain);
  this.csNode.connect(this.addGain);
  this.connect = function(destination) { this.addGain.connect(destination); };
  this.disconnect = function(destination) { this.addGain.disconnect(destination); };
  this.updateOffsetValue = function(value) { this.csNode.offset.value = value; };
};
function multiplySigVal(inputA, val, context) {
  this.context = context;
  this.val = val;
  this.multGain = new GainNode(this.context,{gain:0});
  this.csNode = new ConstantSourceNode(this.context,{offset:this.val});
  this.csNode.start();
  inputA.connect(this.multGain);
  this.csNode.connect(this.multGain.gain);
  this.connect = function(destination) { this.multGain.connect(destination); };
  this.disconnect = function(destination) { this.multGain.disconnect(destination); };
  this.updateOffsetValue = function(value) { this.csNode.offset.value = value; } //FOR MAMMALS
};
function subtractSigVal(inputA, val, context) { //subtract signal from value val-A
  this.context = context;
  this.val = val;
  this.invertGain = new GainNode(this.context,{gain: -1});
  this.subtractGain = this.context.createGain();
  this.csNode = new ConstantSourceNode(this.context,{offset:this.val});
  this.csNode.start();
  inputA.connect(this.invertGain);//!! A -> -A
  this.invertGain.connect(this.subtractGain);// -A -> -A
  this.csNode.connect(this.subtractGain);//!! -A -> val-A
  this.connect = function(destination) { this.subtractGain.connect(destination); };
  this.disconnect = function(destination) { this.subtractGain.disconnect(destination); };
};
