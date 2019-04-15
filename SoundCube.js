import {
    note
  } from 'tonal-freq'
  
  
  const Pitchfinder = require('pitchfinder')
  const RubiksCube = require('cubejs')
  
  let SoundCube = (function(){

    // Holds single pitch data to be averaged
    var rawPitchArray = []

    // initialize our boolean
    var inNote = false

    // instantiate a random cube
    let cube = RubiksCube.random()

    /*
     nullsSinceLastPitch is an attempt to facilitate junk pitch dumping when the
     pitches detected aren't actually long enough to have been a valid note and
     shouldn't be taken into account when the next note actually does arrive
  */
  
     // Should be set to zero when a pitch is hit and otherwise tracks nulls since last pitch
  var nullsSinceLastPitch = 0
  
  let noteReturn = function (pitchArray) {
    // Sum the pitches and pop them, return a pitch
  
    var runningSum = 0
    var arrayLength = pitchArray.length
    if (arrayLength<=4){
      // dumps too short sections of pitch data
      pitchArray = []
      return
    }
    while (pitchArray.length) {
      var setOfPitches = pitchArray.pop()
      runningSum += setOfPitches
    }
    // Then process the averaged pitch and find its note value
    var averagePitch = runningSum / arrayLength
    
    return note(averagePitch)
}

    // Debounce function to prevent trailing note recognition
    // Returns a function that can't be called quickly in succession
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
  
  function pitchStateManagement(){
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
  }

  return {
    noteReturn: debouncedNoteReturn

  }
  })();







