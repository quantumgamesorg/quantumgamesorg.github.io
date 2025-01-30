"use strict";

let content = document.getElementById("content");

let boardContainer = document.getElementById("boardContainer");
const defaultBoardContainerSize = { width: parseInt(getComputedStyle(boardContainer).width), height: parseInt(getComputedStyle(boardContainer).height) };

let circleMap = [];
boardContainer.appendChild(makeBoard(45));
buildScoreboard(8,3)

document.querySelectorAll(".person").forEach((e, i) => {
    e.onmouseenter = ev => {
        document.querySelectorAll(".personDesc")[Math.floor(i / 3)].classList.toggle("highlight", true);
    };
    e.onmouseleave = ev => {
        document.querySelectorAll(".personDesc")[Math.floor(i / 3)].classList.toggle("highlight", false);
    };
});

function makeBoard(outerRadius) {
    const innerRadius = outerRadius * 0.4;
    const outerVals = [ [ 1, 2, 15, 16 ], [ 9, 11, 18, 19 ], [ 2, 3, 21, 22 ], [ 6, 8, 17, 19 ], [ 11, 12, 14, 15 ], [ 1, 3, 17, 18 ], [ 9, 12, 22, 23 ], [ 5, 6, 14, 16 ], [ 10, 12, 17, 20 ], [ 3, 4, 13, 14 ], [ 6, 7, 22, 24 ], [ 9, 10, 13, 16 ], [ 5, 7, 18, 20 ], [ 1, 4, 23, 24 ], [ 7, 8, 13, 15 ], [ 10, 11, 21, 24 ], [ 2, 4, 19, 20 ], [ 5, 8, 21, 23 ] ];
    const innerVals = [ [ 1, 2, 3, 4 ], [ 17, 18, 19, 20 ], [ 9, 10, 11, 12 ], [ 13, 14, 15, 16 ], [ 5, 6, 7, 8 ], [ 21, 22, 23, 24 ] ];

    let board = document.createElement("div");
    board.classList.add("board");

    circleMap = [];

    for(let i = 0; i < outerVals.length; i++) {
        const vals = outerVals[i];
        const thru = i / outerVals.length * (2 * Math.PI);

        let circle = makeCircle(vals, "calc(50% + " + (outerRadius * Math.sin(thru)) + "%)", "calc(50% + " + (outerRadius * -Math.cos(thru)) + "%)");
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
        const thru = i / innerVals.length * (2 * Math.PI);

        let circle = makeCircle(vals, "calc(50% + " + (innerRadius * Math.sin(thru)) + "%)", "calc(50% + " + (innerRadius * -Math.cos(thru)) + "%)");
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

function makeCircle(vals, x, y) {
    let circle = document.createElement("div");
    circle.classList.add("circle");

    circle.style.left = x;
    circle.style.top = y;

    vals.forEach(v => {
        let valElement = document.createElement("div");
        valElement.innerText = v;
        valElement.classList.add("value");
        circle.appendChild(valElement);
    });

    addListener(circle, vals);

    return circle;
}

function drawLines(outerRadius, innerRadius) {

    let svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    const svgSize = 100;
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);

    svg.line = (x1, y1, x2, y2, addClass) => {
        let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        if(typeof(addClass) !== 'undefined') newLine.classList.add(addClass);
        newLine.setAttribute('x1',x1 + "%");
        newLine.setAttribute('y1',y1 + "%");
        newLine.setAttribute('x2',x2 + "%");
        newLine.setAttribute('y2',y2 + "%");
        newLine.setAttribute("stroke", "black")
        svg.append(newLine);
    };

    const circlePos = (i, n, radius) => {
        const thru = i/n * 2 * Math.PI;
        return [(radius * Math.sin(thru)), (radius * -Math.cos(thru))]
    };

    const circleLine = (i1, i2, n, radius, addClass) => {
        const pos1 = circlePos(i1, n, radius);
        const pos2 = circlePos(i2, n, radius);
        svg.line(svgSize/2 + pos1[0], svgSize/2 + pos1[1], svgSize/2 + pos2[0],  svgSize/2 + pos2[1], addClass);
    };

    for(let i = 0; i < 3; i++) {
        const numOuter = 18;
        const wrap = n => (n + i * 3) % numOuter;
        circleLine(wrap(17), wrap(10), numOuter, outerRadius);
        circleLine(wrap(0),  wrap(9),  numOuter, outerRadius);
        circleLine(wrap(1),  wrap(8),  numOuter, outerRadius);
    }

    circleLine(0, 2, 6, innerRadius, "inner");
    circleLine(2, 4, 6, innerRadius, "inner");
    circleLine(4, 0, 6, innerRadius, "inner");
    circleLine(1, 3, 6, innerRadius, "inner");
    circleLine(3, 5, 6, innerRadius, "inner");
    circleLine(5, 1, 6, innerRadius, "inner");
    
    // svg.line(svgSize/2 + circlePos(), svgSize/2 - outerRadius, svgSize/2,  svgSize/2 + outerRadius);
    
    return svg;
}

function solve() {
    reset();

    let circles = boardContainer.querySelectorAll(".board .circle");
    [[17,10], [0,9], [1,8], [2,13], [3,12], [4,11], [5,16], [6,15], [7,14]].forEach(pair => {
        if(Math.random() >= 0.5) {
            circles[pair[0]].click();
        }else {
            circles[pair[1]].click();
        }
    });

    for(let i = 0; i < 6; i++) {
        if(document.getElementsByClassName("ray " + ((i * 4) + 1))[0].classList.contains("odd")){
            circles[[18, 22, 20, 21, 19, 23][i]].click();
        }
    }

}