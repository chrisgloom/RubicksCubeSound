var StateMachine = require('javascript-state-machine')
var cube = require("./cube.js")
var tonal = require("tonal")
cube = cube.random()
// import cube from 'coffee-loader!./cube.coffee';

// So I don't have to keep staring at 0's and trying to remember which side that is
const faceNames = {
    0: 'U',
    1: 'R',
    2: 'F',
    3: 'D',
    4: 'L',
    5: 'B'
};

// array that houses the current set of notes we're listening for in a given scale, given a certain cube state
// starting in the front view, D
let noteString = "D4"
var currentScaleArray
// polymorphic function called by the microphone and set to be different functions depending on state




/* TODO:
    figure out some way to handle not consuming notes during periods of playback. Maybe purposefully flushing the notestate object after playback to be sure
    test statemachine with correct caps and stuff so that the transitions actually fire
*/

var fsm = new StateMachine({
    init: 'turncube',
    transitions: [{
            name: 'sixLow',
            from: 'turncube',
            to: 'changeperspective'
        },
        {
            name: 'sixhigh',
            from: 'turncube',
            to: 'readface'
        },
        {
            name: 'returnsh',
            from: 'readface',
            to: 'turncube'
        },
        {
            name: 'returnsl',
            from: 'changeperspective',
            to: 'turncube'
        }
    ],
    methods: {
        onTurncube: function () {
            console.log("turn cube")
            let tempArray = tonal.Scale.notes(noteString + "major")
            // swap key value pairs from 1:'A' to 'A':1
            // ie A is the indexth note in this scale
            currentScaleArray => Object.fromEntries(Object.entries(tempArray).map(([k, v]) => ([v, k])))
            consumeNote = turnCubeConsumer
        },
        onSixlow: function () {
            console.log("In six low")
        },
        onSixhigh: function () {
            console.log("In six high")
        }
    }
});
// cube perspective possibly also a state? no just an enum. a set val.
// all of this needs to set up and change only on note events

function turnCubeConsumer(note) {
    const octUp = 7

    switch (currentScaleArray[note]) {
        case 0: // note 1 of scale, F
            cube.moves("F")
            break
        case 2:
            cube.moves("U")
            break
        case 3:
            cube.moves("R")
            break
        case 4:
            cube.moves("D")
            break
        case 6:
            cube.moves("L")
            break
        case 1: // I don't actually use B ever so I'm sticking it onto a more dissonant note-ish
            cube.moves("B")
            break
        case 5: // takes you into change cube perspective mode, 6th note of the scale
            fsm.sixLow()
            break

            // second octave of scale
        case 0 + octUp:
            cube.moves("F'")
            break
        case 2 + octUp:
            cube.moves("U'")
            break
        case 3 + octUp:
            cube.moves("R'")
            break
        case 4 + octUp:
            cube.moves("D'")
            break
        case 6 + octUp:
            cube.moves("L'")
            break
        case 1 + octUp:
            cube.moves("B'")
            break
        case 5 + octUp: // read off front face then return to this operation mode
            fsm.sixHigh()
            break

    }
}
var consumeNote = turnCubeConsumer


module.exports = {
    consumeNote,
    fsm,
    currentScaleArray
}