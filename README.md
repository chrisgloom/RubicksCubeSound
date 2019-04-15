# RubicksCubeSound
Work in progress web app that will allow you to manipulate a rubick's cube purely by musical pitch



`$ webpack ./entry.js bundle.js`
https://webpack.github.io/docs/tutorials/getting-started/



# Old Code from project
```
var inNote = false

var noteLogging = function (pitch, _inNote) {
  // console.log('in the function')
  if ((pitch == null) && !_inNote) {
    // We're just in a block of nulls
    return false
  } else if (!(pitch == null) && _inNote) {
    // We're in a note
    rawPitchArray.push(pitch)
  } else if ((pitch == null) && _inNote) {
    // Coming out of a series of notes
    // take all the values from rawPitchArray and average them
    // console.log(rawPitchArray);

    var runningSum = 0
    var arrayLength = rawPitchArray.length
    while (rawPitchArray.length) {
      var setOfPitches = rawPitchArray.pop()
      runningSum += setOfPitches
      // console.log('here\'s a pitch'+setOfPitches);
      // console.log('runningSum is currently' + runningSum);
    }
    // Then process the averaged pitch and add it to pitches
    var averagePitch = runningSum / arrayLength
    // console.log('runningSum is '+runningSum);
    // console.log('arrayLength is '+arrayLength);
    // console.log('averagePitch is '+averagePitch);
    console.log(note(averagePitch))
    inNote = false
  } else if (!(pitch == null) && !_inNote) {
    // Coming into a note from null
    // console.log("Do we hit this");
    inNote = true
    rawPitchArray.push(pitch)
  }
}
```
