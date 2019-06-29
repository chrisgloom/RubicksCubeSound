/* eslint-disable no-console */
  const note = require ('tonal-freq').note
  
  
    // Holds single pitch data to be averaged
    let rawPitchArray = []

    // initialize our boolean
    let inNote = false

    function debounce(func, wait, immediate) {
      var timeout;
    
      return function executedFunction() {
        var context = this;
        var args = arguments;
            
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
    
        var callNow = immediate && !timeout;
        
        clearTimeout(timeout);
    
        timeout = setTimeout(later, wait);
        
        if (callNow){
          return func.apply(context, args);
        } 
        
      };
    }
    /*
    nullsSinceLastPitch is an attempt to facilitate junk pitch dumping when the
    pitches detected aren't actually long enough to have been a valid note and
    shouldn't be taken into account when the next note actually does arrive
*/
  // Should be set to zero when a pitch is hit and otherwise tracks nulls since last pitch
  let nullsSinceLastPitch = 0
  
   function noteReturn () {
    // Sum the pitches and pop them, return a pitch
  
    var runningSum = 0
    var arrayLength = rawPitchArray.length
    if (arrayLength<=4){
      // dumps too short sections of pitch data
      rawPitchArray = []
      // console.log("array length too short")
      return null
    }
    while (rawPitchArray.length) {
      var setOfPitches = rawPitchArray.pop()
      runningSum += setOfPitches
    }
    // Then process the averaged pitch and find its note value
    var averagePitch = runningSum / arrayLength
    
    // console.log(note(averagePitch))
    // TODO: insert a callback here

    return note(averagePitch)
}
  let debouncedNoteReturn = debounce(noteReturn,500, true)
  
  function pitchStateManagement(pitch){
    if (pitch == null) {
        nullsSinceLastPitch += 1
        
    }
    if (nullsSinceLastPitch === 5) {
        rawPitchArray = []
    }
    if ((pitch == null) && inNote) {
        inNote = false
        // Debounced return function
        let returnedNote = debouncedNoteReturn()
        // console.log(returnedNote)
        return returnedNote
        
    } else if (!(pitch == null) && !inNote) {
        // We're starting a new note
        rawPitchArray.push(pitch)
        inNote = true
        nullsSinceLastPitch = 0
        return null
    } else if (!(pitch == null) && inNote) {
        rawPitchArray.push(pitch)
        return null
    }
  }



module.exports = {
  getNote: pitchStateManagement
}







