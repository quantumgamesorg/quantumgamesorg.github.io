"use strict";

var intervalID = 0;
var state = 0;

function startSimulation(e) {
    // state = 0;
    // document.getElementById("emmiter").style.backgroundColor = 'white';
    // clearDetectors();
    intervalID = window.setInterval(simulate, 1500);
    this.innerHTML = 'Pause'
    this.onclick = pauseSimulation;
    if(e !== undefined) e.stopImmediatePropagation();
}  

function pauseSimulation(e) {
    window.clearInterval(intervalID); 
    this.innerHTML = 'Resume'
    this.onclick = startSimulation;
    if(e !== undefined) e.stopImmediatePropagation();
}

function simulate() {
    switch (state) {
        case 0:
            toggleEmmiter();
            break;
        case 1:
            toggleDetectors();
            break;
        case 2:
            toggleEmmiter();
            break;
        case 3:
            clearDetectors();
            break;
    }
    state = (state+1) % 4; //the are 4 states
}

function toggleEmmiter() {
    let emmiter = document.getElementById("emmiter");
    if(emmiter.style.backgroundColor == "yellow") {
            emmiter.style.backgroundColor = "white";
    } else {
            emmiter.style.backgroundColor = "yellow";
    }
}

function clearDetectors() {
    let cells = document.querySelectorAll(".circle");
    for (let i = 0; i < cells.length; ++i) {
        cells[i].style.fill = 'white'
    }
}

function toggleDetectors() {
    let aliceLine = generateRandomLine();
    let aliceCircles = generateCirclesOnLine(aliceLine);
    //console.log(`Generated circles on line ${aliceLine} are ${aliceCircles}`)
    let bobLine = generateRandomLine();
    let bobCircles = generateCirclesOnLine(bobLine);
    //console.log(`Generated circles on line ${bobLine} are ${bobCircles}`)

    let intersection = calculateIntersection(aliceCircles, bobCircles);

    if (intersection.length === 1) {
        //start at intersection
        let numRedAlice = 0;
        let numRedBob = 0; 

        let intersectionColor = generateRandomColor();
        document.getElementById(`ac${intersection[0]}`).style.fill =  (intersectionColor ? 'red' : 'green');
        document.getElementById(`bc${intersection[0]}`).style.fill =  (intersectionColor ? 'red' : 'green');

        numRedAlice += intersectionColor;
        numRedBob += intersectionColor;

        //next randomly set all other circles except last one
        let numCirclesOnLine = 4;        
        
        let i;
        let aliceIndex = aliceCircles.indexOf(intersection[0]);
        let bobIndex = bobCircles.indexOf(intersection[0]);
        for (i = 1; i < numCirclesOnLine - 1; ++i) {
            aliceIndex = (aliceIndex + i) % numCirclesOnLine;
            let aliceColor = generateRandomColor();
            numRedAlice += aliceColor;

        
            bobIndex = (bobIndex + i) % numCirclesOnLine;
            let bobColor = generateRandomColor();
            numRedBob += bobColor;

            document.getElementById(`ac${aliceCircles[aliceIndex]}`).style.fill =  (aliceColor ? 'red' : 'green');
            document.getElementById(`bc${bobCircles[bobIndex]}`).style.fill =  (bobColor ? 'red' : 'green');
        }

        aliceIndex = (aliceIndex + i) % numCirclesOnLine;
        bobIndex = (bobIndex + i) % numCirclesOnLine;

        //finally set the last one so that number of green circles is odd
        document.getElementById(`ac${aliceCircles[aliceIndex]}`).style.fill =  (numRedAlice%2 ? 'green' : 'red');
        document.getElementById(`bc${bobCircles[bobIndex]}`).style.fill =  (numRedBob%2 ? 'green' : 'red');
    } else { //alice and bob have same line highlighted
        let numCirclesOnLine = 4;
        let numRed = 0;   
        let i;
        for (i = 0; i < numCirclesOnLine - 1; ++i) {
            let color = generateRandomColor();
            numRed += color;
            document.getElementById(`ac${aliceCircles[i]}`).style.fill =  (color ? 'red' : 'green');
            document.getElementById(`bc${bobCircles[i]}`).style.fill =  (color ? 'red' : 'green');
        }

        document.getElementById(`ac${aliceCircles[i]}`).style.fill =  (numRed%2 ? 'green' : 'red');
        document.getElementById(`bc${bobCircles[i]}`).style.fill =  (numRed%2 ? 'green' : 'red');
    }

    return [aliceLine, bobLine];
}

//this returns all circles which lie on line number lineNum
function generateCirclesOnLine(lineNum) {
    return [lineNum, lineNum + 5, 5 + (lineNum + 3)%5, (lineNum + 1)%5]
}

//finds intersection of 2 sets
function calculateIntersection(setA, setB) {
    let intersection = []
    for (let i = 0; i < setA.length; ++i) {
        for (let j = 0; j < setB.length; ++j) {
            if (setA[i] === setB[j]) {
                intersection.push(setA[i]);
            }
        }
    }
    return intersection;
}

function generateRandomLine() {
    let numLines = 5;
    return Math.floor(Math.random() * numLines);
}

function generateRandomColor() {
    let numColors = 2;
    return Math.floor(Math.random() * numColors)
}


function setupSimulation(svgSize) {
    let simulationContainer = document.createElement('div');
    simulationContainer.id = 'simulationContainer'

    //draw alice container
    let aliceContainer = document.createElement('div')
    aliceContainer.classList.add('detector');
    let aliceTitle = document.createElement('h1')
    aliceTitle.innerHTML = "Alice"
    aliceContainer.appendChild(aliceTitle);
    aliceContainer.appendChild(drawPentagram('a', svgSize));
    aliceContainer.setAttribute("width", `${svgSize}px`);
    aliceContainer.setAttribute("height", `${svgSize + 120}px`);
    simulationContainer.appendChild(aliceContainer);

    //draw emmiter
    let emmiter = document.createElement('div');
    emmiter.id = 'emmiter';
    simulationContainer.appendChild(emmiter);

    //draw bob
    let bobContainer = document.createElement('div')
    bobContainer.classList.add('detector');
    let bobTitle = document.createElement('h1')
    bobTitle.innerHTML = "Bob"
    bobContainer.appendChild(bobTitle);
    bobContainer.appendChild(drawPentagram('b', svgSize));
    bobContainer.setAttribute("width", `${svgSize}px`);
    bobContainer.setAttribute("height", `${svgSize + 120}px`);
    simulationContainer.appendChild(bobContainer);

    return simulationContainer;
}

function drawPentagram(aliceOrBob, svgSize) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', svgSize);
    svg.setAttribute('height', svgSize);

    svg.classList.add('pentagram');

    //circles don't fit, so we need to do some adjusting
    let scaledSize = 0.9 * svgSize;
    //draw lines
    for (let i = 0; i < 5; ++i) {
        let newLine = document.createElementNS('http://www.w3.org/2000/svg','line');
        newLine.id = `${aliceOrBob}l${i}`;
        newLine.classList.add('line');
        let coords = calculateLineCoords(scaledSize, i);
        newLine.setAttribute('x1',coords[0] + "px");
        newLine.setAttribute('y1',coords[1] + "px");
        newLine.setAttribute('x2',coords[2] + "px");
        newLine.setAttribute('y2',coords[3] + "px");
        newLine.setAttribute("stroke", "black")
        svg.append(newLine);
    }

    //draw circles
    for (let i = 0; i < 10; ++i) {
        let newCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
        newCircle.id = `${aliceOrBob}c${i}`;
        newCircle.classList.add('circle');
        let coords = getPentagramPointCoords(scaledSize, i);
        newCircle.setAttribute('cx', coords[0] + "px");
        newCircle.setAttribute('cy', coords[1] + "px");
        newCircle.setAttribute('r', "10px");
        newCircle.setAttribute("stroke", "black")
        newCircle.setAttribute("fill", "white")
        svg.append(newCircle);
    }

    return svg;
}

function calculateLineCoords(svgSize, i) {
    let pointA = getPentagramPointCoords(svgSize, i);
    let pointB = getPentagramPointCoords(svgSize, (i+1)%5);

    return ([pointA[0], pointA[1], pointB[0], pointB[1]]);
}

function getPentagramPointCoords(svgSize, i) {
    let x, y = 0;
    //this is 360 degrees in radians ... just for quicker code
    const rad = 2 * Math.PI;
    //this is the side length of the pentagram
    let a = Math.sqrt(Math.pow(svgSize, 2)  / (2 - 2*Math.cos(rad * 0.3)))
    //this is the length of a specific line segment
    let b = Math.sqrt(Math.pow(svgSize, 2)  / Math.pow((2 - 2*Math.cos(rad * 0.3)),2))
    //this is the length of another specific line segment
    let c = svgSize - 2 * b;
    //explanation: 2b + c is the length of a single diagonal
    switch (i) {
        case 0:
            x = a * Math.sin(rad * 0.05);
            y = svgSize;
            break;
        case 1:
            x = svgSize / 2;
            y = svgSize - svgSize * Math.sin(rad * 0.2);
            break;
        case 2:
            x = svgSize - (a * Math.sin(rad * 0.05));
            y = svgSize;
            break;
        case 3:
            x = 0;
            y = svgSize - (a * Math.sin(rad * 0.2));
            break;
        case 4:
            x = svgSize;
            y = svgSize - (a * Math.sin(rad * 0.2));
            break;
        case 5:
            x = a * Math.sin(rad * 0.05) + b * Math.cos(rad * 0.2);
            y = svgSize - b * Math.sin(rad * 0.2);
            break;
        case 6:
            x = b + c;
            y = svgSize - (a * Math.sin(rad * 0.2));
            break;
        case 7: 
            x = svgSize / 2;
            y = svgSize - (b * Math.sin(rad * 0.1));
            break;
        case 8: 
            x = a * Math.sin(rad * 0.05) + (b + c) * Math.cos(rad * 0.2);
            y = svgSize - (b + c) * Math.sin(rad * 0.2);
            break;
        case 9:
            x =  svgSize - (a * Math.sin(rad * 0.05) + b * Math.cos(rad * 0.2));
            y = svgSize - b * Math.sin(rad * 0.2);
            break;
        default:
            null;
        }
    let xPadding = svgSize * 0.05;
    return [x + xPadding, y];
}

window.onload = () => {
    let content = document.getElementById("content");

    let boardContainer = document.getElementById("boardContainer");
    //const defaultBoardContainerSize = { width: parseInt(getComputedStyle(boardContainer).width), height: parseInt(getComputedStyle(boardContainer).height) };

    document.getElementById("pauseButton").onclick = pauseSimulation;
    document.querySelectorAll("#upperLeft button")[1].onclick = () => document.querySelector("#win_about").classList.toggle("hidden");
    document.querySelectorAll("#upperLeft button")[2].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > hr")[1].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
    // document.querySelectorAll("#upperLeft button")[4].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > h2")[1].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
    // document.querySelectorAll("#upperLeft button")[5].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > h2")[2].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
    // document.querySelectorAll("#upperLeft button")[6].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > h2")[3].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
    document.getElementById("toTop").onclick = () => window.scrollTo({top: 0, behavior: "smooth"});

    let upperArea = document.getElementById('upperArea');
    upperArea.appendChild(setupSimulation(300));
    
    startSimulation();
}


function checkStatistics(n) {
    let aliceResults = new Array(40).fill(0);
    let bobResults = new Array(40).fill(0);
    clearDetectors();

    for (let i=0; i < n; ++i) {
        let sample = toggleDetectors();

        aliceResults[sample[0]*8 + calculateColorBucket('a', sample[0])]++;
        bobResults[sample[1]*8 + calculateColorBucket('b', sample[1])]++

        clearDetectors();
    }

    console.log("Alice")
    console.log(aliceResults);
    console.log("Bob")
    console.log(bobResults);
}

function calculateColorBucket(aliceOrBob, lineNum) {
    let circles = generateCirclesOnLine(lineNum);
    let numRed = 0;
    let redIndex = -1;
    let greenIndex = -1;
    for (let i = 0; i < circles.length; ++i) {
        let isRed = document.getElementById(`${aliceOrBob}c${circles[i]}`).style.fill === 'red';
        numRed += isRed;
        isRed ? redIndex = i : greenIndex = i;
    }
    if (numRed === 1) {return redIndex;}
    else {return circles.length + greenIndex;}
} 



