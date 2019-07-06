# RubicksCubeSound
Work in progress web app that will allow you to manipulate a rubick's cube purely by musical pitch


#Notes
These are just notes to myself at the moment when I make design decisions and decide to use certain libraries


`$ webpack ./entry.js bundle.js`
https://webpack.github.io/docs/tutorials/getting-started/


### tonal useful ideas
```
> tonal.Scale.notes("C6 major pentatonic")
[ 'C6', 'D6', 'E6', 'G6', 'A6' ]
> tonal.Scale.notes("C6 major pentatonic")[0]
'C6'
>tonal.Scale.notes("C6 major pentatonic").includes("C6")
true
> tonal.Scale.notes("C6 major pentatonic").includes("C7")
false
> tonal.Scale.notes("C6 major pentatonic").includes("C#6")
false
> tonal.Scale.notes("C6 major pentatonic").includes("D6")
true

> tonal.Scale.notes("C6 major").concat(tonal.Scale.notes("C7 major"))
[
  'C6', 'D6', 'E6',
  'F6', 'G6', 'A6',
  'B6', 'C7', 'D7',
  'E7', 'F7', 'G7',
  'A7', 'B7'
]
```



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
