"use strict";

let content = document.getElementById("content");

//buttons
document.querySelectorAll("#upperLeft button")[0].onclick = () => document.querySelector("#win_about").classList.toggle("hidden");
document.querySelectorAll("#upperLeft button")[1].onclick = () => document.querySelector("#win_rules").classList.toggle("hidden");

document.querySelectorAll("#upperLeft button")[2].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > hr")[0].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
document.getElementById("toTop").onclick = () => window.scrollTo({top: 0, behavior: "smooth"});

//reset button
document.querySelectorAll("#upperLeft button")[3].onclick = () => {reset();}
document.querySelectorAll("#upperLeft button")[4].onclick = () => solve();




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

//The board on the left with the 4 sets of bases
const board1 = [
	[
		[[ 1,  2,  3,  4], [ 5,  6,  7,  8], [ 9, 10, 11, 12]],
		[[31, 42, 51, 16], [38, 24, 58, 25], [56, 45, 17, 35]],
		[[22, 60, 39, 28], [18, 47, 33, 55], [13, 32, 50, 41]],
		[[57, 23, 27, 40], [36, 53, 20, 46], [43, 49, 30, 14]],
		[[44, 29, 15, 52], [59, 26, 37, 21], [34, 19, 48, 54]],
	],
	[
		[[13, 14, 15, 16], [17, 18, 19, 20], [21, 22, 23, 24]],
		[[43, 54,  3, 28], [50, 36, 10, 37], [ 8, 57, 29, 47]],
		[[34, 12, 51, 40], [30, 59, 45,  7], [25, 44,  2, 53]],
		[[ 9, 35, 39, 52], [48,  5, 32, 58], [55,  1, 42, 26]],
		[[56, 41, 27,  4], [11, 38, 49, 33], [46, 31, 60,  6]],
	],
	[
		[[25, 26, 27, 28], [29, 30, 31, 32], [33, 34, 35, 36]],
		[[55,  6, 15, 40], [ 2, 48, 22, 49], [20,  9, 41, 59]],
		[[46, 24,  3, 52], [42, 11, 57, 19], [37, 56, 14,  5]],
		[[21, 47, 51,  4], [60, 17, 44, 10], [ 7, 13, 54, 38]],
		[[ 8, 53, 39, 16], [23, 50,  1, 45], [58, 43, 12, 18]],
	],
	[
		[[37, 38, 39, 40], [41, 42, 43, 44], [45, 46, 47, 48]],
		[[ 7, 18, 27, 52], [14, 60, 34,  1], [32, 21, 53, 11]],
		[[58, 36, 15,  4], [54, 23,  9, 31], [49,  8, 26, 17]],
		[[33, 59,  3, 16], [12, 29, 56, 22], [19, 25,  6, 50]],
		[[20,  5, 51, 28], [35,  2, 13, 57], [10, 55, 24, 30]],
	],
	[
		[[49, 50, 51, 52], [53, 54, 55, 56], [57, 58, 59, 60]],
		[[19, 30, 39,  4], [26, 12, 46, 13], [44, 33,  5, 23]],
		[[10, 48, 27, 16], [ 6, 35, 21, 43], [ 1, 20, 38, 29]],
		[[45, 11, 15, 28], [24, 41,  8, 34], [31, 37, 18,  2]],
		[[32, 17,  3, 40], [47, 14, 25,  9], [22,  7, 36, 42]],
	],
];

//The board on the right with the chuncks of 10
const board2 = [
    [ 1, 4,15,14,56,55,47,45,30,29,],
    [ 2, 3,16,13,54,53,46,48,32,31,],
    [ 5, 7,18,20,59,58,38,37,36,33,],
    [ 6, 8,17,19,57,60,39,40,34,35,],
    [ 9,10,24,23,50,52,44,41,27,25,],
    [11,12,22,21,51,49,43,42,26,28,],
    [ 2, 3,43,44,33,35,17,18,52,49,],
    [ 1, 4,41,42,36,34,19,20,51,50,],
    [ 6, 8,47,46,26,25,24,21,53,55,],
    [ 5, 7,45,48,27,28,22,23,54,56,],
    [11,12,40,38,29,32,13,15,58,57,],
    [ 9,10,37,39,30,31,16,14,60,59,],
    [ 5, 6,21,23,31,32,50,51,40,37,],
    [ 7, 8,24,22,29,30,49,52,39,38,],
    [ 9,12,13,14,34,35,56,54,43,41,],
    [10,11,15,16,33,36,53,55,42,44,],
    [ 1, 3,17,20,28,26,59,60,46,45,],
    [ 2, 4,19,18,27,25,58,57,47,48,],
    [ 7, 8,26,27,16,13,41,42,57,59,],
    [ 5, 6,25,28,15,14,43,44,60,58,],
    [10,11,32,30,19,17,45,48,49,50,],
    [ 9,12,29,31,18,20,46,47,51,52,],
    [ 2, 4,36,35,21,22,39,37,56,53,],
    [ 1, 3,33,34,24,23,40,38,54,55,],
    [ 9,11,19,20,38,39,28,25,53,54,],
    [10,12,18,17,40,37,26,27,56,55,],
    [ 1, 2,22,23,44,42,31,29,57,60,],
    [ 3, 4,21,24,41,43,30,32,58,59,],
    [ 5, 8,16,14,47,48,34,33,49,51,],
    [ 6, 7,13,15,45,46,36,35,52,50,],
    [10,12,34,36,58,60,22,24,46,48,],
    [ 9,11,33,35,57,59,21,23,45,47,],
    [ 3, 4,27,28,51,52,15,16,39,40,],
    [ 1, 2,25,26,49,50,13,14,37,38,],
    [ 6, 7,30,31,54,55,18,19,42,43,],
    [ 5, 8,29,32,53,56,17,20,41,44,],
];

//the states of each cell on board2
//elements of the form {elem, status, index, pos:{x, y}}
let states = [];


let circleMap = [];
makeBoard(boardContainer, board1, false);
makeBoard2(boardContainer2, board2);

function makeBoard2(boardContainer, vals) {
    const Yblocks = 6;
    const Xblocks = 6;
    const numsinYblocks = 5;
    const numsinXblocks = 2;
    

	boardContainer.classList.add("board");
	
    for(let gy = 0; gy < Yblocks; gy++) {

        let gridTableRow = document.createElement("tr");

        for(let gx = 0; gx < Xblocks; gx++) {

            let gridTableSpot = document.createElement("td");

            gridTableSpot.classList.add("gridSpot");
			let gridTable = document.createElement("table");
			
            for(let y = 0; y < numsinYblocks; y++) {
                
                let basisRow = document.createElement("tr");
				basisRow.classList.add("basis");


                let basis_vals = []
                for(let x = 0; x < numsinXblocks; x++) {
                    let val = vals[gx + gy * Xblocks][x + y * numsinXblocks];
                    basis_vals.push(val);

                    let val_el = document.createElement("td");
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
        
                    basisRow.appendChild(val_el);
                }
        
                gridTable.appendChild(basisRow);
                
				
             
            }

            //addListener(basisRow, basis_vals);
			//replace with custom addListener
            addListener2(gridTableSpot, gx + gy * Xblocks, {x:gx, y:gy});

            gridTableSpot.appendChild(gridTable);
            gridTableRow.appendChild(gridTableSpot);
            //gridRow.appendChild(gridSpot);
        }

        boardContainer.appendChild(gridTableRow);
        //board.appendChild(gridRow);
	}
	
	return;
    let board = document.createElement("div");
    board.classList.add("board"); 

    //blocks of nums along the y axis
    for(let gy = 0; gy < Yblocks; gy++) {

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

    // document.querySelectorAll("#scoreboard .ray").forEach((el, i) => {
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

function addListener2(el, index, pos){
    states.push({elem:el, status: 0, index: index, pos: pos});
    el.onclick = () => {
        if(el.classList.contains("dselected") || el.classList.contains("rselected")) {
            return;
        }
        if(el.classList.toggle("selected")){
            states[index].status = 1;
        }else{
            states[index].status = 0;
        }
        
        updateStates();
		updateBoard();
        //updateScore();
    };
}

function updateStates(){
    let selected = states.filter(state => {return state.status==1;});
    if(selected.length == 0){
        for(let i=0;i<states.length;i++){
            states[i].status = 0;
            states[i].elem.classList.remove("dselected");
            states[i].elem.classList.remove("rselected");
            states[i].elem.classList.remove("selected");
            
        }
    }else if(selected.length == 1){
        for(let i=0;i<states.length;i++){
            if(selected[0].pos.x!=states[i].pos.x&&selected[0].pos.y!=states[i].pos.y){
                //not in same row or colum, disable selected
                states[i].status = -1;
                states[i].elem.classList.add("dselected");
            }else if(selected[0].pos.x!=states[i].pos.x||selected[0].pos.y!=states[i].pos.y){
                //in same row or colum, unselected
                states[i].status = 0;
                states[i].elem.classList.remove("dselected");
                states[i].elem.classList.remove("rselected");//might not be needed
            }
            //else would be the element itself which is already selected
        }
    }else if(selected.length == 2){
        if(selected[0].pos.x==selected[1].pos.x){
            //same row
            for(let i=0;i<states.length;i++){
                if(selected[0].pos.x!=states[i].pos.x){
                    //not in same row, disable selected
                    states[i].status = -1;
                    states[i].elem.classList.add("dselected");
                }else if(states[i].pos.y!=selected[0].pos.y&&states[i].pos.y!=selected[1].pos.y){
                    //in the same row
                    states[i].status = 0;
                    states[i].elem.classList.remove("dselected");
                    states[i].elem.classList.remove("rselected");
                }
            }
        }else if(selected[0].pos.y==selected[1].pos.y){
            //same column
            for(let i=0;i<states.length;i++){
                if(selected[0].pos.y!=states[i].pos.y){
                    //not in same col, disable selected
                    states[i].status = -1;
                    states[i].elem.classList.add("dselected");
                }else if(states[i].pos.x!=selected[0].pos.x&&states[i].pos.x!=selected[1].pos.x){
                    //in the same col
                    states[i].status = 0;
                    states[i].elem.classList.remove("dselected");
                    states[i].elem.classList.remove("rselected");
                }
            }
        }

    }else if(selected.length == 3){
        if(selected[0].pos.x==selected[1].pos.x){
            //same row
            for(let i=0;i<states.length;i++){
                if(selected[0].pos.x!=states[i].pos.x){
                    //not in same row, disable selected
                    states[i].status = -1;
                    states[i].elem.classList.add("dselected");
                }else if(states[i].pos.y!=selected[0].pos.y&&states[i].pos.y!=selected[1].pos.y&&states[i].pos.y!=selected[2].pos.y){
                    //in the same row, but not selected
                    states[i].status = 2;
                    states[i].elem.classList.add("rselected");
                }
            }
        }else if(selected[0].pos.y==selected[1].pos.y){
            //same column
            for(let i=0;i<states.length;i++){
                if(selected[0].pos.y!=states[i].pos.y){
                    //not in same col, disable selected
                    states[i].status = -1;
                    states[i].elem.classList.add("dselected");
                }else if(states[i].pos.x!=selected[0].pos.x&&states[i].pos.x!=selected[1].pos.x&&states[i].pos.x!=selected[2].pos.x){   
                    //in the same col
                    states[i].status = 2;
                    states[i].elem.classList.add("rselected");
                }
            }
        }
    }
}

function updateBoard() {
    let selected = states.filter(state => {return state.status==1;})
    let rselected = states.filter(state => {return state.status==2;})
	
	boardContainer.querySelectorAll(".basis").forEach((el) => {
		el.classList.remove("selected");
		el.classList.remove("rselected");
		el.classList.remove("dselected");
	});
	
	if(selected.length < 3) return;
	
	let selVals = new Set();
	selected.forEach((el) => {
		board2[el.index].forEach((v) => selVals.add(v));
	});
	let rselVals = new Set();
	rselected.forEach((el) => {
		board2[el.index].forEach((v) => rselVals.add(v));
	});
	
	for (let y = 0; y < boardContainer.childElementCount; y++) {
		let gridRow = boardContainer.children[y];
		for (let x = 0; x < gridRow.childElementCount; x++) {
			let gridSpot = gridRow.children[x];
			for (let b = 0; b < gridSpot.childElementCount; b++) {
				let basis = gridSpot.children[b];
				let vals = board1[y][x][b];
				if(vals.every((v) => selVals.has(v))) {
					basis.classList.add("selected");
				}
				else if(vals.every((v) => rselVals.has(v))) {
					basis.classList.add("rselected");
				}
				else {
					basis.classList.add("dselected");
				}
			}
		}
	}
}

function reset() {
    let selected = states.filter(state => {return state.status==1;})
    for(let i=0;i<selected.length;i++){
        selected[i].status = 0;
        states[i].elem.classList.remove("selected");
    }

    updateStates();
	updateBoard();
}

function solve() {
    reset();
    for (let i = 0; i < 3; i++) {
        let spots = document.getElementById("boardContainer2").getElementsByClassName("gridSpot");
        console.log(Array.from(spots));
        let avspots = Array.from(spots).filter(
            (elem) => !(elem.classList.contains("selected") || elem.classList.contains("dselected") || elem.classList.contains("relected"))
        );
        let rSpot = avspots[Math.floor(Math.random() * avspots.length)];
        rSpot.click();
        updateStates();
    }
	updateBoard();
}