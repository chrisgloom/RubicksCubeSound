/* eslint-disable no-console */
const Pitchfinder = require('pitchfinder')
const detectPitch = Pitchfinder.AMDF()
const getUserMedia = require('get-user-media-promise')
const MicrophoneStream = require('microphone-stream')
const soundCube = require('./SoundCube.js')


window.AudioContext = window.AudioContext || window.webkitAudioContext


navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
if (!navigator.getUserMedia) {
  console.error('Your browser does not support getUserMedia')
}

getUserMedia({
  video: false,
  audio: true
})
  .then(
    function (stream) {

    var micStream = new MicrophoneStream(stream, {objectMode: true})

    micStream.on('data', function (chunk) {
      const audioBuffer = chunk
      const float32Array = audioBuffer.getChannelData(0) // get a single channel of sound
      const pitch = detectPitch(float32Array) // null if pitch cannot be identified

      // console.log(pitch)
      soundCube.getNote(pitch)
    })
  })
