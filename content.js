import {
  note
} from 'tonal-freq'


const Pitchfinder = require('pitchfinder')
const detectPitch = Pitchfinder.AMDF()
const getUserMedia = require('get-user-media-promise')
const MicrophoneStream = require('microphone-stream')
const RubiksCube = require('cubejs')


window.AudioContext = window.AudioContext || window.webkitAudioContext

// Holds single pitch data to be averaged
var rawPitchArray = []

// instantiate a random cube
let cube = Cube.random()

//
var inNote = false

/*
   nullsSinceLastPitch is an attempt to facilitate junk pitch dumping when the
   pitches detected aren't actually long enough to have been a valid note and
   shouldn't be taken into account when the next note actually does arrive
*/

   // Should be set to zero when a pitch is hit and otherwise tracks nulls since last pitch
var nullsSinceLastPitch = 0

let noteReturn = function () {
  // Sum the pitches and pop them, return a pitch

  var runningSum = 0
  var arrayLength = rawPitchArray.length
  if (arrayLength<=4){
    // dumps too short sections of pitch data
    rawPitchArray = []
    return
  }
  while (rawPitchArray.length) {
    var setOfPitches = rawPitchArray.pop()
    runningSum += setOfPitches
  }
  // Then process the averaged pitch and find its note value
  var averagePitch = runningSum / arrayLength

  console.log(note(averagePitch))
}


// Debounce function to prevent trailing note recognition
function debounce (func, wait, immediate) {
  var timeout
  return function () {
    var context = this
    var args = arguments
    var later = function () {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    var callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(context, args)
  }
}

const debouncedNoteReturn = debounce(noteReturn, 500, true)

navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)
if (!navigator.getUserMedia) {
  console.error('Your browser does not support getUserMedia')
}

getUserMedia({
  video: false,
  audio: true
})
  .then(function (stream) {
    var micStream = new MicrophoneStream(stream, {
      objectMode: true
    })
    micStream.on('data', function (chunk) {
      const audioBufferMaybe = chunk
      const float32Array = audioBufferMaybe.getChannelData(0) // get a single channel of sound
      const pitch = detectPitch(float32Array) // null if pitch cannot be identified

      console.log(pitch)
      if (pitch == null) {
        nullsSinceLastPitch += 1
      }
      if (nullsSinceLastPitch === 5) {
        rawPitchArray = []
      }
      if ((pitch == null) && inNote) {
        // Debounced return function
        debouncedNoteReturn()

        inNote = false
      } else if (!(pitch == null) && !inNote) {
        // We're starting a new note
        rawPitchArray.push(pitch)
        inNote = true
        nullsSinceLastPitch = 0
      } else if (!(pitch == null) && inNote) {
        rawPitchArray.push(pitch)
      }
    })
  })
