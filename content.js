/* eslint-disable no-console */
const Pitchfinder = require('pitchfinder')
const detectPitch = Pitchfinder.AMDF()
const getUserMedia = require('get-user-media-promise')
const MicrophoneStream = require('microphone-stream')
const noteState = require('./NoteState.js')
const cubeState = require("./CubeState.js")


window.AudioContext = window.AudioContext || window.webkitAudioContext


navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
if (!navigator.getUserMedia) {
  console.error('Your browser does not support getUserMedia')
}


var returnedNote;

getUserMedia({
    video: false,
    audio: true
  })
  .then(
    function (stream) {

      var micStream = new MicrophoneStream(stream, {
        objectMode: true
      })

      micStream.on('data', function (chunk) {
        const audioBuffer = chunk
        const float32Array = audioBuffer.getChannelData(0) // get a single channel of sound
        const pitch = detectPitch(float32Array) // null if pitch cannot be identified
        returnedNote = noteState.getNote(pitch)

        if (returnedNote) { // ie if the note isn't null or undefined
          cubeState.consumeNote(returnedNote)
        }

      })
    })