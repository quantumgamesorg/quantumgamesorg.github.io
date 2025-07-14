var intervalID = 0;

var state = 0;

var btnPause = document.getElementById('pauseButton')

function startSimulation(e) {
    // state = 0;
    // document.getElementById("emmiter").style.backgroundColor = 'white';
    // clearDetectors();
    intervalID = window.setInterval(simulate, 1500);
    btnPause.innerText = 'Pause'
    btnPause.onclick = pauseSimulation;
    if(e !== undefined) e.stopImmediatePropagation();
}  

function pauseSimulation(e) {
    window.clearInterval(intervalID); 
    btnPause.innerText = 'Resume'
    btnPause.onclick = startSimulation;
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


function toggleDetectors() {
    //0 is red, 1 is green
    let row = generateRandomRow();
    let colors = [generateRandomColor(), generateRandomColor()]
    let color3 = 0;
    if (colors[0] + colors[1] === 0) { //if both red
        color3 = 1; //make it green
    } else if (colors[0] + colors[1] === 1){ //if one red, one green
        color3 = 0; //make it red
    } else {    //both are green
        color3 = 1; //make it green
    }
    colors.push(color3);

    let numCols = 3;
    //paint the cells
    for(let i = 0; i < numCols; ++i) {
        let color = colors[i] ? 'green' : 'red'
        document.getElementById(`ar${row}c${i}`).style.backgroundColor = color;
    }

    bobColumn = generateRandomColumn();
    let bobColors = toggleBob(row, bobColumn, colors[bobColumn]);

    return [row, colors, bobColumn, bobColors];
}

function toggleBob(row, col, commonColor) {
    let colors = [commonColor, generateRandomColor()] 
    let color3 = 0;
    if (colors[0] + colors[1] === 0) { //if both red
        color3 = 0; //make it red
    } else if (colors[0] + colors[1] === 1){ //if one red, one green
        color3 = 1; //make it green
    } else {    //both are green
        color3 = 0; //make it red
    }
    colors.push(color3);

    let numRows = 3;
    //paint the cells
    for(let i = 0; i < numRows; ++i) {
        let color = colors[i] ? 'green' : 'red'
        let j = (row + i) % numRows;
        document.getElementById(`br${j}c${col}`).style.backgroundColor = color;
    }

    return colors;

}   


function clearDetectors() {
    let cells = document.querySelectorAll(".square");
    for (let i = 0; i < cells.length; ++i) {
        cells[i].style.backgroundColor = 'white'
    }
}




function generateRandomRow() {
    let numRows = 3;
    return Math.floor(Math.random() * numRows)
}

function generateRandomColumn() {
    let numCols = 3;
    return Math.floor(Math.random() * numCols)
}

function generateRandomColor() {
    let numColors = 2;
    return Math.floor(Math.random() * numColors)
}

window.onload = () => {
    startSimulation();
}


function checkStatistics(n) {
    let aliceResults = new Array(12).fill(0);
    let bobResults = new Array(12).fill(0);

    for (let i=0; i < n; ++i) {
        let sample = toggleDetectors();
        let aliceIndex = computeAliceIndex(sample[0], sample[1])
        let bobIndex = computeBobIndex(sample[2], sample[3])

        aliceResults[aliceIndex]++;
        bobResults[bobIndex]++
    }

    console.log("Alice")
    console.log(aliceResults);
    console.log("Bob")
    console.log(bobResults);
}

function computeAliceIndex(row, colors) {
        return (row*4 + computeColorIndex(colors))
}
function computeBobIndex(column, colors) {
    return (column*4 + computeColorIndex(colors))
}

function computeColorIndex(colors) {
    if (colors[0]) {    //first square is green
        if(colors[1]) { //second square is green
            return 3;
        } else {        //second square is red
            return 2;
        }
    } else {            //first square is red
        if(colors[1]) { //second square is green
            return 1;   
        } else {        //second square is red
            return 0;
        }
    }
}



