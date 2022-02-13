# Advances in Thunder Sound Synthesis

This code accompanies the published paper _Advances in Thunder Synthesis_ presented at the 152nd AES Convetion. The recording of the talk can be found [here](https://evalyn.co) and the complete model is published as a web application found at [Nemisindo](https://nemisindo.com/).

## Abstract
A recent comparative study evaluated all known thunder synthesis techniques in terms of their perceptual realness. The findings emphasised the complexity of the models and concluded that none of the synthesised audio extracts seemed as realistic as the genuine phenomenon. The work presented herein is motivated by those findings, and attempts to create a synthesised sound effect of thunder indistinguishable from a recording of the real event. The technique expands on an existing implementation and supplements physics-inspired, signal-based design elements in an attempt to enhance the realistic perception of the sound effect. In a listening test conducted with over 50 participants, this new implementation was perceived as more realistic than the most realistic model evaluated by the prior survey, though it is still distinguishable from a real recording. Further improvements to the model, based on insights from the listening test, were also implemented and described herein.

## Dependencies

* Node >= v14.9.0
* Web Audio API

## Running
 
```
$ cd <this project folder>
$ http-server -o
```
* Navigate browser to http://127.0.0.1:8080/

## Authors

Eva Fineberg
Jack Walters
Joshua Reiss

