/* eslint-disable no-console */
var StateMachine = require('javascript-state-machine')
var cube = require("./cube.js")
var tonal = require("tonal")
const extractNumbers = require("extract-numbers")
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


// polymorphic function called by the microphone and set to be different functions depending on state

function arrayValueSwap(array) {
    return Object.fromEntries(Object.entries(array).map(([k, v]) => ([v, k])))
}


// array that houses the current set of notes we're listening for in a given scale, given a certain cube state
// starting in the front view, D
let noteString = "D4"
var currentScaleArray = tonal.Scale.notes(noteString, "major")
var shouldTakeNewNotes = true

function turnCubeConsumer(note) {
    const octUp = 7

    switch (parseInt(currentScaleArray[note])) { // swapping key vals turns the ints into strings so turn them back
        case 0: // note 1 of scale
            console.log("switch case is working " + cube.move("F"))
            break
        case 2:
            cube.move("U")
            break
        case 3:
            cube.move("R")
            break
        case 4:
            cube.move("D")
            break
        case 6:
            cube.move("L")
            break
        case 1: // I don't actually use B ever so I'm sticking it onto a more dissonant note-ish
            cube.move("B")
            break
        case 5: // takes you into change cube perspective mode, 6th note of the scale
            fsm.sixlow()
            break

            // second octave of scale
        case 0 + octUp:
            cube.move("F'")
            break
        case 2 + octUp:
            cube.move("U'")
            break
        case 3 + octUp:
            cube.move("R'")
            break
        case 4 + octUp:
            cube.move("D'")
            break
        case 6 + octUp:
            cube.move("L'")
            break
        case 1 + octUp:
            cube.move("B'")
            break
        case 5 + octUp: // read off front face then return to this operation mode
            fsm.sixHigh()
            break
        default:
            console.log("rejected")
            break
    }
    console.log(cube.asString())
}



function concatenatedTwoOctaves(inputNote) {
    var octaveRaisedByOneAsString = (parseInt(extractNumbers(inputNote)) + 1).toString()
    var nStringWithoutNumber = inputNote.split("").filter(s => !Number.isInteger(parseInt(s))).join("")
    var scaleOne = tonal.Scale.notes(inputNote, "major")
    var scaleTwo = tonal.Scale.notes(nStringWithoutNumber + octaveRaisedByOneAsString, "major")
    return scaleOne.concat(scaleTwo)
}

function processInitialNote(note) {
    //takes an initial note--the cube will be two octaves of a major pentatonic scale above this
    noteString = note
    currentScaleArray = arrayValueSwap(concatenatedTwoOctaves(noteString))
    // TODO: pause and play this scale. ux ideas, make this only state change if that same note is played again
    console.log("currentScale is now: " + currentScaleArray)
    console.log(currentScaleArray)
    fsm.setupDone()
}

function changePerspectiveConsumer(note) {

    switch (parseInt(currentScaleArray[note])) { // swapping key vals turns the ints into strings so turn them back
        case 0: // note 1 of scale
            console.log("performing an X rot (rotate whole cube on R) " + cube.move("X"))
            console.log("front face is now " + faceNames[cube.rotCube.frontFace])
            fsm.returnsl()
            break
        case 2:
            // rotate the entire cube on U
            cube.move("Y")
            fsm.returnsl()
            break
        case 3:
            // rotate the entire cube on F
            cube.move("Z")
            fsm.returnsl()
            break
        case 4:
            cube.move("X'")
            fsm.returnsl()
            break
        case 6:
            // rotate counterclockwise on U
            cube.move("Y'")
            fsm.returnsl()

            break
        case 1: // I don't actually use B ever so I'm sticking it onto a more dissonant note-ish
            cube.move("Z'")
            fsm.returnsl()
            break
            // second octave of scale
        default:
            console.log("unregistered move")
            break
    }
}

var consumeNote = turnCubeConsumer

var fsm = new StateMachine({
    init: 'scaleSetup',
    transitions: [{
            name: 'setupDone',
            from: 'scaleSetup',
            to: 'turncube'
        },
        {
            name: 'sixlow',
            from: 'turncube',
            to: 'changePerspective'
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
            from: 'changePerspective',
            to: 'turncube'
        }
    ],
    methods: {
        onScaleSetup: function () {
            console.log("in scale setup")
            consumeNote = processInitialNote
        },
        onTurncube: function () {
            console.log("turn cube")
            // swap key value pairs from 1:'A' to 'A':1
            // ie A is the indexth note in this scale
            consumeNote = turnCubeConsumer
        },
        onChangePerspective: function () {
            // change perspective
            console.log("change perspective")
            consumeNote = changePerspectiveConsumer
        },
        onSixhigh: function () {
            console.log("In six high")
        },
        onReturnsl: function () {
            // play the face that we're coming to
        }
    }
})
// cube perspective possibly also a state? no just an enum. a set val.
// all of this needs to set up and change only on note events



function openForConsumption(note) {
    if (shouldTakeNewNotes) {
        consumeNote(note)
    }
}



module.exports = {
    openForConsumption
}