var StateMachine = require('javascript-state-machine')
var cube = require("./cube.js")
var tonal = require("tonal")
cube = new cube()
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
let currentScaleArray

// polymorphic function called by the microphone and set to be different functions depending on state
let stateDependentNoteConsumption

/* TODO:
    figure out some way to handle not consuming notes during periods of playback. Maybe purposefully flushing the notestate object after playback to be sure
*/

var fsm = new StateMachine({
    init: 'TurnCube',
    transitions: [{
            name: 'SixLow',
            from: 'TurnCube',
            to: 'ChangePerspective'
        },
        {
            name: 'SixHigh',
            from: 'TurnCube',
            to: 'ReadFace'
        },
    ],
    methods: {
        onTurnCube: function () {
            let tempArray = tonal.Scale.notes(noteString + "major")
            // swap key value pairs from 1:'A' to 'A':1
            // ie A is the indexth note in this scale
            currentScaleArray => Object.fromEntries(Object.entries(tempArray).map(([k, v]) => ([v, k])))
        },
        onSixLow: function () {
            console.log('I melted')
        },
        onSixHigh: function () {
            console.log('I froze')
        },
    }
});
// cube perspective possibly also a state? no just an enum. a set val.
// all of this needs to set up and change only on note events

function turnCubeConsumer(note) {

    // some switch statement or something 
    /*
    note 1 — F
    note 2 — U
    ... etc
    */
}









function consumeNote(note) {
    stateDependentNoteConsumption(note)

}

module.exports = {
    consumeNote
}