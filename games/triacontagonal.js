"use strict";

let content = document.getElementById("content");

let boardContainer = document.getElementById("boardContainer");
const defaultBoardContainerSize = { width: parseInt(getComputedStyle(boardContainer).width), height: parseInt(getComputedStyle(boardContainer).height) };


let points = [];
let allLines = [];
let bases = [];

let svgEl;

let transmap = [ 1,12,51,52,
				59,14,25,40,
				24,26,36,44,
				37,58,10,28,
				15,48,18,42,
				53,23, 5,32,
				39,19,31,21,
				46, 7,47,11,
				 9,20,54,35,
				 8,27,33,50,
				22,43, 3,60,
				55,17,13,38,
				57,56, 2, 6,
				30,45,49, 4,
				16,29,34,41];
let helperTable = [
	[ 1,52,10,58, 4,49,13,55, 7,46,],
	[12,51,28,37,45,30,17,38,11,47,],
	[59,25,48,42,34,29,27, 8,35, 9,],
	[14,40,15,18,16,41,33,50,20,54,],
	[24,26,32, 5,56, 6,60,22,31,39,],
	[36,44,23,53, 2,57, 3,43,19,21,],
	[12,51, 3,60, 9,54,15,48, 6,57,],
	[ 1,52,22,43,35,20,18,42, 2,56,],
	[14,40,13,17,19,39,32,53,30,49,],
	[59,25,55,38,31,21,23, 5,45, 4,],
	[36,44,50,27,46,11,37,10,29,16,],
	[24,26, 8,33, 7,47,28,58,41,34,],
	[59,14,53, 5,47,11,56, 2,50, 8,],
	[25,40,32,23,46, 7,57, 6,33,27,],
	[24,44,37,58,20,54, 4,45, 3,22,],
	[26,36,10,28, 9,35,30,49,43,60,],
	[ 1,51,15,42,21,19,34,41,17,55,],
	[12,52,18,48,31,39,29,16,13,38,],
	[25,40,19,31,28,37,22,43,16,34,],
	[59,14,39,21,10,58, 3,60,41,29,],
	[26,36,11, 7,18,15,55,38,57,56,],
	[24,44,46,47,48,42,17,13, 2, 6,],
	[12,52,35,54,53,23,33, 8, 4,30,],
	[ 1,51, 9,20,32, 5,50,27,45,49,],
	[24,36,18,42,27,33,21,39,30,45,],
	[26,44,48,15,50, 8,19,31, 4,49,],
	[ 1,12,23, 5,60,43,47,46,16,41,],
	[51,52,53,32,22, 3, 7,11,29,34,],
	[59,40,28,58,13,38,20, 9,57, 2,],
	[14,25,37,10,55,17,35,54, 6,56,],
	[26,44,20,35,29,41,23,32,17,38,],
	[24,36, 9,54,16,34,53, 5,55,13,],
	[51,52,31,21, 2, 6,10,28,33,50,],
	[ 1,12,39,19,57,56,37,58, 8,27,],
	[14,25, 7,47,45,49,48,18,43, 3,],
	[59,40,46,11,30, 4,15,42,22,60,],
]

let fiveFold = [
    [    2,   6,  56,  57], 
    [    2,  28,  43,  47], 
    [    3,  14,  53,  54], 
    [    3,  22,  43,  60], 
    [    5,   9,  59,  60], 
    [    5,  16,  31,  50], 
    [    6,  25,  31,  48], 
    [    8,  12,  47,  48], 
    [    8,  19,  34,  53], 
   [    9,  28,  34,  51], 
   [   11,  15,  50,  51], 
   [   11,  22,  37,  56], 
   [   12,  16,  37,  54], 
   [   14,  25,  40,  59], 
   [   15,  19,  40,  57]
];

let fiveFoldMotifs = [
    [2, 6, 56, 57],
    [    2,  28,  43,  47],
    [    3,  22,  43,  60], 
];

let threeFold = [
[    1,  19,  43,  49],
[    1,  27,  42,  46],
[    2,  20,  44,  50],
[    2,  21,  42,  59],
[    3,  14,  53,  54],
[    3,  21,  45,  51],
[    3,  22,  43,  60],
[    3,  29,  44,  48],
[    4,   8,  58,  59],
[    4,  30,  45,  49],
[    6,  17,  32,  51],
[    6,  24,  33,  54],
[    7,  25,  34,  55],
[    7,  26,  32,  49],
[    8,  19,  34,  53],
[    8,  26,  35,  56],
[    8,  27,  33,  50],
[    9,  13,  48,  49],
[    9,  20,  35,  54],
[   11,  22,  37,  56],
[   11,  29,  38,  59],
[   12,  16,  37,  54],
[   12,  30,  39,  60],
[   13,  16,  40,  46],
[   13,  17,  38,  55],
[   13,  24,  39,  58],
[   14,  25,  40,  59],

];

let threeFoldMotifs = [
    [    1,  19,  43,  49],
    [    1,  27,  42,  46],
    [    2,  20,  44,  50],
    [    2,  21,  42,  59],
    [    3,  14,  53,  54],
    [    3,  21,  45,  51],
    [    3,  22,  43,  60],
    [    3,  29,  44,  48],
    [    4,  30,  45,  49],
];

let tbases = [
    /*
	[ 1, 2, 3, 4],
	[13,14,15,16],
	[21,22,23,24],
	[45,46,47,48],
	[49,50,51,52],
	[56,45,17,35],
	[14,60,34, 1],
	[26,12,46,13],
	[13,32,50,41],
	[49, 8,26,17],
	[10,48,27,16],
	[57,23,27,40],
	[21,47,51, 4],
	[60,17,44,10],
	[12,29,56,22],
	[24,41, 8,34],
	[44,29,15,52],
	[35, 2,13,57],
	[32,17, 3,40]
    */

    [    2,   6,  56,  57], 
    [    2,  28,  43,  47], 
    [    3,  14,  53,  54], 
    [    3,  22,  43,  60], 
    [    5,   9,  59,  60], 
    [    5,  16,  31,  50], 
    [    6,  25,  31,  48], 
    [    8,  12,  47,  48], 
    [    8,  19,  34,  53], 
   [    9,  28,  34,  51], 
   [   11,  15,  50,  51], 
   [   11,  22,  37,  56], 
   [   12,  16,  37,  54], 
   [   14,  25,  40,  59], 
   [   15,  19,  40,  57]
];


let celesteFiveFold = [
    [59, 14, 25, 40],
    [39, 19, 31, 21],
    [8, 27, 33, 50],
    [47, 43, 2, 28],
    [42, 24, 22, 34],
    [11, 53, 30, 36],
    [37, 11, 56, 22],
    [43, 36, 16, 18],
    [45, 5, 24, 47],
    [16, 5, 31, 50],
    [25, 37, 45, 27],
    [18, 39, 14, 56],
    [34, 19, 8, 53],
    [40, 30, 33, 28],
    [42, 59, 2, 21]];

let celesteFiveFoldBases = [
    
];

let celesteThreeFold = [
    [24, 26, 36, 44], 
    [39, 19, 31, 21], 
    [16, 29, 34, 41], 
    [4, 55, 15, 54], 
    [49, 14, 10, 50], 
    [60, 9, 59, 5], 
    [48, 13, 9, 49], 
    [8, 4, 58, 59], 
    [14, 54, 53, 3], 
    [16, 5, 31, 50], 
    [41, 15, 60, 26],
    [55, 36, 10, 21],
    [34, 19, 8, 53],
    [29, 3, 44, 48],
    [13, 58, 39, 24]]
;

//let tbases = dbasis.map((b) => canonicalize(b.map((v) => transmap[v - 1])));
//console.log(tbases)

let blackLineWidth = 0.1;
let blueLineWidth = 0.4;
let redLineWidth = 0.2;


let circleMap = [];
boardContainer.appendChild(makeCircleBoard(45));

buildScoreboard(8, 5);

let includeDiagonals = false;

tbases =
    //[fiveFoldMotifs[1]]
    //[fiveFold[7]]; //1, 3
    //fiveFold;
    //threeFold;
    //celesteFiveFold;
    //celesteThreeFold;
    [];
//usePlotA();
//usePlotB();





// Fivefold Flower
let myMotif = [
    [1, 5, 55, 56],
    [1, 19, 43, 49],
    [2, 28, 43, 47]
];

myMotif = [

    [1, 5, 55, 56], // AADD
    [1, 19, 43, 49], // ABCD 1
    [2, 28, 43, 47] // ABCD 2

    //[1, 5, 55, 56],
    //addN([1, 19, 43, 49], 6),
    //addN([2, 28, 43, 47], 0),

    //addN([3, 14, 53, 54], 0),
    //addN([4, 15, 54, 55], 5),
    
    //addN([3, 29, 44, 48], 0),
    //addN([5, 16, 31, 50], 5),
    //[16, 29, 34, 41]

    /*
    [3, 14, 53, 54], //AADD
    [4, 15, 54, 55],
    [3, 29, 44, 48], //ABCD
    [5, 16, 31, 50],
    [16, 29, 34, 41] //BBCC
    */

    /*
    [    1,  19,  43,  49], //ABCD 1
    [    1,  27,  42,  46], //ABCD 2
    [    2,  21,  42,  59], // ABCD 3 nonconvex
    [    2,  20,  44,  50],
    [    3,  21,  45,  51],
    [    3,  29,  44,  48],
    [    4,  30,  45,  49],
    [    3,  22,  43,  60],
    [    3,  14,  53,  54], //AADD 1
    */
];
let rotationColors = 
    //["#0000FF"];
    //["#FF0000"];
    ["#FF0000", "#1b960e", "#d4d00f", "#0000FF", "#e00dc4"];
    //["#FF0000", "#0000FF", "#05b32b"];

/*
// Threefold
let myMotif = [
    [3, 14, 53, 54],
    [3, 29, 44, 48],
    [4, 15, 54, 55],
    [5, 16, 31, 50],
    [16, 29, 34, 41]
];
let rotationColors = ["#FF0000", "#0000FF", "#05b32b"];
*/

let showOnly = "#0000FF";
showOnly = undefined;

let foldSymmetry = rotationColors.length;
let stepSize = 15 / foldSymmetry;

for (let i = 0; i < foldSymmetry; i++) {
    let col = rotationColors[i];
    let amnt = stepSize * i;
    for (let j = 0 ; j < myMotif.length; j++) {
        tryAddBasis(addN(myMotif[j], amnt), col);
    }
}
/*
tbases.forEach((b) => {
	console.log(b);
	tryAddBasis(b);
});

// COLOR MOTIF

setTimeout( () => {
myMotif.forEach(b => {
    foreachLineInBasis(shiftBackBy1(b), l => {
        l.makeBlack(0.7);
    });
});
}, 1000);
*/

/*

let proofGenerator =
    //[1, 5, 55, 56]
    [16, 18, 36, 43]
    ;

generate15(proofGenerator).forEach(b => {
    tryAddBasis(b);
});

setTimeout(() => {
    let b = proofGenerator;
//generate15([1, 12, 51, 52]).forEach((b) => {
    foreachLineInBasis(shiftBackBy1(b), l => {
        //l.makeBlack(2.0);
        l.makeBlack(0.7);
    });
//});
}, 1000);

*/

// document.querySelectorAll("#upperLeft button")[0].onclick = () => reset();
// document.querySelectorAll("#upperLeft button")[1].onclick = () => solve();
// document.querySelectorAll("#upperLeft button")[0].onclick = () => document.querySelector("#win_about").classList.toggle("hidden");
document.querySelectorAll("#upperLeft button")[0].onclick = () => document.querySelector("#win_rules").classList.toggle("hidden");
document.querySelectorAll("#upperLeft button")[1].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > hr")[0].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
document.querySelectorAll("#upperLeft button")[2].onclick = () => reset();
document.querySelectorAll("#upperLeft button")[3].onclick = () => solve();
// document.querySelectorAll("#upperLeft button")[4].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > h2")[1].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
// document.querySelectorAll("#upperLeft button")[5].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > h2")[2].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
// document.querySelectorAll("#upperLeft button")[6].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > h2")[3].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
document.getElementById("toTop").onclick = () => window.scrollTo({top: 0, behavior: "smooth"});

document.querySelectorAll(".person").forEach((e, i) => {
    e.onmouseenter = ev => {
        document.querySelectorAll(".personDesc")[Math.floor(i / 3)].classList.toggle("highlight", true);
    };
    e.onmouseleave = ev => {
        document.querySelectorAll(".personDesc")[Math.floor(i / 3)].classList.toggle("highlight", false);
    };
});

function pickFillColorFromUses(uses, col) {
    if (uses === 0) return "#000000";
    if (uses % 2 === 1) return "#FF0000";
    return "#00FF00";
}

function makePoint(x, y, width) {
    let circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circ.setAttribute("cx", x + "%");
    circ.setAttribute("cy", y + "%");
    circ.setAttribute("r", width + "%");
    circ.setAttribute("fill", "#000000")
    return {
        x: x,
        y: y,
        element: circ,
        uses: 0,
        color: "#FF0000",
        lines: [],
        updateColor: function() {
            circ.setAttribute("fill", pickFillColorFromUses(this.uses, this.color));
        },
        addUse: function() {
            this.uses++;
        },
        removeUse: function() {
            this.uses--;
        }
    };
}


function makeLine(startInd, endInd) {
    let line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    let sPt = points[startInd];
    let ePt = points[endInd];

    line.setAttribute("x1", sPt.x + "%");
    line.setAttribute("y1", sPt.y + "%");
    line.setAttribute("x2", ePt.x + "%");
    line.setAttribute("y2", ePt.y + "%");
    line.setAttribute("stroke", "none");
    line.setAttribute("stroke-width", blackLineWidth + "%");
    return {
        sInd: startInd,
        eInd: endInd,
        element: line,
        color: "blue",
        uses: 0,
        makeColor: (col, width) => {
            if (showOnly === undefined || col == showOnly) {
            line.setAttribute("stroke", col);
            line.setAttribute("stroke-width", width + "%");
            }
        },
        updateColor: function(overrideWidth) {
            if (this.uses === 0) {
                this.makeBlack(overrideWidth);
            }
            else {
                if (overrideWidth === undefined) {
                    overrideWidth = blueLineWidth;
                }
                if (this.color === undefined) {
                    this.color = "blue";
                }
                this.makeColor(this.color, overrideWidth);
            }
        },
        addUse: function() {
            this.uses++;
        },
        removeUse: function() {
            this.uses--;
        },
        makeBlack: (overrideWidth) => {
            line.setAttribute("stroke", "black");
            if (overrideWidth === undefined) {
                overrideWidth = blackLineWidth;
            }
            line.setAttribute("stroke-width", overrideWidth + "%");
        },
        makeRed: () => {
            line.setAttribute("stroke", "red");
            line.setAttribute("stroke-width", redLineWidth + "%");
        }
    };
}

function makeRing(radius, startingAngle, angleInterval) {
    radius *= 45;
    let count = 15;
    for (let i = 0; i < count; i++) {
        let angle = startingAngle + angleInterval * i;
        //angle += 24 * 3;
        let angleRads = -Math.PI * angle / 180.0;
        let x = Math.cos(angleRads) * radius + 50;
        let y = Math.sin(angleRads) * radius + 50;

        let newPt = makePoint(x, y, 1);
        //root.appendChild(newPt.element);
        points.push(newPt);
    }
}

function appendPointsToDOM(root) {
    for (let i = 0; i < points.length; i++) {
        root.appendChild(points[i].element);
    }
}

function addLine(startInd, endInd, svg) {
    let ind = findLine(startInd, endInd);
    if (ind !== -1) return;
    let line = makeLine(startInd, endInd);
    svg.appendChild(line.element);
    let lineInd = allLines.length;
    allLines.push(line);
    points[line.sInd].lines.push(lineInd);
    points[line.eInd].lines.push(lineInd);
}

function addBasis(arr, svg) {
    addLine(arr[0] - 1, arr[1] - 1, svg);
    addLine(arr[1] - 1, arr[2] - 1, svg);
    addLine(arr[2] - 1, arr[3] - 1, svg);
    addLine(arr[3] - 1, arr[0] - 1, svg);
    addLine(arr[0] - 1, arr[2] - 1, svg);
    addLine(arr[1] - 1, arr[3] - 1, svg);
}

function addBases(arr, svg) {
    for (let i = 0; i < arr.length; i++) {
        addBasis(arr[i], svg);
    }
}

function addBasesGeneratedBy(basis, svg) {
    addBases(generate15(basis), svg);
}

function makeVecFromTo(a, b) {
    return {x: b.x - a.x, y: b.y - a.y};
}

function magSquare(v) {
    return v.x * v.x + v.y * v.y;
}

function vecmag(v) {
    return Math.sqrt(magSquare(v));
}

function scaleVec(v, s) {
    return {x: v.x * s, y: v.y * s};
}

function vecdot(v, w) {
    return v.x * w.x + v.y * w.y;
}

function getLineInds(basis, addToInds) {
    if (addToInds === undefined) addToInds = 0;

    // all lines
    let availableLines = [
        findLine(basis[0] + addToInds, basis[1] + addToInds),
        findLine(basis[1] + addToInds, basis[2] + addToInds),
        findLine(basis[2] + addToInds, basis[3] + addToInds),
        findLine(basis[3] + addToInds, basis[0] + addToInds),
        findLine(basis[0] + addToInds, basis[2] + addToInds),
        findLine(basis[3] + addToInds, basis[1] + addToInds)
    ];
    if (includeDiagonals) {
        return availableLines;
    }

    // available indices
    let pointInds = [basis[0] + addToInds, basis[1] + addToInds, basis[2] + addToInds, basis[3] + addToInds];
    let linesToRet = [];
    let pointsToPut = [];
    let startingPointInd = pointInds[0];

    // Find the leftmost position:
    for (let i = 0; i < pointInds.length; i++) {
        if (points[pointInds[i]].x < points[startingPointInd].x) {
            startingPointInd = pointInds[i];
        }
    }

    let startingPoint = points[startingPointInd];

    // https://en.wikipedia.org/wiki/Gift_wrapping_algorithm
    for (let i = 0; i < pointInds.length; i++) {
        // ... pick the next point
        let endpointInd = pointInds[0];
        for (let j = 0; j < pointInds.length; j++) {
            if (endpointInd == startingPointInd) {
                endpointInd = pointInds[j];
                continue;
            }

            let candidatePointInd = pointInds[j];
            let candidatePoint = points[candidatePointInd];
            if (candidatePoint.x == startingPoint.x && candidatePoint.y == startingPoint.y) continue;

            let vecToEndpoint = makeVecFromTo(startingPoint, points[endpointInd]);

            let delta = makeVecFromTo(startingPoint, candidatePoint);
            let deltMag = Math.sqrt(delta.x * delta.x + delta.y * delta.y);
            delta.x /= deltMag;
            delta.y /= deltMag;

            let sineOfAngle = vecToEndpoint.x * delta.y - vecToEndpoint.y * delta.x;
            // on left
            if (sineOfAngle < 0) {
                endpointInd = pointInds[j];
                continue;
            }
        }
        
        if (startingPointInd === pointsToPut[0]) {
            break;
        }
        //console.log("Linking", startingPointInd, endpointInd);
        pointsToPut.push(startingPointInd);
        linesToRet.push(findLine(startingPointInd, endpointInd));
        startingPointInd = endpointInd;
        startingPoint = points[startingPointInd];
    }

    if (pointsToPut.length == 3) {
        let lastPoint = undefined;
        for (let i = 0; i < pointInds.length; i++) {
            let seen = false;
            for (let j = 0; j < pointsToPut.length; j++) {
                if (pointsToPut[j] === pointInds[i]) {
                    seen = true;
                    break;
                }
            }
            if (seen) {
                continue;
            }
            lastPoint = pointInds[i];
            break;
        }

        if (lastPoint === undefined) {
            console.log("BIG ERROR");
        }
        else {
            console.log("Missing point identified");
            
            let medPt = points[lastPoint];

            let bestDot = -Infinity;
            let bestI = 0;

            for (let i = 0; i < pointsToPut.length; i++) {
                let pt1 = points[pointsToPut[i]];
                let nextI = (i + 1) % pointsToPut.length;
                let pt2 = points[pointsToPut[nextI]];

                let v1 = makeVecFromTo(pt1, pt2);
                v1 = scaleVec(v1, 1.0 / vecmag(v1));

                let v2 = makeVecFromTo(pt1, medPt);
                v2 = scaleVec(v2, 1.0 / vecmag(v2));

                let curDot = vecdot(v1, v2);
                if (curDot > bestDot) {
                    bestDot = curDot;
                    bestI = i;
                }
            }

            linesToRet = [];

            for (let i = 0; i < pointsToPut.length; i++) {
                if (i == bestI) {
                    let pt1 = pointsToPut[i];
                    let nextI = (i + 1) % pointsToPut.length;
                    let pt3 = pointsToPut[nextI];
                    let pt2 = lastPoint;
                    linesToRet.push(findLine(pt1, pt2));
                    linesToRet.push(findLine(pt2, pt3));
                    continue;
                }

                let curPt = pointsToPut[i];
                let nextI = (i + 1) % pointsToPut.length;
                let nextPt = pointsToPut[nextI];
                linesToRet.push(findLine(curPt, nextPt));
            }

            if (linesToRet.length == 4) {
                console.log("w");
            }
            else {
                console.log("Line count wrong");
            }
        }
    }
    else if (pointsToPut.length == 4) {
        console.log("Success amnt!");
    }
    else {
        console.log("Unhandled count error");
    }

    console.log("Returning lines", linesToRet);
    return linesToRet;
}

function setBasisColor(basis, color, width) {
    let inds = getLineInds(basis);
    for (let i = 0; i < inds.length; i++) {
        allLines[inds[i]].makeColor(color, width);
    }
}

function foreachLineInBasis(basis, fun) {
    let inds = getLineInds(basis);
    for (let i = 0; i < inds.length; i++) {
        fun(allLines[inds[i]]);
    }
}

function foreachPointInBasis(basis, fun) {
    for (let i = 0; i < basis.length; i++) {
        fun(points[basis[i]]);
    }
}

function foreachPartOfBasis(basis, lineFun, pointFun) {
    foreachLineInBasis(basis, lineFun);
    foreachPointInBasis(basis, pointFun);
}

function findDirLine(sInd, eInd) {
    //console.log(sInd);
    let lines = points[sInd].lines;
    for (let i = 0; i < lines.length; i++) {
        if (allLines[lines[i]].eInd === eInd) {
            return lines[i];
        }
    }
    return -1;
}

function findLine(a, b) {
    let d1 = findDirLine(a, b);
    if (d1 !== -1) return d1;

    return findDirLine(b, a);
}

function makeLineRed(a, b) {
    allLines[findLine(a, b)].makeRed();
}

function addN(starting, n) {
    n = n % 15;
    let res = [];
    for (let i = 0; i < starting.length; i++) {
        let newBlah = starting[i] + n;
        let firstRing = Math.floor((starting[i] - 1) / 15);
        let newRing = Math.floor((newBlah - 1) / 15);
        if (newRing != firstRing) {
            newBlah = newBlah - 15;
        }
        res.push(newBlah);
    }
    return res;
}

function shiftBackBy1(basis) {
    let res = [];
    for (let i = 0; i < basis.length; i++) {
        res.push(basis[i] - 1);
    }
    return res;
}

function generate15(starting) {
    let sols = [];
    for (let i = 0; i < 15; i++) {
        sols.push(addN(starting, i));
    }
    return sols;
}

function animateBasisPlusN(starting, delay, n, next) {
    setBasisColor(shiftBackBy1(addN(starting, n)), "black", blackLineWidth);
    if (n === 15) {
        if (next) {
            next();
        }
        return;
    }
    setTimeout(() => {animateBasisPlusN(starting, delay, n + 1, next);}, delay);
}

function animatedColor15(starting, next) {
    animateBasisPlusN(starting, 600, 0, next);
}

function animatedColor15s(motifs) {
    if (motifs.length === 0) return;
    animatedColor15(motifs[0], () => {animatedColor15s(motifs.slice(1));})
}

function animatedUseBasisPlusN(starting, delay, n, stopN, next) {
    if (n === stopN) {
        if (next) {
            next();
        }
        return;
    }
    tryAddBasis(addN(starting, n));
    setTimeout(() => {animatedUseBasisPlusN(starting, delay, n + 1, stopN, next);}, delay);
}

function animatedUseBasisN(starting, delay, stopN, next) {
    animatedUseBasisPlusN(starting, delay, 0, stopN, next);
}

function canonicalize(basis) {
    return [...basis].sort();
}

function canonicalBasesEqual(basis1, basis2) {
    return  basis1[0] === basis2[0] &&
            basis1[1] === basis2[1] &&
            basis1[2] === basis2[2] &&
            basis1[3] === basis2[3];
}

function findCanonicalBasisIndexIfPresent(basis) {
    for (let i = 0; i < bases.length; i++) {
        if (canonicalBasesEqual(bases[i], basis)) return i;
    }
    return -1;
}

function reasonablyUpdateLines(basis) {
    foreachLineInBasis(basis, line => {
        line.updateColor();
    });
}

function temporarilyEngorgeLine(basis, bigWidth, time) {
    foreachLineInBasis(shiftBackBy1(basis), line => {
        line.updateColor(bigWidth);
    });

    setTimeout(() => {reasonablyUpdateLines(shiftBackBy1(basis));}, time);
}

function markBasisUsed(basis, col) {

    bases.push(basis);

    foreachPartOfBasis(shiftBackBy1(basis), (line) => {
        console.log(line.sInd + " " + line.eInd);
        line.addUse();
        line.color = col;
        //line.makeColor("yellow", 1);
        line.updateColor();
    }, (point) => {
        point.addUse();
        point.updateColor();
    });

    //temporarilyEngorgeLine(basis, 1, 300);
}

function markBasisUnused(basis) {
    foreachPartOfBasis(shiftBackBy1(basis), (line) => {
        line.removeUse();
        line.updateColor();
    }, (point) => {
        point.removeUse();
        point.updateColor();
    });
}

function tryAddCanonicalBasis(basis, col) {
    if (findCanonicalBasisIndexIfPresent(basis) >= 0) return;

    markBasisUsed(basis, col);
}

function tryAddBasis(basis, col) {
    tryAddCanonicalBasis(canonicalize(basis), col);
}

function tryRemoveCanonicalBasis(basis) {
    let ind = findCanonicalBasisIndexIfPresent(basis);
    if (ind < 0) return;

    bases.splice(ind, 1);

    markBasisUnused(basis);
}

function tryRemoveBasis(basis) {
    tryRemoveCanonicalBasis(canonicalize(basis));
}

function removeBasis(basis) {
    [...basis].sort();
}

function makeTriacontagonalProjection(outerRadius) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svgEl = svg;
    const svgSize = 100;
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);
    svg.setAttribute("viewBox", "0 0 100 100")
    
    makeRing(1.0, 0, 24);
    makeRing(0.8135, 6, 24);
    makeRing(0.6728, 6, 24);
    makeRing(0.3383, 0, 24);

    addBasesGeneratedBy([1, 12, 51, 52], svg);
    addBasesGeneratedBy([59, 14, 25, 40], svg);
    addBasesGeneratedBy([24, 26, 36, 44], svg);
    addBasesGeneratedBy([37, 58, 10, 28], svg);
    addBasesGeneratedBy([1, 20, 41, 58], svg);

    appendPointsToDOM(svg);

    
    /*animatedColor15s([[1, 12, 51, 52],
        [59, 14, 25, 40],
[24, 26, 36, 44],
[37, 58, 10, 28],
[1, 20, 41, 58]
    ]);*/
    
   // animatedUseBasisN([1, 5, 55, 56], 600, 16);

    return svg;
}

function usePlotA() {
    animatedUseBasisN([1, 5, 55, 56], 200, 15);
}

function usePlotB() {
    animatedUseBasisN([16, 18, 36, 43], 200, 15);
}

function makeCircleBoard(outerRadius) {
    return makeTriacontagonalProjection(outerRadius);

    const innerRadius = outerRadius * 0.55;
    const innerVals = [...Array(5).keys()].map(i => [...Array(8).keys()].map(n => n + 8 * i + 1));
    const outerVals = [[ 1, 2, 13, 14, 15, 16, 3, 4 ]    , [ 1, 2, 19, 20, 23, 24, 5, 6 ]    , [ 1, 3, 26, 28, 30, 32, 5, 7 ]    , [ 1, 4, 37, 38, 39, 40, 6, 7 ],
                       [ 9, 11, 18, 20, 22, 24, 13, 15 ] , [ 9, 10, 27, 28, 31, 32, 13, 14 ] , [ 9, 12, 35, 36, 39, 40, 14, 15 ] , [ 5, 6, 9, 10, 11, 12, 7, 8 ],
                       [ 17, 18, 29, 30, 31, 32, 19, 20 ], [ 17, 20, 34, 36, 38, 40, 22, 23 ], [ 3, 4, 17, 18, 21, 22, 7, 8 ]    , [ 10, 12, 17, 19, 21, 23, 14, 16 ],
                       [ 25, 28, 33, 36, 38, 39, 30, 31 ], [ 2, 4, 25, 27, 29, 31, 6, 8 ]    , [ 11, 12, 25, 26, 29, 30, 15, 16 ], [ 21, 22, 25, 26, 27, 28, 23, 24 ],
                       [ 2, 3, 33, 34, 35, 36, 5, 8 ]    , [ 10, 11, 33, 34, 37, 38, 13, 16 ], [ 18, 19, 33, 35, 37, 39, 21, 24 ], [ 26, 27, 34, 35, 37, 40, 29, 32 ]];

    let board = document.createElement("div");
    board.classList.add("board");

    circleMap = [];

    for(let i = 0; i < outerVals.length; i++) {
        
        const vals = outerVals[i];
        /*const thru = Math.floor(i/(outerVals.length / innerVals.length)) / innerVals.length * (2 * Math.PI);
        const thru2 = (i % (outerVals.length / innerVals.length) + 0.5) / (outerVals.length / innerVals.length) * (2 * Math.PI / 2.5) - (2 * Math.PI / 2.5)/2;

        let bx = (innerRadius * Math.sin(thru));
        let by = (innerRadius * -Math.cos(thru));
        var outerXOffset = 1.17;
        var outerYOffset = 0.91;
        */

        let pos = circlePos(i, innerVals.length, outerVals.length / innerVals.length, innerRadius, outerRadius, 'outer')
        let circle = makeCircle(vals, "calc(50% + " + pos[0] + "%)", "calc(50% + " + pos[1] + "%)");
        //let circle = makeCircle(vals, "calc(50% + " + (bx + ((outerRadius - innerRadius) * Math.sin(thru2 + thru)))*outerXOffset + "%)", "calc(50% + " + (by + ((outerRadius - innerRadius) * -Math.cos(thru2 + thru))) * outerYOffset + "%)");
        
        vals.forEach(e => {
            if(typeof(circleMap[e]) === 'undefined') {
                circleMap[e] = [];
            }
            circleMap[e].push(circle);
        });
        board.appendChild(circle);
    }

    for(let i = 0; i < innerVals.length; i++) {
        const vals = innerVals[i];
        /*const thru = i / innerVals.length * (2 * Math.PI);

        let circle = makeCircle(vals, "calc(50% + " + (innerRadius * Math.sin(thru)) + "%)", "calc(50% + " + (innerRadius * -Math.cos(thru)) + "%)");
        */
        let pos = circlePos(i, innerVals.length, outerVals.length, innerRadius, outerRadius, 'inner')
        let circle = makeCircle(vals, "calc(50% + " + pos[0] + "%)", "calc(50% + " + pos[1] + "%)");

        vals.forEach(e => {
            if(typeof(circleMap[e]) === 'undefined') {
                circleMap[e] = [];
            }
            circleMap[e].push(circle);
        });
        board.appendChild(circle);
    }

    board.appendChild(drawLines(outerRadius, innerRadius));

    boardContainer.querySelectorAll(".ray").forEach(el => {
		let i = el.children[0].innerText;
        el.onmouseenter = () => {
            circleMap[i].forEach(c => c.classList.add("highlight"));
        };

        el.onmouseleave = () => {
            circleMap[i].forEach(c => c.classList.remove("highlight"));
        };
    })

    return board;
}

function circlePos (index, numInner, numOuter, innerRadius, outerRadius, type) {
    let innerXOffset = 1;
    let innerYOffset = 1;
    //console.log(`[circlePos]: Received index ${index}, numInner ${numInner}, numOuter ${numOuter}, innerRadius ${innerRadius}, outerRadius ${outerRadius}, type ${type}`)
    if(type === 'outer'){
        let spread = 2.5;
        const angleRelativeToCenter = Math.floor(index/numOuter) * 2 * Math.PI / numInner;
        
        const alignTerm = ((numOuter - 1)/numOuter * spread) / 2;
        const angleRelativeToInnerCircle = ((index % numOuter) * spread / numOuter) - alignTerm;

        //console.log(`Index: ${index} Index/Outer = ${index/numOuter} Num outer ${numOuter}`)
        //console.log(`Index: ${index} Center: ${angleRelativeToCenter * 360.0/Math.PI} Inner: ${angleRelativeToInnerCircle * 360.0/Math.PI}`)

        let baseX = (innerRadius * Math.sin(angleRelativeToCenter));
        let baseY = (innerRadius * -Math.cos(angleRelativeToCenter));

        const deltaR = outerRadius - innerRadius;
        let deltaBx =  deltaR * Math.sin(angleRelativeToCenter + angleRelativeToInnerCircle);
        let deltaBy = deltaR *-Math.cos(angleRelativeToCenter + angleRelativeToInnerCircle);

        var outerXOffset = 1.2;
        var outerYOffset = 1.2;
        // var outerXOffset = 1.17;
        // var outerYOffset = 0.91;
        
        //console.log(`[circlePos]: Returning ${(baseX * innerXOffset + deltaBx * outerXOffset)}, ${(baseY  * innerYOffset + deltaBy * outerYOffset)}`)
        return [baseX * innerXOffset + deltaBx * outerXOffset, baseY  * innerYOffset + deltaBy * outerYOffset]
    }else{//type is inner
        const angleRelativeToCenter = index/numInner * 2 * Math.PI;
        let baseX = (innerRadius * Math.sin(angleRelativeToCenter))
        let baseY = (innerRadius * -Math.cos(angleRelativeToCenter))
        //console.log(`[circlePos]: Returning ${baseX * innerXOffset}, ${baseY * innerYOffset}`)
        return [baseX * innerXOffset,  baseY * innerYOffset]
    }
}

function makeCircle(vals, x, y) {
    let circle = document.createElement("table");
    circle.classList.add("circle");

    circle.style.left = x;
    circle.style.top = y;

    let topVals = document.createElement("tr")
    let midVals = document.createElement("tr")
    let botVals = document.createElement("tr")


    for(let i = 0; i < vals.length; ++i) {
        let valElement = document.createElement("td");
        valElement.innerText = vals[i];
        if(i < 3) {topVals.appendChild(valElement);}
        else if (i < 5) {
			midVals.appendChild(valElement);
			if(i == 3) { midVals.appendChild(document.createElement("td")); }
		}
        else {botVals.appendChild(valElement);}
    }
    
    circle.appendChild(topVals);
    circle.appendChild(midVals);
    circle.appendChild(botVals);

    addListener(circle, vals);

    return circle;
}

function drawLines(outerRadius, innerRadius) {

    let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const svgSize = 100;
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);

    svg.line = (x1, y1, x2, y2, addClass) => {
        //console.log(`Typeof x1 ${typeof(x1)} Typeof x2 ${typeof(x2)} Typeof y1 ${typeof(y1)} Typeof y2 ${typeof(y2)}`)
        //console.log(`Valueof x1 ${x1} Valueof x2 ${x2} Valueof y1 ${y1} Valueof y2 ${y2}`)

        let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        if(typeof(addClass) !== 'undefined') newLine.classList.add(addClass);
        newLine.setAttribute('x1',x1 + "%");
        newLine.setAttribute('y1',y1 + "%");
        newLine.setAttribute('x2',x2 + "%");
        newLine.setAttribute('y2',y2 + "%");
        newLine.setAttribute("stroke", "black")
        svg.append(newLine);
    };


    //if connecting an inner and outer circle pass addClass1 as inner, and addClass2 as outer
    const circleLine = (i1, i2, numInner, numOuter, innerRadius, outerRadius, type1, type2) => {
        const pos1 = circlePos(i1, numInner, numOuter, innerRadius, outerRadius, type1);
        const pos2 = circlePos(i2, numInner, numOuter, innerRadius, outerRadius, type2);
        svg.line(svgSize/2 + pos1[0], svgSize/2 + pos1[1], svgSize/2 + pos2[0],  svgSize/2 + pos2[1], type2);
    };

    let numInner = 5;
    let numOuter = 4;
    for(let i = 0; i < numInner; i++) {
        for(let j = 0; j<numOuter; j++){
        circleLine(i, i*numOuter + j, numInner, numOuter, innerRadius, outerRadius, "inner", "outer");
        }
    }

    for (let i = 0; i < numInner; i++) {
        for (let j = i+1; j < numInner; j ++) {
            circleLine(i, j, numInner, numOuter, innerRadius, outerRadius, "inner", "inner");
        }
    }

    
    // svg.line(svgSize/2 + circlePos(), svgSize/2 - outerRadius, svgSize/2,  svgSize/2 + outerRadius);
    
    return svg;
}


function solve() {

    addBases(tbases);
    return;


    reset();


    let circles = boardContainer.querySelectorAll(".board .circle");
    [[0,7], [1,10], [2,13], [3,16], [4,11], [5,14], [6,17], [8,15], [9,18], [12,19]].forEach(pair => {
        if(Math.random() >= 0.5) {
            circles[pair[0]].click();
        }else {
            circles[pair[1]].click();
        }
    });

    for(let i = 0; i < 5; i++) {
        if(document.getElementsByClassName("ray " + ((i * 8) + 1))[0].classList.contains("odd")){
            circles[[20, 21, 22, 23, 24][i]].click();
        }
    }

}
