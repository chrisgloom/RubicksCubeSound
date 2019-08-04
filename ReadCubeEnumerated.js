class FaceAssociations {
    constructor(topLeftCorner, topRightCorner, bottomLeftCorner, bottomRightCorner, topEdge, rightEdge, bottomEdge, leftEdge, face, leftFromHere, upFromHere, rightFromHere, downFromHere) {
        this.topLeftCorner = topLeftCorner
        this.topRightCorner = topRightCorner
        this.bottomLeftCorner = bottomLeftCorner
        this.bottomRightCorner = bottomRightCorner
        this.topEdge = topEdge
        this.rightEdge = rightEdge
        this.bottomEdge = bottomEdge
        this.leftEdge = leftEdge
        this.face = face

        this.leftFromHere = leftFromHere
        this.upFromHere = upFromHere
        this.rightFromHere = rightFromHere
        this.downFromHere = downFromHere
    }
}

class CornerCubieOrientation {
    constructor(outwardFace, leftFace, rightFace, cornerPieceNumber) {
        // input vars should be facelet strings: U, R, L, D, B, F

        //outward here is always assumed to be "up" so that when a corner piece is down, it's thought to be upside down
        this.outwardFace = outwardFace
        this.leftFace = leftFace
        this.rightFace = rightFace
        this.cornerPieceNumber = cornerPieceNumber
    }

    getCornerPieceNumber() {
        return this.cornerPieceNumber
    }

    getOrientation(orientation) {
        // given which side of the cube is "out", return a new object with the current orientation
        switch (orientation) {
            case 0:
                return this
            case 1:
                return new CornerCubieOrientation(this.leftFace, this.rightFace, this.outwardFace)
            case 2:
                return new CornerCubieOrientation(this.rightFace, this.leftFace, this.outwardFace)
        }
    }

}

var exportedCorners = [
    new CornerCubieOrientation("U", "F", "R"),
    new CornerCubieOrientation("U", "L", "F"),
    new CornerCubieOrientation("U", "B", "L"),
    new CornerCubieOrientation("U", "R", "B"),
    new CornerCubieOrientation("D", "R", "F"),
    new CornerCubieOrientation("D", "F", "L"),
    new CornerCubieOrientation("D", "L", "B"),
    new CornerCubieOrientation("D", "B", "R")
]




/*
    just create some method that returns the color of the  orientation of the current 
*/

module.exports = {
    F: new FaceAssociations(1, 0, 5, 4, 1, 8, 5, 9, "F", "L", "U", "R", "D"),
    U: new FaceAssociations(2, 3, 1, 0, 3, 0, 1, 2, "U", "L", "B", "R", "F"),
    R: new FaceAssociations(0, 3, 4, 7, 0, 11, 4, 8, "R", "F", "U", "B", "D"),
    D: new FaceAssociations(5, 4, 6, 7, 5, 4, 7, 6, "D", "L", "F", "R", "B"),
    L: new FaceAssociations(2, 1, 6, 5, 2, 9, 6, 10, "L", "B", "U", "F", "D"),
    B: new FaceAssociations(3, 2, 7, 6, 3, 10, 7, 11, "B", "R", "U", "L", "D"),


    exportedCorners

}