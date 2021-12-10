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
    const vals = [
        [1, 2, 3, 4, 31, 42, 51, 16, 22, 60, 39, 28, 57, 23, 27, 40, 44, 29, 15, 52],
        [5, 6, 7, 8, 38, 24, 58, 25, 18, 47, 33, 55, 36, 53, 20, 46, 59, 26, 37, 21],
        [9, 10, 11, 12, 56, 45, 17, 35, 13, 32, 50, 41, 43, 49, 30, 14, 34, 19, 48, 54],
        [13, 14, 15, 16, 43, 54, 3, 28, 34, 12, 51, 40, 9, 35, 39, 52, 56, 41, 27, 4],
        [17, 18, 19, 20, 50, 36, 10, 37, 30, 59, 45, 7, 48, 5, 32, 58, 11, 38, 49, 33],
        [21, 22, 23, 24, 8, 57, 29, 47, 25, 44, 2, 53, 55, 1, 42, 26, 46, 31, 60, 6],
        [25, 26, 27, 28, 55, 6, 15, 40, 46, 24, 3, 52, 21, 47, 51, 4, 8, 53, 39, 16],
        [29, 30, 31, 32, 2, 48, 22, 49, 42, 11, 57, 19, 60, 17, 44, 10, 23, 50, 1, 45],
        [33, 34, 35, 36, 20, 9, 41, 59, 37, 56, 14, 5, 7, 13, 54, 38, 58, 43, 12, 18],
        [37, 38, 39, 40, 7, 18, 27, 52, 58, 36, 15, 4, 33, 59, 3, 16, 20, 5, 51, 28],
        [41, 42, 43, 44, 14, 60, 34, 1, 54, 23, 9, 31, 12, 29, 56, 22, 35, 2, 13, 57],
        [45, 46, 47, 48, 32, 21, 53, 11, 49, 8, 26, 17, 19, 25, 6, 50, 10, 55, 24, 30],
        [49, 50, 51, 52, 19, 30, 39, 4, 10, 48, 27, 16, 45, 11, 15, 28, 32, 17, 3, 40],
        [53, 54, 55, 56, 26, 12, 46, 13, 6, 35, 21, 43, 24, 41, 8, 34, 47, 14, 25, 9],
        [57, 58, 59, 60, 44, 33, 5, 23, 1, 20, 38, 29, 31, 37, 18, 2, 22, 7, 36, 42]
    ];

    let board = document.createElement("div");
    board.classList.add("board");

    for(let gy = 0; gy < 5; gy++) {

        let gridRow = document.createElement("div");
        gridRow.classList.add("gridRow");

        for(let gx = 0; gx < 5; gx++) {
            let gridSpot = document.createElement("div");
            gridSpot.classList.add("gridSpot");

            for(let y = 0; y < 3; y++) {
        
                let basis = document.createElement("div");
                basis.classList.add("basis");
        
                for(let x = 0; x < 4; x++) {
                    let val = vals[y + gy * 3][x + gx * 4];
        
                    let val_el = document.createElement("div");
                    val_el.classList.add("val");
        
                    val_el.innerText = val;

                    val_el.onclick = e => {
                        val_el.parentElement.classList.toggle("selected");
                    };

                    val_el.onmouseenter = e => {
                        [...document.querySelectorAll(".basis .val")].filter(e => e.innerText == "" + val).forEach(e => {
                            if(e !== val_el) {
                                e.classList.toggle("hover", true);
                            }
                        });
                    };

                    val_el.onmouseleave = e => {
                        [...document.querySelectorAll(".basis .val")].filter(e => e.innerText == "" + val).forEach(e => {
                            if(e !== val_el) {
                                e.classList.toggle("hover", false);
                            }
                        });
                    };
        
                    basis.appendChild(val_el);
                }
        
                gridSpot.appendChild(basis);
            }

            gridRow.appendChild(gridSpot);
        }

        board.appendChild(gridRow);
    }

    document.querySelectorAll(".scoreboard .entry").forEach((el, i) => {
        el.onmouseenter = () => {
            circleMap[i + 1].forEach(c => c.classList.add("highlight"));
        };

        el.onmouseleave = () => {
            circleMap[i + 1].forEach(c => c.classList.remove("highlight"));
        };
    })

    return board;
}

function circlePos (index, numInner, numOuter, innerRadius, outerRadius, type) {
    let innerXOffset = 1;
    let innerYOffset = 1;
    console.log(`[circlePos]: Received index ${index}, numInner ${numInner}, numOuter ${numOuter}, innerRadius ${innerRadius}, outerRadius ${outerRadius}, type ${type}`)
    if(type === 'outer'){
        let spread = 2.5;
        const angleRelativeToCenter = Math.floor(index/numOuter) * 2 * Math.PI / numInner;
        
        const alignTerm = ((numOuter - 1)/numOuter * spread) / 2;
        const angleRelativeToInnerCircle = ((index % numOuter) * spread / numOuter) - alignTerm;

        console.log(`Index: ${index} Index/Outer = ${index/numOuter} Num outer ${numOuter}`)
        console.log(`Index: ${index} Center: ${angleRelativeToCenter * 360.0/Math.PI} Inner: ${angleRelativeToInnerCircle * 360.0/Math.PI}`)

        let baseX = (innerRadius * Math.sin(angleRelativeToCenter));
        let baseY = (innerRadius * -Math.cos(angleRelativeToCenter));

        const deltaR = outerRadius - innerRadius;
        let deltaBx =  deltaR * Math.sin(angleRelativeToCenter + angleRelativeToInnerCircle);
        let deltaBy = deltaR *-Math.cos(angleRelativeToCenter + angleRelativeToInnerCircle);

        var outerXOffset = 1.2;
        var outerYOffset = 1.2;
        // var outerXOffset = 1.17;
        // var outerYOffset = 0.91;
        
        console.log(`[circlePos]: Returning ${(baseX * innerXOffset + deltaBx * outerXOffset)}, ${(baseY  * innerYOffset + deltaBy * outerYOffset)}`)
        return [baseX * innerXOffset + deltaBx * outerXOffset, baseY  * innerYOffset + deltaBy * outerYOffset]
    }else{//type is inner
        const angleRelativeToCenter = index/numInner * 2 * Math.PI;
        let baseX = (innerRadius * Math.sin(angleRelativeToCenter))
        let baseY = (innerRadius * -Math.cos(angleRelativeToCenter))
        console.log(`[circlePos]: Returning ${baseX * innerXOffset}, ${baseY * innerYOffset}`)
        return [baseX * innerXOffset,  baseY * innerYOffset]
    }
};

function makeCircle(vals, x, y) {
    let circle = document.createElement("div");
    circle.classList.add("circle");

    circle.style.left = x;
    circle.style.top = y;

    let topVals = document.createElement("div")
    let midVals = document.createElement("div")
    let botVals = document.createElement("div")

    topVals.classList.add("topVals");
    midVals.classList.add("midVals");
    botVals.classList.add("bottomVals");

    topVals.classList.add("rowOfValues");
    midVals.classList.add("rowOfValues");
    botVals.classList.add("rowOfValues");


    for(let i = 0; i < vals.length; ++i) {
        let valElement = document.createElement("div");
        valElement.innerText = vals[i];
        valElement.classList.add("value");
        if(i < 2) {topVals.appendChild(valElement);}
        else if (i < 6) { midVals.appendChild(valElement);}
        else {botVals.appendChild(valElement);}
    }
    

    circle.appendChild(topVals);
    circle.appendChild(midVals);
    circle.appendChild(botVals);

    circle.onclick = () => {
        if(circle.classList.toggle("selected")) {
            addValues(vals);
        } else {
            removeValues(vals);
        }
    };

    circle.onmouseenter = () => {
        vals.forEach(v => {
            document.querySelector(".scoreboard").children[v - 1].classList.add("highlight");
        });
    };

    circle.onmouseleave = () => {
        vals.forEach(v => {
            document.querySelector(".scoreboard").children[v - 1].classList.remove("highlight");
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
        console.log(`Typeof x1 ${typeof(x1)} Typeof x2 ${typeof(x2)} Typeof y1 ${typeof(y1)} Typeof y2 ${typeof(y2)}`)
        console.log(`Valueof x1 ${x1} Valueof x2 ${x2} Valueof y1 ${y1} Valueof y2 ${y2}`)

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

function addValues(values) {
    values.forEach(v => {
        let entry = document.querySelector(".scoreboard").children[v - 1];
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
        let entry = document.querySelector(".scoreboard").children[v - 1];
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
    const allEven = Array.prototype.slice.call(document.querySelector(".scoreboard").children).every(e => !e.classList.contains("odd"));
    const numTurns = boardContainer.querySelectorAll(".board .circle.selected").length;

    boardContainer.querySelector(".moveCounter .inner").innerText = numTurns;
    boardContainer.querySelector(".moveCounter").classList.toggle("even", numTurns % 2 == 0 && numTurns > 0);
    boardContainer.querySelector(".moveCounter").classList.toggle("odd", numTurns % 2 == 1 && numTurns > 0);

    const won = allEven && numTurns % 2 == 1;
    boardContainer.classList.toggle("won", won);

    document.querySelector("#does").classList.toggle("won", won);
}

function reset() {
    Array.prototype.slice.call(document.querySelectorAll(".scoreboard .entry")).forEach(e => {
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
    [[0,7], [1,10], [2,13], [3,16], [4,11], [5,14], [6,17], [8,15], [9,18], [12,19]].forEach(pair => {
        if(Math.random() >= 0.5) {
            circles[pair[0]].click();
        }else {
            circles[pair[1]].click();
        }
    });

    let score = document.querySelectorAll(".scoreboard .entry");
    for(let i = 0; i < 5; i++) {
        if(score[i * 8].classList.contains("odd")){
            circles[[20, 21, 22, 23, 24][i]].click();
        }
    }

}