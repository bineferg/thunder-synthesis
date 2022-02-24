# Advances in Thunder Sound Synthesis

This is the official repository accompanying the paper _Advances in Thunder Sound Synthesis_, submitted to the 152nd AES Convention. The complete model is published as a web application found at [Nemisindo](https://nemisindo.com/models/thunder.html?preset=Medium%20Strikes).

## Abstract
A recent comparative study evaluated all known thunder synthesis techniques in terms of their perceptual realness. The findings emphasised the complexity of the models and concluded that none of the synthesised audio extracts seemed as realistic as the genuine phenomenon. The work presented herein is motivated by those findings, and attempts to create a synthesised sound effect of thunder indistinguishable from a recording of the real event. The technique expands on an existing implementation and supplements physics-inspired, signal-based design elements in an attempt to enhance the realistic perception of the sound effect. In a listening test conducted with over 50 participants, this new implementation was perceived as more realistic than the most realistic model evaluated by the prior survey, though it is still distinguishable from a real recording. Further improvements to the model, based on insights from the listening test, were also implemented and described herein.

## Running the model
If you have the npm package [http-server](https://www.npmjs.com/package/http-server) installed globally on your machine, simply run
```
$ http-server -o -p 8080
```
 
Otherwise, you need to first install the npm project dependencies
```
$ npm install
```
then use this command to deploy the model
```
$ npm run model
```
Navigate browser to http://127.0.0.1:8080/ if either of the instructions above do not open a webpage. Run this model on Chrome for best performance.

## Authors

Eva Fineberg,  
Jack Walters,  
Joshua Reiss

