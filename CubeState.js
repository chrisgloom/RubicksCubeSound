var StateMachine = require('javascript-state-machine')
// var cube = require("cubejs")
import cube from 'coffee-loader!./cube.coffee';


var fsm = new StateMachine({
    init: 'solid',
    transitions: [
      { name: 'SixLow',     from: 'TurnCube',  to: 'ChangePerspective' },
      { name: 'SixHigh', from: 'TurnCube', to: 'ReadFace'              },
    ],
    methods: {
      onSixLow:     function() { console.log('I melted')    },
      onSixHigh:   function() { console.log('I froze')     },
    }
  });
// cube perspective possibly also a state? no just an enum. a set val.
// all of this needs to set up and change only on note events

function updateNote(note){

}