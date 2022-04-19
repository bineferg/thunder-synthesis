/*
 * Main file, inspired from https://nemisindo.com/models/thunder.html
 * Sets up audio context, configures constants and triggers for the synthesis
 * Also handles recordings
 */



// Audio context init and strike listener
var context= new AudioContext({sampleRate: 44100});

// Speed of sound
const soundSpeed = 343;

// Record audio fixtures
var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
recordButton.addEventListener("click", startRec); 
stopButton.addEventListener("click", stopRec);

// Audio out and recording wirings 
var gainOut = new GainNode(context, {gain:1});
var recOut = new GainNode(context, {gain:1});
var recording = new Recorder(recOut);

var convolver = context.createConvolver();


context.audioWorklet.addModule('src/model/Processors.js').then(() => {

    // explode.onclick = function() {
    //   // Create an audio listener
    //   createListener();
    //   context.resume();

    //   // Multi-strike generation
    //   var lightningOut1 = multistrikes(5);
    //   //var lightningOut2 = multistrikes(4);
    //   //lightningOut2.connect(gainOut);
    //   //lightningOut1.connect(gainOut);

    //   // Roll generation
    //   var deepOut = createDeepener();
    //   deepOut.connect(gainOut);

    //   // Rumble generation
    //   var rumbleOut = createRumbler();
    //   rumbleOut.connect(lightningOut1);

    //   // Afterimage
    //   var afterImageOut = createAfterImages();
    //   afterImageOut.connect(lightningOut1);

    //   // Apply reverb
    //   var revOut = createReverb(lightningOut1);
    //   gainOut.connect(revOut);
      
    //   // Attenuate frequencies
    //   var lpfOut = addLPF(revOut);

    //   //var compOut = createCompressor(lpfOut);
      
    //   lpfOut.connect(recOut);

    //   recOut.connect(context.destination);
    // }
    explode.onclick = function () {
        // Multi-strike generation
        var lightningOut1 = multistrikes(5);
        //var lightningOut2 = multistrikes(4);
        //lightningOut2.connect(gainOut);
        //lightningOut1.connect(gainOut);

        // Roll generation
        var deepOut = createDeepener();
        deepOut.connect(recOut);

        // Rumble generation
        var rumbleOut = createRumbler();
        rumbleOut.connect(recOut);

        // Afterimage
        var afterImageOut = createAfterImages();
        var afterImageOutGainOut = new GainNode(context, { gain: 0.4 });
        afterImageOut.connect(afterImageOutGainOut);
        afterImageOutGainOut.connect(recOut);

        // Apply reverb
        var revOut = createReverb(lightningOut1);

        // Attenuate frequencies
        var lpfOut = addLPF(revOut);

        //var compOut = createCompressor(lpfOut);

        lpfOut.connect(recOut);

        recOut.connect(context.destination);
    }
}); //End audio worklet



// Generate the rumble based on input from the UI
// Dependent on rumble value and the distance
function createRumbler(){
  var distanceDelay = distanceSlider.value/soundSpeed;
  var rumbleNoise1 = new AudioWorkletNode(context, 'white-noise-generator');
  var rumbleNoise2 = new AudioWorkletNode(context, 'white-noise-generator');
  var rumbleOut = new GainNode(context, {gain:0.5});
  if(rumbleSlider.value != 0) {
    let rumbler = new Rumbler(rumbleSlider.value);
    rumbler.rumble(distanceDelay);
    return rumbler.connectAudio(rumbleNoise1, rumbleNoise2, distanceDelay, rumbleOut);
  }
  return rumbleOut;

}

function createCompressor(audioIn) {
  var comp = new Compressor();
  var compOut = new GainNode(context, {gain:1});
  comp.connectAudio(audioIn, compOut);
  return compOut;
}

// Signal multiplied afterimage
// attenuates as a function of distance and time
function createAfterImages(){
  var distanceDelay = distanceSlider.value/soundSpeed;
  var afterNoise1 = new AudioWorkletNode(context, 'white-noise-generator');
  var afterNoise2 = new AudioWorkletNode(context, 'white-noise-generator');
  var afterOut = new GainNode(context, {gain:1});
  if(strikeSlider.value != 0) {
    let afterImage = new AfterImage();
    afterImage.capture(strikeSlider.value, distanceDelay);
    return feedAfterOut = afterImage.connectAudio(afterNoise1, afterNoise2, distanceDelay, afterOut,rumbleSlider.value);

  }
  return afterOut;

}

// Position listener for the HRTF Spatialisation
function createListener(){
  var randWidth = (Math.floor(Math.random() * window.innerWidth) + 100) / 2;
  var randHeight = (Math.floor(Math.random() * window.innerHeight) + 100) / 2;
  var listener = new Listener(randWidth, randHeight, 300);
  listener.position();
}

// Deepen the roll with growl value as a function of distance
function createDeepener(){
  var deepNoise = new AudioWorkletNode(context, 'white-noise-generator');
  var deepOut = new GainNode(context, {gain:1});
  var distanceDelay = distanceSlider.value/soundSpeed;
  if(growlSlider.value != 0) {
    let deepener = new Deepen();
    deepener.apply(growlSlider.value, distanceDelay);
    deepener.connectAudio(deepNoise, distanceDelay, deepOut);
  }
  return deepOut;
}

// Shape the whole output signal to attenuate frequency over time
function addLPF(audioIn){
  var lpfOut = new GainNode(context, {gain: 0.5});
  let fullLpf = new LPFTime();
  fullLpf.capture((distanceSlider.value/343), 14000, 0.01);
  fullLpf.connectAudio(audioIn, lpfOut);
  return lpfOut;
}


function startRec(){
  recording.record();
}
function stopRec(){
  recording.stop();
  recording.exportWAV((blob) => {audio.src = URL.createObjectURL(blob)});
}


// Add reverb with an impulse response taken from
// EchoThiefImpulseLibrary
function createReverb(audioIn){
  var revOut = new GainNode(context, {gain:1});
  if (document.getElementById('ReverbCheck').checked) {
    loadImpulse().then(function(){
      audioIn.connect(convolver);
      convolver.connect(revOut);
    });
  } else {
      return audioIn;
  }  
  return revOut;
}

async function loadImpulse() {
  // load impulse response from file
  let response     = await fetch("src/util/irs/Nature/DivorceBeach.wav");
  let arraybuffer  = await response.arrayBuffer();
  convolver.buffer = await context.decodeAudioData(arraybuffer);
}


// Generate multiple of ths single strike patterns from Nemisindo
// https://nemisindo.com/models/thunder.html
function multistrikes(maxStrikes) {
  // Pre-Crackle
  let crackle = new Crackle(20);
  // Lightning strike
  var lightningOut = new GainNode(context,{gain:5});
  var retOut = new GainNode(context,{gain:1});

  // Account for distnace
  var distanceDelay = distanceSlider.value/soundSpeed;

  // ** NOTE: strikeSlider.value is accounted for in Lightning.js ** // 

  // MultiStrike
  var multistrikes = Math.floor(Math.random() * maxStrikes);
  console.log(multistrikes, " strikes with max strikes: ", maxStrikes +1 );
  for(var i=0; i<multistrikes+1; i++){
    var ll = new Lightning();
    var locStrikeNoise = new AudioWorkletNode(context, 'white-noise-generator');
    var locCrackNoise = crackle.crackle((Math.abs(Math.random()-0.75)) + distanceDelay);
    ll.strike();
    var locOut;
    if(i%2 ==0){
      locOut =ll.connectAudio(locCrackNoise, (Math.abs(Math.random()-0.75))+distanceDelay, lightningOut);
    } else {
      locOut =ll.connectAudio(locStrikeNoise, (Math.abs(Math.random()-0.75))+distanceDelay, lightningOut);
    }
    locOut.connect(retOut);
  }
  return retOut;

} 


  