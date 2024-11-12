"use strict";

let content = document.getElementById("content");

let boardContainer = document.getElementById("boardContainer");
const defaultBoardContainerSize = { width: parseInt(getComputedStyle(boardContainer).width), height: parseInt(getComputedStyle(boardContainer).height) };


let points = [];
let allLines = [];
let bases = [];

let oldBasesToNewBases = {"1    2    3    4":   [     1 ,  12  , 51  , 52], 
    "5    6    7    8":   [    59 ,  14  , 25  , 40], 
    "9   10   11   12":   [    24 ,  26  , 36  , 44], 
    "13   14   15   16":   [    37 ,  58  , 10  , 28], 
    "17   18   19   20":   [    15 ,  48  , 18  , 42], 
    "21   22   23   24":   [    53 ,  23  ,  5  , 32], 
    "25   26   27   28":   [    39 ,  19  , 31  , 21], 
    "29   30   31   32":   [    46 ,   7  , 47  , 11], 
    "33   34   35   36":   [     9 ,  20  , 54  , 35], 
    "37   38   39   40":   [     8 ,  27  , 33  , 50], 
    "41   42   43   44":   [    22 ,  43  ,  3  , 60], 
    "45   46   47   48":   [    55 ,  17  , 13  , 38], 
    "49   50   51   52":   [    57 ,  56  ,  2  ,  6], 
    "53   54   55   56":   [    30 ,  45  , 49  ,  4], 
    "57   58   59   60":   [    16 ,  29  , 34  , 41], 
    "31   42   51   16":   [    47 ,  43  ,  2  , 28], 
    "38   24   58   25":   [    27 ,  32  , 29  , 39], 
    "56   45   17   35":   [     4 ,  55  , 15  , 54], 
    "43   54    3   28":   [     3 ,  45  , 51  , 21], 
    "50   36   10   37":   [    56 ,  35  , 26  ,  8], 
    "8   57   29   47":   [    40 ,  16  , 46  , 13], 
    "55    6   15   40":   [    49 ,  14  , 10  , 50], 
    "2   48   22   49":   [    12 ,  38  , 23  , 57], 
    "20    9   41   59":   [    42 ,  24  , 22  , 34], 
    "7   18   27   52":   [    25 ,  48  , 31  ,  6], 
    "14   60   34    1":   [    58 ,  41  , 20  ,  1], 
    "32   21   53   11":   [    11 ,  53  , 30  , 36], 
    "19   30   39    4":   [    18 ,   7  , 33  , 52], 
    "26   12   46   13":   [    19 ,  44  , 17  , 37], 
    "44   33    5   23":   [    60 ,   9  , 59  ,  5], 
    "22   60   39   28":   [    23 ,  41  , 33  , 21], 
    "18   47   33   55":   [    48 ,  13  ,  9  , 49], 
    "13   32   50   41":   [    37 ,  11  , 56  , 22], 
    "34   12   51   40":   [    20 ,  44  ,  2  , 50], 
    "30   59   45    7":   [     7 ,  34  , 55  , 25], 
    "25   44    2   53":   [    39 ,  60  , 12  , 30], 
    "46   24    3   52":   [    17 ,  32  , 51  ,  6], 
    "42   11   57   19":   [    43 ,  36  , 16  , 18], 
    "37   56   14    5":   [     8 ,   4  , 58  , 59], 
    "58   36   15    4":   [    29 ,  35  , 10  , 52], 
    "54   23    9   31":   [    45 ,   5  , 24  , 47], 
    "49    8   26   17":   [    57 ,  40  , 19  , 15], 
    "10   48   27   16":   [    26 ,  38  , 31  , 28], 
    "6   35   21   43":   [    14 ,  54  , 53  ,  3], 
    "1   20   38   29":   [     1 ,  42  , 27  , 46], 
    "57   23   27   40":   [    16 ,   5  , 31  , 50], 
    "36   53   20   46":   [    35 ,  30  , 42  , 17], 
    "43   49   30   14":   [     3 ,  57  ,  7  , 58], 
    "9   35   39   52":   [    24 ,  54  , 33  ,  6], 
    "48    5   32   58":   [    38 ,  59  , 11  , 29], 
    "55    1   42   26":   [    49 ,   1  , 43  , 19], 
    "21   47   51    4":   [    53 ,  13  ,  2  , 52], 
    "60   17   44   10":   [    41 ,  15  , 60  , 26], 
    "7   13   54   38":   [    25 ,  37  , 45  , 27], 
    "33   59    3   16":   [     9 ,  34  , 51  , 28], 
    "12   29   56   22":   [    44 ,  46  ,  4  , 23], 
    "19   25    6   50":   [    18 ,  39  , 14  , 56], 
    "45   11   15   28":   [    55 ,  36  , 10  , 21], 
    "24   41    8   34":   [    32 ,  22  , 40  , 20], 
    "31   37   18    2":   [    47 ,   8  , 48  , 12], 
    "44   29   15   52":   [    60 ,  46  , 10  ,  6], 
    "59   26   37   21":   [    34 ,  19  ,  8  , 53], 
    "34   19   48   54":   [    20 ,  18  , 38  , 45], 
    "56   41   27    4":   [     4 ,  22  , 31  , 52], 
    "11   38   49   33":   [    36 ,  27  , 57  ,  9], 
    "46   31   60    6":   [    17 ,  47  , 41  , 14], 
    "8   53   39   16":   [    40 ,  30  , 33  , 28], 
    "23   50    1   45":   [     5 ,  56  ,  1  , 55], 
    "58   43   12   18":   [    29 ,   3  , 44  , 48], 
    "20    5   51   28":   [    42 ,  59  ,  2  , 21], 
    "35    2   13   57":   [    54 ,  12  , 37  , 16], 
    "10   55   24   30":   [    26 ,  49  , 32  ,  7], 
    "32   17    3   40":   [    11 ,  15  , 51  , 50], 
    "47   14   25    9":   [    13 ,  58  , 39  , 24], 
    "22    7   36   42":   [    23 ,  25  , 35  , 43]};

let blackLineWidth = "0.1%";
let redLineWidth = "0.2%";


let circleMap = [];
boardContainer.appendChild(makeCircleBoard(45));

buildScoreboard(8, 5);

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
        lines: [],
        update: () => {
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
    line.setAttribute("stroke", "black");
    line.setAttribute("stroke-width", blackLineWidth);
    return {
        sInd: startInd,
        eInd: endInd,
        element: line,
        makeBlack: () => {
            line.setAttribute("stroke", "black");
            line.setAttribute("stroke-width", blackLineWidth);
        },
        makeRed: () => {
            line.setAttribute("stroke", "red");
            line.setAttribute("stroke-width", redLineWidth);
        }
    };
}

function makeRing(root, radius, startingAngle, angleInterval) {
    radius *= 45;
    let count = 15;
    for (let i = 0; i < count; i++) {
        let angle = startingAngle + angleInterval * i;
        //angle += 24;
        let angleRads = Math.PI * angle / 180.0;
        let x = Math.cos(angleRads) * radius + 50;
        let y = Math.sin(angleRads) * radius + 50;

        let newPt = makePoint(x, y, 1);
        root.appendChild(newPt.element);
        points.push(newPt);
    }
}

function addLine(startInd, endInd, svg) {
    let line = makeLine(startInd, endInd);
    svg.appendChild(line.element);
    let lineInd = allLines.length;
    allLines.push(line);
    points[line.sInd].lines.push(lineInd);
    points[line.eInd].lines.push(lineInd);
}

function addBasis(arr, svg) {
    for (let i = 0; i < arr.length - 1; i++) {
        addLine(arr[i] - 1, arr[i + 1] - 1, svg);
    }
    addLine(arr[arr.length - 1] - 1, arr[0] - 1, svg);
}

function addBases(arr, svg) {
    for (let i = 0; i < arr.length; i++) {
        addBasis(arr[i], svg);
    }
}

function findDirLine(sInd, eInd) {
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
    console.log("" + a + " " + b);
    allLines[findLine(a, b)].makeRed();
}

function makeBasisRed(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        makeLineRed(arr[i] - 1, arr[i + 1] - 1);
    }
    makeLineRed(arr[arr.length - 1], 0);
}

function makeBasesRed(arrs) {
    for (let i = 0; i < arrs.length; i++) {
        makeBasisRed(arrs[i]);
    }
}

function makeOldBasesRed(arr) {
    for (let i = 0; i < arr.length; i++) {
        makeBasisRed(oldBasisToNewBasis(arr[i]));
    }
}

function oldBasisToNewBasis(oldBasis) {
    return oldBasesToNewBases[oldBasis];
}

function makeTriacontagonalProjection(outerRadius) {
    let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const svgSize = 100;
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);
    svg.setAttribute("viewBox", "0 0 100 100")
    
    makeRing(svg, 1.0, 0, 24);
    makeRing(svg, 0.8135, 6, 24);
    makeRing(svg, 0.6728, 6, 24);
    makeRing(svg, 0.3383, 0, 24);

    addBases(    [ [  1,  12,  51 , 52 ],
        [ 59,  14,  25 , 40 ],
        [ 24,  26,  36 , 44 ],
        [ 37,  58,  10 , 28 ],
        [ 15,  48,  18 , 42 ],
        [ 53,  23,   5 , 32 ],
        [ 39,  19,  31 , 21 ],
        [ 46,   7,  47 , 11 ],
        [  9,  20,  54 , 35 ],
       [  8,  27,  33 , 50 ],
       [ 22,  43,   3 , 60 ],
       [ 55,  17,  13 , 38 ],
       [ 57,  56,   2 ,  6 ],
       [ 30,  45,  49 ,  4 ],
       [ 16,  29,  34 , 41 ],
       [ 47,  43,   2 , 28 ],
       [ 27,  32,  29 , 39 ],
       [  4,  55,  15 , 54 ],
       [  3,  45,  51 , 21 ],
       [ 56,  35,  26 ,  8 ],
       [ 40,  16,  46 , 13 ],
       [ 49,  14,  10 , 50 ],
       [ 12,  38,  23 , 57 ],
       [ 42,  24,  22 , 34 ],
       [ 25,  48,  31 ,  6 ],
       [ 58,  41,  20 ,  1 ],
       [ 11,  53,  30 , 36 ],
       [ 18,   7,  33 , 52 ],
       [ 19,  44,  17 , 37 ],
       [ 60,   9,  59 ,  5 ],
       [ 23,  41,  33 , 21 ],
       [ 48,  13,   9 , 49 ],
       [ 37,  11,  56 , 22 ],
       [ 20,  44,   2 , 50 ],
       [  7,  34,  55 , 25 ],
       [ 39,  60,  12 , 30 ],
       [ 17,  32,  51 ,  6 ],
       [ 43,  36,  16 , 18 ],
       [  8,   4,  58 , 59 ],
       [ 29,  35,  10 , 52 ],
       [ 45,   5,  24 , 47 ],
       [ 57,  40,  19 , 15 ],
       [ 26,  38,  31 , 28 ],
       [ 14,  54,  53 ,  3 ],
       [  1,  42,  27 , 46 ],
       [ 16,   5,  31 , 50 ],
       [ 35,  30,  42 , 17 ],
       [  3,  57,   7 , 58 ],
       [ 24,  54,  33 ,  6 ],
       [ 38,  59,  11 , 29 ],
       [ 49,   1,  43 , 19 ],
       [ 53,  13,   2 , 52 ],
       [ 41,  15,  60 , 26 ],
       [ 25,  37,  45 , 27 ],
       [  9,  34,  51 , 28 ],
       [ 44,  46,   4 , 23 ],
       [ 18,  39,  14 , 56 ],
       [ 55,  36,  10 , 21 ],
       [ 32,  22,  40 , 20 ],
       [ 47,   8,  48 , 12 ],
       [ 60,  46,  10 ,  6 ],
       [ 34,  19,   8 , 53 ],
       [ 20,  18,  38 , 45 ],
       [  4,  22,  31 , 52 ],
       [ 36,  27,  57 ,  9 ],
       [ 17,  47,  41 , 14 ],
       [ 40,  30,  33 , 28 ],
       [  5,  56,   1 , 55 ],
       [ 29,   3,  44 , 48 ],
       [ 42,  59,   2 , 21 ],
       [ 54,  12,  37 , 16 ],
       [ 26,  49,  32 ,  7 ],
       [ 11,  15,  51 , 50 ],
       [ 13,  58,  39 , 24 ],
       [ 23,  25,  35 , 43 ],
       ], svg);

    return svg;
}

function makePlotARed() {
    makeOldBasesRed(["1     5    55    56",
        "1    12    51    52",
        "2     6    56    57",
        "2    13    52    53",
        "3     7    57    58",
        "3    14    53    54",
        "4     8    58    59",
        "4    15    54    55",
        "5     9    59    60",
        "6    10    46    60",
        "7    11    46    47",
        "8    12    47    48",
        "9    13    48    49",
        "10    14    49    50",
        "11    15    50    51"]);
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