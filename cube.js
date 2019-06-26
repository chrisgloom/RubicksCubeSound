/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * DS208: Avoid top-level this
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
// Corners
const [URF, UFL, ULB, UBR, DFR, DLF, DBL, DRB] = Array.from([0, 1, 2, 3, 4, 5, 6, 7]);

// Edges
const [UR, UF, UL, UB, DR, DF, DL, DB, FR, FL, BL, BR] = Array.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

const [cornerFacelet, edgeFacelet] = Array.from((function() {
  const U = x => x - 1;
  const R = x => U(9) + x;
  const F = x => R(9) + x;
  const D = x => F(9) + x;
  const L = x => D(9) + x;
  const B = x => L(9) + x;
  return [
    // Corners
    [
      [U(9), R(1), F(3)], [U(7), F(1), L(3)],
      [U(1), L(1), B(3)], [U(3), B(1), R(3)],
      [D(3), F(9), R(7)], [D(1), L(9), F(7)],
      [D(7), B(9), L(7)], [D(9), R(9), B(7)],
    ],
    // Edges
    [
      [U(6), R(2)], [U(8), F(2)], [U(4), L(2)], [U(2), B(2)],
      [D(6), R(8)], [D(2), F(8)], [D(4), L(8)], [D(8), B(8)],
      [F(6), R(4)], [F(4), L(6)], [B(6), L(4)], [B(4), R(6)],
    ],
  ];
})());

const cornerColor = [
  ['U', 'R', 'F'], ['U', 'F', 'L'], ['U', 'L', 'B'], ['U', 'B', 'R'],
  ['D', 'F', 'R'], ['D', 'L', 'F'], ['D', 'B', 'L'], ['D', 'R', 'B'],
];

const edgeColor = [
  ['U', 'R'], ['U', 'F'], ['U', 'L'], ['U', 'B'], ['D', 'R'], ['D', 'F'],
  ['D', 'L'], ['D', 'B'], ['F', 'R'], ['F', 'L'], ['B', 'L'], ['B', 'R'],
];

const faceNums = {
  U: 0,
  R: 1,
  F: 2,
  D: 3,
  L: 4,
  B: 5
};

const faceNames = {
  0: 'U',
  1: 'R',
  2: 'F',
  3: 'D',
  4: 'L',
  5: 'B'
};

class RotationCube {
  constructor() {
    this.frontFace = faceNums.F;
    this.northFace = faceNums.U;
    this.southFace = faceNums.D;
    this.eastFace = faceNums.R;
    this.westFace = faceNums.L;
    this.backFace = faceNums.B;
  }

  z() {
    const pastTopFace = this.northFace;
    this.northFace = this.westFace;
    this.westFace = this.southFace;
    this.southFace = this.eastFace;
    return this.eastFace = pastTopFace;
  }

  zPrime() {
    const pastTopFace = this.northFace;
    this.northFace = this.eastFace;
    this.eastFace = this.southFace;
    this.southFace = this.westFace;
    return this.westFace = pastTopFace;
  }

  y() {
    const pastFrontFace = this.frontFace;
    this.frontFace = this.eastFace;
    this.eastFace = this.backFace;
    this.backFace = this.westFace;
    return this.westFace = pastFrontFace;
  }

  yPrime() {
    const pastFrontFace = this.frontFace;
    this.frontFace = this.westFace;
    this.westFace = this.backFace;
    this.backFace = this.eastFace;
    return this.eastFace = pastFrontFace;
  }

  xPrime() {
    const pastFrontFace = this.frontFace;
    this.frontFace = this.northFace;
    this.northFace = this.backFace;
    this.backFace = this.southFace;
    return this.southFace = pastFrontFace;
  }

  x() {
    const pastFrontFace = this.frontFace;
    this.frontFace = this.southFace;
    this.southFace = this.backFace;
    this.backFace = this.northFace;
    return this.northFace = pastFrontFace;
  }

  translateMove(moveString) {
    const translateEnum = {
        U: faceNames[this.northFace],
        R: faceNames[this.eastFace],
        F: faceNames[this.frontFace],
        D: faceNames[this.southFace],
        L: faceNames[this.westFace],
        B: faceNames[this.backFace]
      };
    return translateEnum[moveString];
  }
}


class Cube {
  static initClass() {
  
    this.prototype.randomize = (function() {
      const randint = (min, max) => min + ((Math.random() * ((max - min) + 1)) | 0);
  
      const mixPerm = function(arr) {
        const max = arr.length - 1;
        return (() => {
          const result1 = [];
          for (let i = 0, end = max - 2, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
            const r = randint(i, max);
  
            // Ensure an even number of swaps
            if (i !== r) {
              var ref;
              [arr[i], arr[r]] = Array.from([arr[r], arr[i]]);
              result1.push([arr[max], arr[max - 1]] = Array.from(ref = [arr[max - 1], arr[max]]), ref);
            } else {
              result1.push(undefined);
            }
          }
          return result1;
        })();
      };
  
      const randOri = function(arr, max) {
        let ori = 0;
        for (let i = 0, end = arr.length - 2, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
          ori += (arr[i] = randint(0, max - 1));
        }
  
        // Set the orientation of the last cubie so that the cube is
        // valid
        return arr[arr.length - 1] = (max - (ori % max)) % max;
      };
  
      const result = function() {
        mixPerm(this.cp);
        mixPerm(this.ep);
        randOri(this.co, 3);
        randOri(this.eo, 2);
        return this;
      };
  
      return result;
    })();
  
    this.moves = [
      // U
      {
        cp: [UBR, URF, UFL, ULB, DFR, DLF, DBL, DRB],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UB, UR, UF, UL, DR, DF, DL, DB, FR, FL, BL, BR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
  
      // R
      {
        cp: [DFR, UFL, ULB, URF, DRB, DLF, DBL, UBR],
        co: [2, 0, 0, 1, 1, 0, 0, 2],
        ep: [FR, UF, UL, UB, BR, DF, DL, DB, DR, FL, BL, UR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
  
      // F
      {
        cp: [UFL, DLF, ULB, UBR, URF, DFR, DBL, DRB],
        co: [1, 2, 0, 0, 2, 1, 0, 0],
        ep: [UR, FL, UL, UB, DR, FR, DL, DB, UF, DF, BL, BR],
        eo: [0, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0]
      },
  
      // D
      {
        cp: [URF, UFL, ULB, UBR, DLF, DBL, DRB, DFR],
        co: [0, 0, 0, 0, 0, 0, 0, 0],
        ep: [UR, UF, UL, UB, DF, DL, DB, DR, FR, FL, BL, BR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
  
      // L
      {
        cp: [URF, ULB, DBL, UBR, DFR, UFL, DLF, DRB],
        co: [0, 1, 2, 0, 0, 2, 1, 0],
        ep: [UR, UF, BL, UB, DR, DF, FL, DB, FR, UL, DL, BR],
        eo: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      },
  
      // B
      {
        cp: [URF, UFL, UBR, DRB, DFR, DLF, ULB, DBL],
        co: [0, 0, 1, 2, 0, 0, 2, 1],
        ep: [UR, UF, UL, BR, DR, DF, DL, BL, FR, FL, UB, DB],
        eo: [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 1]
      }
    ];
  }
  constructor(other) {
    let x;
    if (other != null) {
      this.init(other);
    } else {
      this.identity();
    }

    // For moves to avoid allocating new objects each time
    this.newCp = ((() => {
      const result = [];
      for (x = 0; x <= 7; x++) {
        result.push(0);
      }
      return result;
    })());
    this.newEp = ((() => {
      const result1 = [];
      for (x = 0; x <= 11; x++) {
        result1.push(0);
      }
      return result1;
    })());
    this.newCo = ((() => {
      const result2 = [];
      for (x = 0; x <= 7; x++) {
        result2.push(0);
      }
      return result2;
    })());
    this.newEo = ((() => {
      const result3 = [];
      for (x = 0; x <= 11; x++) {
        result3.push(0);
      }
      return result3;
    })());
  }

  init(state) {
    this.co = state.co.slice(0);
    this.ep = state.ep.slice(0);
    this.cp = state.cp.slice(0);
    this.eo = state.eo.slice(0);
    return this.rotCube = state.rotCube;
  }

  identity() {
    // Initialize to the identity cube
    let x;
    this.cp = [0, 1, 2, 3, 4, 5, 6, 7];
    this.co = ((() => {
      const result = [];
      for (x = 0; x <= 7; x++) {
        result.push(0);
      }
      return result;
    })());
    this.ep = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.eo = ((() => {
      const result1 = [];
      for (x = 0; x <= 11; x++) {
        result1.push(0);
      }
      return result1;
    })());
    return this.rotCube = new RotationCube();
  }

  toJSON() {
    return {
      cp: this.cp,
      co: this.co,
      ep: this.ep,
      eo: this.eo
    };
  }

  asString() {
    let i, n, ori;
    let c;
    const result = [];

    // Initialize centers
    for ([i, c] of [[4, 'U'], [13, 'R'], [22, 'F'], [31, 'D'], [40, 'L'], [49, 'B']]) {
      result[i] = c;
    }

    for (i = 0; i <= 7; i++) {
      const corner = this.cp[i];
      ori = this.co[i];
      for (n = 0; n <= 2; n++) {
        result[cornerFacelet[i][(n + ori) % 3]] = cornerColor[corner][n];
      }
    }

    for (i = 0; i <= 11; i++) {
      const edge = this.ep[i];
      ori = this.eo[i];
      for (n = 0; n <= 1; n++) {
        result[edgeFacelet[i][(n + ori) % 2]] = edgeColor[edge][n];
      }
    }

    return result.join('');
  }

  static fromString(str) {
    let i, j;
    const cube = new Cube;

    for (i = 0; i <= 7; i++) {
      var ori;
      for (ori = 0; ori <= 2; ori++) {
        if (['U', 'D'].includes(str[cornerFacelet[i][ori]])) { break; }
      }
      const col1 = str[cornerFacelet[i][(ori + 1) % 3]];
      const col2 = str[cornerFacelet[i][(ori + 2) % 3]];

      for (j = 0; j <= 7; j++) {
        if ((col1 === cornerColor[j][1]) && (col2 === cornerColor[j][2])) {
          cube.cp[i] = j;
          cube.co[i] = ori % 3;
        }
      }
    }

    for (i = 0; i <= 11; i++) {
      for (j = 0; j <= 11; j++) {
        if ((str[edgeFacelet[i][0]] === edgeColor[j][0]) &&
            (str[edgeFacelet[i][1]] === edgeColor[j][1])) {
          cube.ep[i] = j;
          cube.eo[i] = 0;
          break;
        }
        if ((str[edgeFacelet[i][0]] === edgeColor[j][1]) &&
            (str[edgeFacelet[i][1]] === edgeColor[j][0])) {
          cube.ep[i] = j;
          cube.eo[i] = 1;
          break;
        }
      }
    }

    return cube;
  }

  clone() {
    return new Cube(this.toJSON());
  }

  // A class method returning a new random cube
  static random() {
    return new Cube().randomize();
  }

  isSolved() {
    for (let c = 0; c <= 7; c++) {
      if (this.cp[c] !== c) { return false; }
      if (this.co[c] !== 0) { return false; }
    }

    for (let e = 0; e <= 11; e++) {
      if (this.ep[e] !== e) { return false; }
      if (this.eo[e] !== 0) { return false; }
    }

    return true;
  }

  // Multiply this Cube with another Cube, restricted to corners.
  cornerMultiply(other) {
    let from;
    for (let to = 0; to <= 7; to++) {
      from = other.cp[to];
      this.newCp[to] = this.cp[from];
      this.newCo[to] = (this.co[from] + other.co[to]) % 3;
    }

    [this.cp, this.newCp] = Array.from([this.newCp, this.cp]);
    [this.co, this.newCo] = Array.from([this.newCo, this.co]);
    return this;
  }

  // Multiply this Cube with another Cube, restricted to edges
  edgeMultiply(other) {
    let from;
    for (let to = 0; to <= 11; to++) {
      from = other.ep[to];
      this.newEp[to] = this.ep[from];
      this.newEo[to] = (this.eo[from] + other.eo[to]) % 2;
    }

    [this.ep, this.newEp] = Array.from([this.newEp, this.ep]);
    [this.eo, this.newEo] = Array.from([this.newEo, this.eo]);
    return this;
  }

  // Multiply this cube with another Cube
  multiply(other) {
    this.cornerMultiply(other);
    this.edgeMultiply(other);
    return this;
  }


  parseAlg(arg) {
    if (typeof arg === 'string') {

      // String
      return (() => {
        const result = [];
        for (let part of Array.from(arg.split(/\s+/))) {
          var power;
          if (part.length === 0) {
            // First and last can be empty
            continue;
          }

          if (part.length > 2) {
            throw new Error(`Invalid move: ${part}`);
          }

          switch (part) {
            case "X": this.rotCube.x(); continue; break;
            case "X'": this.rotCube.xPrime(); continue; break;
            case "Y": this.rotCube.y(); continue; break;
            case "Y'": this.rotCube.yPrime(); continue; break;
            case "Z": this.rotCube.z(); continue; break;
            case "Z'": this.rotCube.zPrime(); continue; break;
          }

          const move = faceNums[this.rotCube.translateMove(part[0])];
          if (move === undefined) {
            throw new Error(`Invalid move: ${part}`);
          }

          if (part.length === 1) {
            power = 0;
          } else {
            if (part[1] === '2') {
              power = 1;
            } else if (part[1] === "'") {
              power = 2;
            } else {
              throw new Error(`Invalid move: ${part}`);
            }
          }

          result.push((move * 3) + power);
        }
        return result;
      })();

    } else if (arg.length != null) {
      // Already an array
      return arg;

    } else {
      // A single move
      return [arg];
    }
  }

  move(arg) {

    for (let move of Array.from(this.parseAlg(arg))) {
      const face = (move / 3) | 0;
      const power = move % 3;
      for (let x = 0, end = power, asc = 0 <= end; asc ? x <= end : x >= end; asc ? x++ : x--) { this.multiply(Cube.moves[face]); }
    }

    return this;
  }

  static inverse(arg) {
    let move, face, power;
    const result = (() => {
      const result1 = [];
      for (move of Array.from(parseAlg(arg))) {
        face = (move / 3) | 0;
        power = move % 3;
        result1.push((face * 3) + -(power - 1) + 1);
      }
      return result1;
    })();

    result.reverse();

    if (typeof arg === 'string') {
      let str = '';
      for (move of Array.from(result)) {
        face = (move / 3) | 0;
        power = move % 3;
        str += faceNames[face];
        if (power === 1) {
          str += '2';
        } else if (power === 2) {
          str += "'";
        }
        str += ' ';
      }
      return str.substring(0, str.length - 1);

    } else if (arg.length != null) {
      return result;

    } else {
      return result[0];
    }
  }
}
Cube.initClass();


//# Globals

if (typeof module !== 'undefined' && module !== null) {
  module.exports = Cube;
} else {
  this.Cube = Cube;
}