# Advances in Thunder Sound Synthesis

This is the official repository accompanying the paper [Advances in Thunder Sound Synthesis](https://arxiv.org/abs/2204.08026), accepted to the [152nd AES Convention](https://aeseurope.com/). The complete model is published as a web application found at [Nemisindo](https://nemisindo.com/models/thunder.html).

## Abstract
A recent comparative study evaluated all known thunder synthesis techniques in terms of their perceptual realness. The findings concluded that none of the synthesised audio extracts seemed as realistic as the genuine phenomenon. The work presented herein is motivated by those findings, and attempts to create a synthesised sound effect of thunder indistinguishable from a real recording. The technique supplements an existing implementation with physics-inspired, signal-based design elements intended to simulate environmental occurrences. In a listening test conducted with over 50 participants, this new implementation was perceived as the most realistic synthesised sound, though still distinguishable from a real recording. Further improvements to the model, based on insights from the listening test, were also implemented and described herein.

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

