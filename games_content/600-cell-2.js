"use strict";

let content = document.getElementById("game_content");

//buttons
document.querySelectorAll("#upperLeft button")[0].onclick = () => document.querySelector("#win_about").classList.toggle("hidden");
document.querySelectorAll("#upperLeft button")[1].onclick = () => document.querySelector("#win_rules").classList.toggle("hidden");

document.querySelectorAll("#upperLeft button")[2].onclick = () => window.scrollTo({top: document.querySelectorAll("#game_content > hr")[0].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
document.getElementById("toTop").onclick = () => window.scrollTo({top: 0, behavior: "smooth"});

//reset button
document.querySelectorAll("#upperLeft button")[3].onclick = () => {document.querySelectorAll('#upperLeft option')[0].selected = true;  reset();}


//people
document.querySelectorAll(".person").forEach((e, i) => {
    e.onmouseenter = ev => {
        document.querySelectorAll(".personDesc")[Math.floor(i / 3)].classList.toggle("highlight", true);
    };
    e.onmouseleave = ev => {
        document.querySelectorAll(".personDesc")[Math.floor(i / 3)].classList.toggle("highlight", false);
    };
});

let boardContainer = document.getElementById("boardContainer");
let boardContainer2 = document.getElementById("boardContainer2");
const defaultBoardContainerSize = { width: parseInt(getComputedStyle(boardContainer).width), height: parseInt(getComputedStyle(boardContainer).height) };
const defaultBoardContainerSize2 = { width: parseInt(getComputedStyle(boardContainer2).width), height: parseInt(getComputedStyle(boardContainer2).height) };

let circleMap = [];
boardContainer.insertBefore(makeBoard(), boardContainer.firstChild);
boardContainer2.insertBefore(makeBoard2(), boardContainer2.firstChild);


function makeBoard() {
    const Yblocks = 5;
    const Xblocks = 5;
    const numsinYblocks = 3;
    const numsinXblocks = 4;
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

    //blocks of nums along the y axis
    for(let gy = 0; gy < Yblocks; gy++) {

        let gridRow = document.createElement("div");
        gridRow.classList.add("gridRow");

        //blocks of nums along the x axis
        for(let gx = 0; gx < Xblocks; gx++) {
            let gridSpot = document.createElement("div");
            gridSpot.classList.add("gridSpot");

            //nums within a block along y axis (grouped as a basis)
            for(let y = 0; y < numsinYblocks; y++) {
        
                let basis = document.createElement("div");
                basis.classList.add("basis");
                
                //nums in that basis
                let basis_vals = []
                for(let x = 0; x < numsinXblocks; x++) {
                    let val = vals[y + gy * numsinYblocks][x + gx * numsinXblocks];
                    basis_vals.push(val);

                    let val_el = document.createElement("div");
                    val_el.classList.add("val");
                    val_el.classList.add(val);
        
                    val_el.innerText = val;
                    
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

                basis.onclick = () => {
                    if(basis.classList.toggle("selected")) {
                        addValues(basis_vals);
                    } else {
                        removeValues(basis_vals);
                    }
                    updateScore();
                };

                basis.onmouseenter = () => {
                    basis_vals.forEach(v => {
                        document.getElementById("scoreboard").children[v - 1].classList.add("highlight");
                    });
                };
            
                basis.onmouseleave = () => {
                    basis_vals.forEach(v => {
                        document.getElementById("scoreboard").children[v - 1].classList.remove("highlight");
                    });
                };

             
            }

            gridRow.appendChild(gridSpot);
        }

        board.appendChild(gridRow);
    }

    document.querySelectorAll("#score .ray").forEach((el, i) => {
        let val_elems = document.getElementsByClassName(`val ${i + 1}`);
        el.onmouseenter = () => {
            for (let j = 0; j < val_elems.length; ++j) {
                //console.log(i);
                val_elems[j].classList.toggle("hover", true);
            }
        };

        el.onmouseleave = () => {
            for (let j = 0; j < val_elems.length; ++j) {
                val_elems[j].classList.toggle("hover", false);
            }
        };
    })

 
    return board;
}

function makeBoard2() {
    const Yblocks = 6;
    const Xblocks = 6;
    const numsinYblocks = 5;
    const numsinXblocks = 2;
    const vals = [
        [1,	    4,	2,	3,	5,	7,	6,	8,	9,	10,	11,	12],
        [15,	14,	16,	13,	18,	20,	17,	19,	24,	23,	22,	21],
        [56,	55,	54,	53,	59,	58,	57,	60,	50,	52,	51,	49],
        [47,	45,	46,	48,	38,	37,	39,	40,	44,	41,	43,	42],
        [30,	29,	32,	31,	36,	33,	34,	35,	27,	25,	26,	28],
        [2,	    3,	1,	4,	6,	8,	5,	7,	11,	12,	9,	10],
        [43,	44,	41,	42,	47,	46,	45,	48,	40,	38,	37,	39],
        [33,	35,	36,	34,	26,	25,	27,	28,	29,	32,	30,	31],
        [17,	18,	19,	20,	24,	21,	22,	23,	13,	15,	16,	14],
        [52,	49,	51,	50,	53,	55,	54,	56,	58,	57,	60,	59],
        [5,	    6,	7,	8,	9,	12,	10,	11,	1,	3,	2,	4],
        [21,	23,	24,	22,	13,	14,	15,	16,	17,	20,	19,	18],
        [31,	32,	29,	30,	34,	35,	33,	36,	28,	26,	27,	25],
        [50,	51,	49,	52,	56,	54,	53,	55,	59,	60,	58,	57],
        [40,	37,	39,	38,	43,	41,	42,	44,	46,	45,	47,	48],
        [7,	    8,	5,	6,	10,	11,	9,	12,	2,	4,	1,	3],
        [26,	27,	25,	28,	32,	30,	29,	31,	36,	35,	33,	34],
        [16,	13,	15,	14,	19,	17,	18,	20,	21,	22,	24,	23],
        [41,	42,	43,	44,	45,	48,	46,	47,	39,	37,	40,	38],
        [57,	59,	60,	58,	49,	50,	51,	52,	56,	53,	54,	55],
        [9,     11,	10,	12,	1,	2,	3,	4,	5,	8,	6,	7],
        [19,	20,	18,	17,	22,	23,	21,	24,	16,	14,	13,	15],
        [38,	39,	40,	37,	44,	42,	41,	43,	47,	48,	45,	46],
        [28,	25,	26,	27,	31,	29,	30,	32,	34,	33,	36,	35],
        [53,	54,	56,	55,	57,	60,	58,	59,	49,	51,	52,	50],
        [10,	12,	9,	11,	3,	4,	1,	2,	6,	7,	5,	8],
        [34,	36,	33,	35,	27,	28,	25,	26,	30,	31,	29,	32],
        [58,	60,	57,	59,	51,	52,	49,	50,	54,	55,	53,	56],
        [22,	24,	21,	23,	15,	16,	13,	14,	18,	19,	17,	20],
        [46,	48,	45,	47,	39,	40,	37,	38,	42,	43,	41,	44],
    ];

    let board = document.createElement("div");
    board.classList.add("board"); 

    //blocks of nums along the y axis
    for(let gy = 0; gy < Yblocks; gy++) {

        //add a column num?

        //blocks of nums along the x axis
        for(let gx = 0; gx < Xblocks; gx++) {

            //add a row num?

            let block = document.createElement("div");
            block.classList.add("block");

            let block_vals = []

            //nums in block along y axis
            for(let y = 0; y < numsinYblocks; y++) {

                let blockRow = document.createElement("div");
                blockRow.classList.add("blockRow");
                
                //nums in block along x axis
                for(let x = 0; x < numsinXblocks; x++) {
                    let val = vals[y + gy * numsinYblocks][x + gx * numsinXblocks];
                    block_vals.push(val);


                    let val_el = document.createElement("div");
                    val_el.classList.add("val");
                    val_el.classList.add(val);

                    val_el.innerText = val;
                    
                    val_el.onmouseenter = e => {
                        [...document.querySelectorAll(".block .val")].filter(e => e.innerText == "" + val).forEach(e => {
                            if(e !== val_el) {
                                e.classList.toggle("hover", true);
                            }
                        });
                    };

                    val_el.onmouseleave = e => {
                        [...document.querySelectorAll(".block .val")].filter(e => e.innerText == "" + val).forEach(e => {
                            if(e !== val_el) {
                                e.classList.toggle("hover", false);
                            }
                        });
                    };
        
                    blockRow.appendChild(val_el);
                }

                block.appendChild(blockRow);

            }

            block.onclick = () => {
                if(block.classList.toggle("selected")) {
                    // addValues(block_vals);

                } else {
                    // removeValues(block_vals);
                }
                updateScore();
            };

            // block.onmouseenter = () => {
            //     block_vals.forEach(v => {
            //         document.getElementById("scoreboard").children[v - 1].classList.add("highlight");
            //     });
            // };
        
            // block.onmouseleave = () => {
            //     block_vals.forEach(v => {
            //         document.getElementById("scoreboard").children[v - 1].classList.remove("highlight");
            //     });
            // };


            board.appendChild(block);
        }
    }

    // document.querySelectorAll("#score .ray").forEach((el, i) => {
    //     let val_elems = document.getElementsByClassName(`val ${i + 1}`);
    //     el.onmouseenter = () => {
    //         for (let j = 0; j < val_elems.length; ++j) {
    //             //console.log(i);
    //             val_elems[j].classList.toggle("hover", true);
    //         }
    //     };

    //     el.onmouseleave = () => {
    //         for (let j = 0; j < val_elems.length; ++j) {
    //             val_elems[j].classList.toggle("hover", false);
    //         }
    //     };
    // })

 
    return board;
}

function addValues(values) {
    values.forEach(v => {
        let entry = document.getElementById("scoreboard").children[v - 1];
        let current = entry.children[1].innerText;
        let current_n = parseInt(current.substr(1, current.length-2));

        current_n++;
        entry.children[1].innerText = "(" + current_n + ")";

        entry.classList.toggle("even", current_n % 2 == 0);
        entry.classList.toggle("odd", current_n % 2 == 1);
    });
    //checkWon();
}

function removeValues(values) {
    values.forEach(v => {
        let entry = document.getElementById("scoreboard").children[v - 1];
        let current = entry.children[1].innerText;
        let current_n = parseInt(current.substr(1, current.length-2));

        current_n--;
        entry.children[1].innerText = "(" + current_n + ")";

        entry.classList.toggle("even", current_n % 2 == 0 && current_n > 0);
        entry.classList.toggle("odd", current_n % 2 == 1 && current_n > 0);
    });
    //checkWon();
}

function updateScore() {
    let even = document.getElementsByClassName("ray even").length
    let odd = document.getElementsByClassName("ray odd").length
    //console.log(`Num even = ${even} Num odd = ${odd}`);

    let numBasis = document.getElementsByClassName("basis selected").length
    let basisDiv = document.getElementById("numBasis");
    basisDiv.innerHTML = numBasis;

    basisDiv.classList.toggle("even", numBasis%2 == 0);
    basisDiv.classList.toggle("odd", numBasis%2 == 1);

    let rays = document.getElementById("scoreboard").children;

    //the following code checks if the user has won
    for (let i = 0; i < rays.length; ++i) {
        if (rays[i].classList.contains("odd")) {
            return;
        }
    }

    if (numBasis % 2 == 0) {
        return;
    }

    //window.alert("You have won the game!")
}

function addValues(values) {
    values.forEach(v => {
        let entry = document.getElementById("scoreboard").children[v - 1];
        let current = entry.children[1].innerText;
        let current_n = parseInt(current.substr(1, current.length-2));

        current_n++;
        entry.children[1].innerText = "(" + current_n + ")";

        entry.classList.toggle("even", current_n % 2 == 0 && current_n > 0);
        entry.classList.toggle("odd", current_n % 2 == 1 && current_n > 0);
    });
    //checkWon();
}

function removeValues(values) {
    values.forEach(v => {
        let entry = document.getElementById("scoreboard").children[v - 1];
        let current = entry.children[1].innerText;
        let current_n = parseInt(current.substr(1, current.length-2));

        current_n--;
        entry.children[1].innerText = "(" + current_n + ")";

        entry.classList.toggle("even", current_n % 2 == 0 && current_n > 0);
        entry.classList.toggle("odd", current_n % 2 == 1 && current_n > 0);
    });
    //checkWon();
}

function checkWon() {
    const allEven = Array.prototype.slice.call(document.getElementById("scoreboard").children).every(e => !e.classList.contains("odd"));
    const numTurns = boardContainer.querySelectorAll(".board .circle.selected").length;

    boardContainer.querySelector(".moveCounter .inner").innerText = numTurns;
    boardContainer.querySelector(".moveCounter").classList.toggle("even", numTurns % 2 == 0 && numTurns > 0);
    boardContainer.querySelector(".moveCounter").classList.toggle("odd", numTurns % 2 == 1 && numTurns > 0);

    const won = allEven && numTurns % 2 == 1;
    boardContainer.classList.toggle("won", won);

    document.querySelector("#does").classList.toggle("won", won);
}

function reset() {
    Array.prototype.slice.call(document.querySelectorAll("#score .ray")).forEach(e => {
        e.children[1].innerText = "(0)";
        e.classList.remove("even");
        e.classList.remove("odd");
    });

    Array.prototype.slice.call(boardContainer.querySelectorAll(".board .basis")).forEach(e => {
        e.classList.remove("selected");
    });

    updateScore();
}

function solve(size) {
    reset();

    if (size == '-') {return;}

    const solutions = {
        "26-13": [1, 10, 15, 18, 26, 28, 35, 39, 50, 54, 63, 71, 73],
        "30-15": [1, 4, 8, 12, 14, 18, 21, 22, 26, 28, 63, 66, 67, 71, 73],
        "32-17": [1, 4, 11, 15, 17, 21, 26, 28, 38, 48, 49, 55, 59, 61, 65, 71, 74],
        "33-17": [1, 4, 8, 9, 11, 24, 26, 27, 28, 38, 44, 47, 49, 55, 61, 66, 71],
        "34-17": [1, 4, 11, 18, 21, 26, 32, 35, 40, 53, 55, 56, 59, 69, 71, 72, 75],
        "36-19": [1, 4, 6, 12, 13, 18, 26, 29, 33, 42, 43, 46, 52, 53, 56, 59, 61, 71, 73],
        "37-19": [1, 4, 6, 12, 17, 26, 35, 38, 40, 41, 44, 48, 55, 63, 65, 66, 71, 74, 75],
        "38-19": [1, 2, 4, 5, 10, 26, 31, 34, 38, 40, 42, 44, 55, 62, 65, 69, 70, 71, 75],
        "38-21": [1, 4, 6, 7, 9, 12, 19, 23, 25, 26, 29, 35, 37, 40, 41, 44, 48, 55, 66, 69, 74],
        "39-21": [1, 4, 7, 11, 17, 19, 23, 26, 28, 29, 40, 42, 45, 47, 51, 53, 56, 63, 64, 67, 72],
        "40-21": [1, 4, 14, 17, 18, 22, 26, 28, 30, 33, 35, 43, 46, 50, 53, 54, 55, 57, 59, 67, 71],
        "41-21": [1, 10, 12, 13, 21, 24, 26, 31, 33, 34, 39, 40, 47, 49, 50, 55, 56, 58, 65, 67, 71],
        "42-21": [1, 6, 7, 25, 26, 27, 28, 29, 30, 32, 34, 38, 47, 49, 53, 70, 71, 72, 73, 74, 75],
        "43-23": [1, 2, 4, 11, 13, 15, 16, 24, 26, 27, 28, 35, 41, 44, 45, 50, 55, 61, 63, 65, 67, 68, 71],
        "44-23": [1, 2, 4, 5, 8, 10, 12, 17, 18, 24, 25, 26, 28, 30, 39, 46, 50, 55, 59, 61, 66, 71, 74],
        "45-23": [1, 4, 8, 10, 12, 13, 18, 20, 24, 26, 27, 28, 41, 46, 47, 52, 53, 55, 61, 63, 64, 65, 71],
        "46-23": [1, 4, 11, 12, 13, 17, 21, 26, 27, 28, 31, 35, 44, 47, 50, 55, 57, 59, 61, 65, 70, 71, 75],
        "48-25": [1, 3, 4, 14, 17, 24, 25, 26, 27, 28, 30, 31, 33, 34, 44, 46, 54, 55, 56, 57, 61, 69, 70, 71, 72],
        "49-25": [1, 2, 6, 7, 14, 15, 16, 25, 26, 27, 28, 33, 41, 45, 48, 49, 51, 55, 56, 57, 59, 65, 69, 70, 71],
        "50-25": [1, 3, 5, 10, 11, 16, 17, 21, 26, 27, 32, 33, 34, 40, 42, 47, 48, 49, 55, 57, 61, 62, 66, 71, 72],
        "53-27": [1, 2, 6, 8, 10, 12, 13, 14, 15, 16, 17, 18, 22, 24, 26, 28, 30, 33, 42, 47, 55, 61, 62, 63, 71, 74, 75],
        "54-27": [1, 3, 6, 7, 10, 11, 14, 16, 17, 18, 20, 21, 25, 26, 27, 31, 32, 33, 34, 35, 40, 41, 42, 48, 55, 61, 71],
    }

    let solution = solutions[size];

    // the basis index order in the DOM is like
    //  0   3   6   9  12
    //  1   4   7  10  13
    //  2   5   8  11  14
    // ------------------
    // 15  18 etc
    // 16  19
    // 17  20
    // but the numbers above treat it like
    //  0  15  30  45  60
    //  1  16  31  46  61
    //  2  17  32  47  62
    // ------------------
    //  3  18 etc
    //  4  19
    //  5  20

    function convert_index(i){
        var n = Math.floor((i % 15) / 3) * 15 + (i%3);
        return n + Math.floor(i / 15) * 3;
    }

    for(var i in solution){
        let basisSol = document.querySelectorAll(".basis");
        basisSol[convert_index(solution[i] - 1)].click();
    }

}