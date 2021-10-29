"use strict";

let content = document.getElementById("content");

let boardContainer = document.getElementById("boardContainer");
const defaultBoardContainerSize = { width: parseInt(getComputedStyle(boardContainer).width), height: parseInt(getComputedStyle(boardContainer).height) };

let circleMap = [];
boardContainer.appendChild(makeBoard(45));

document.querySelectorAll("#upperLeft button")[0].onclick = () => reset();
document.querySelectorAll("#upperLeft button")[1].onclick = () => solve();
document.querySelectorAll("#upperLeft button")[2].onclick = () => document.querySelector("#win_about").classList.toggle("hidden");
document.querySelectorAll("#upperLeft button")[3].onclick = () => document.querySelector("#win_rules").classList.toggle("hidden");
document.querySelectorAll("#upperLeft button")[4].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > hr")[1].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
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

function makeBoard(outerRadius) {
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
        const thru = Math.floor(i/(outerVals.length / innerVals.length)) / innerVals.length * (2 * Math.PI);
        const thru2 = (i % (outerVals.length / innerVals.length) + 0.5) / (outerVals.length / innerVals.length) * (2 * Math.PI / 2.5) - (2 * Math.PI / 2.5)/2;

        let bx = (innerRadius * Math.sin(thru));
        let by = (innerRadius * -Math.cos(thru));

        let circle = makeCircle(vals, "calc(50% + " + (bx + ((outerRadius - innerRadius) * Math.sin(thru2 + thru))) + "%)", "calc(50% + " + (by + ((outerRadius - innerRadius) * -Math.cos(thru2 + thru))) + "%)");
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

    boardContainer.querySelectorAll(".scoreboard .entry").forEach((el, i) => {
        el.onmouseenter = () => {
            circleMap[i + 1].forEach(c => c.classList.add("highlight"));
        };

        el.onmouseleave = () => {
            circleMap[i + 1].forEach(c => c.classList.remove("highlight"));
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

    circle.onclick = () => {
        if(circle.classList.toggle("selected")) {
            addValues(vals);
        } else {
            removeValues(vals);
        }
    };

    circle.onmouseenter = () => {
        vals.forEach(v => {
            boardContainer.querySelector(".scoreboard").children[v - 1].classList.add("highlight");
        });
    };

    circle.onmouseleave = () => {
        vals.forEach(v => {
            boardContainer.querySelector(".scoreboard").children[v - 1].classList.remove("highlight");
        });
    };

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
        
        if(typeof(n) === 'object'){
            const thru = Math.floor(i/(n[1] / n[0])) / n[0] * (2 * Math.PI);
            const thru2 = (i % (n[1] / n[0]) + 0.5) / (n[1] / n[0]) * (2 * Math.PI / 2.5) - (2 * Math.PI / 2.5)/2;
    
            let bx = (innerRadius * Math.sin(thru));
            let by = (innerRadius * -Math.cos(thru));
            
            return [(bx + ((outerRadius - innerRadius) * Math.sin(thru2 + thru))), (by + ((outerRadius - innerRadius) * -Math.cos(thru2 + thru)))]
        }else{
            const thru = i/n * 2 * Math.PI;
            return [(radius * Math.sin(thru)), (radius * -Math.cos(thru))]
        }
    };

    const circleLine = (i1, i2, n, radius, addClass) => {
        const pos1 = circlePos(i1, n, radius);
        const pos2 = circlePos(i2, n, radius);
        svg.line(svgSize/2 + pos1[0], svgSize/2 + pos1[1], svgSize/2 + pos2[0],  svgSize/2 + pos2[1], addClass);
    };

    for(let i = 0; i < 5; i++) {
        const numOuter = 4 * 5;
        const wrap = n => (n + i * 4) % numOuter;
        circleLine(wrap(0), wrap(7), [5, 5*4], outerRadius);
        circleLine(wrap(1), wrap(10), [5, 5*4], outerRadius);
    }

    circleLine(0, 1, 5, innerRadius, "inner");
    circleLine(1, 2, 5, innerRadius, "inner");
    circleLine(2, 3, 5, innerRadius, "inner");
    circleLine(3, 4, 5, innerRadius, "inner");
    circleLine(4, 0, 5, innerRadius, "inner");
    circleLine(0, 2, 5, innerRadius, "inner");
    circleLine(2, 4, 5, innerRadius, "inner");
    circleLine(4, 1, 5, innerRadius, "inner");
    circleLine(1, 3, 5, innerRadius, "inner");
    circleLine(3, 0, 5, innerRadius, "inner");
    
    // svg.line(svgSize/2 + circlePos(), svgSize/2 - outerRadius, svgSize/2,  svgSize/2 + outerRadius);
    
    return svg;
}

function addValues(values) {
    values.forEach(v => {
        let entry = boardContainer.querySelector(".scoreboard").children[v - 1];
        let current = entry.children[1].innerText;
        let current_n = parseInt(current.substr(1, current.length-2));

        current_n++;
        entry.children[1].innerText = "(" + current_n + ")";

        entry.classList.toggle("even", current_n % 2 == 0 && current_n > 0);
        entry.classList.toggle("odd", current_n % 2 == 1 && current_n > 0);
    });
    checkWon();
}

function removeValues(values) {
    values.forEach(v => {
        let entry = boardContainer.querySelector(".scoreboard").children[v - 1];
        let current = entry.children[1].innerText;
        let current_n = parseInt(current.substr(1, current.length-2));

        current_n--;
        entry.children[1].innerText = "(" + current_n + ")";

        entry.classList.toggle("even", current_n % 2 == 0 && current_n > 0);
        entry.classList.toggle("odd", current_n % 2 == 1 && current_n > 0);
    });
    checkWon();
}

function checkWon() {
    const allEven = Array.prototype.slice.call(boardContainer.querySelector(".scoreboard").children).every(e => !e.classList.contains("odd"));
    const numTurns = boardContainer.querySelectorAll(".board .circle.selected").length;

    boardContainer.querySelector(".moveCounter .inner").innerText = numTurns;
    boardContainer.querySelector(".moveCounter").classList.toggle("even", numTurns % 2 == 0 && numTurns > 0);
    boardContainer.querySelector(".moveCounter").classList.toggle("odd", numTurns % 2 == 1 && numTurns > 0);

    const won = allEven && numTurns % 2 == 1;
    boardContainer.classList.toggle("won", won);

    document.querySelector("#does").classList.toggle("won", won);
}

function reset() {
    Array.prototype.slice.call(boardContainer.querySelectorAll(".scoreboard .entry")).forEach(e => {
        e.children[1].innerText = "(0)";
        e.classList.remove("even");
        e.classList.remove("odd");
    });

    Array.prototype.slice.call(boardContainer.querySelectorAll(".board .circle")).forEach(e => {
        e.classList.remove("selected");
    });

    boardContainer.querySelector(".moveCounter .inner").innerText = "0";
    boardContainer.querySelector(".moveCounter").classList.remove("even");
    boardContainer.querySelector(".moveCounter").classList.remove("odd");

    boardContainer.classList.remove("won");
    document.querySelector("#does").classList.remove("won");
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

    let score = boardContainer.querySelectorAll(".scoreboard .entry");
    for(let i = 0; i < 6; i++) {
        if(score[i * 4].classList.contains("odd")){
            circles[[18, 22, 20, 21, 19, 23][i]].click();
        }
    }

}