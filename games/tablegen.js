function makeBoard(boardContainer, vals) {

    boardContainer.classList.add("board");
	
    for(let gy = 0; gy < vals.length / 3; gy++) {

        let gridTableRow = document.createElement("tr");

        for(let gx = 0; gx < vals[gy].length / 4; gx++) {

            let gridTableSpot = document.createElement("td");

            gridTableSpot.classList.add("gridSpot");

            for(let y = 0; y < 3; y++) {
                
                let basisRow = document.createElement("div");
				basisRow.classList.add("basis");


                let basis_vals = []
                for(let x = 0; x < 4; x++) {
                    let val = vals[y + gy * 3][x + gx * 4];
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
        
                    basisRow.appendChild(val_el);
                }
        
                gridTableSpot.appendChild(basisRow);
                
				addListener(basisRow, basis_vals);
             
            }
            gridTableRow.appendChild(gridTableSpot);

            //gridRow.appendChild(gridSpot);
        }

        boardContainer.appendChild(gridTableRow);
        //board.appendChild(gridRow);
    }
}

function buildDisplaySolution(height, width, buttonLayout = 'side') {
    let displaySolution = document.getElementById("displaySolutionContainer");
    displaySolution.innerHTML = "";

    // Set data attribute for button layout
    displaySolution.setAttribute('data-button-layout', buttonLayout);
    
    // Also set it on the parent displaySolution div for CSS targeting
    const parentDiv = displaySolution.parentElement;
    parentDiv.setAttribute('data-button-layout', buttonLayout);

    let controlsWrapper = document.createElement("div");
    controlsWrapper.classList.add("displaySolutionControls");
    if (buttonLayout === 'below') {
        controlsWrapper.classList.add('below');
    }
    // For the "On/off" and "Set" buttons

    for (let gy = 0; gy < height; gy++) {
        let gridTableRow = document.createElement("tr");

        for (let gx = 0; gx < width; gx++) {
            let index = 1 + gy + gx * height;

            let gridTableSpot = document.createElement("td");
            gridTableSpot.classList.add("ray");
            gridTableSpot.classList.add(String(index));
            
            // gridTableSpot.innerHTML = `<div>${index}</div><div class="bit">0</div>`; // if decide to display bit number
            gridTableSpot.innerHTML = `<div class="bit">0</div>`;

            gridTableSpot.onclick = () => {
                const currently = gridTableSpot.classList.toggle("selected");
                setDisplayBit(index, currently);
            };

            gridTableRow.appendChild(gridTableSpot);
        }
        displaySolution.appendChild(gridTableRow);
    }

    // On button
    let existingPower = parentDiv.querySelector('#displaySolutionPower');
    if(!existingPower) {
        let powerBtn = document.createElement('button');
        powerBtn.id = 'displaySolutionPower';
        powerBtn.classList.add('power','on');
        powerBtn.innerText = 'ON';
        
        if (buttonLayout === 'below') {
            controlsWrapper.appendChild(powerBtn);
        } else {
            parentDiv.insertBefore(powerBtn, displaySolution);
        }
        // Default: On

        powerBtn.onclick = () => {
            const enabled = !displaySolution.classList.contains('disabled');
            setDisplayEnabled(!enabled);
        };
    } else if (buttonLayout === 'below') {
        // Move existing power button to controls wrapper
        existingPower.remove();
        controlsWrapper.appendChild(existingPower);
    }

    // Set button
    let setButton = document.createElement("button");
    setButton.id = "displaySolutionSet";
    setButton.innerText = "Set";
    setButton.classList.add('power', 'set');
    setButton.onclick = () => setDisplaySolution();

    controlsWrapper.appendChild(setButton);

    displaySolution.parentElement.appendChild(controlsWrapper);

    setDisplayEnabled(true);
}


function setDisplayEnabled(enabled) {
    const display = document.getElementById('displaySolutionContainer');
    const parent = display ? display.parentElement : null;
    const powerBtn = parent ? parent.querySelector('#displaySolutionPower') : null;
    const randomize = document.getElementById('displaySolutionRandomize');

    if(!display) return;

    if(enabled) {
        display.classList.remove('disabled');
        if(powerBtn) { powerBtn.classList.remove('off'); powerBtn.classList.add('on'); powerBtn.innerText = 'ON'; }
        if(randomize) randomize.disabled = false;
    } else {
        // When display is switched OFF, reset the board so we start fresh
        reset();
        display.classList.add('disabled');
        if(powerBtn) { powerBtn.classList.remove('on'); powerBtn.classList.add('off'); powerBtn.innerText = 'OFF'; }
        if(randomize) randomize.disabled = true;

        // Resets to zeros when turned off
        Array.prototype.slice.call(display.getElementsByClassName('ray')).forEach(e => {
            const b = e.querySelector('.bit');
            if(b) b.innerText = '0';
            e.classList.remove('selected');
        });
    }
}


// Sets display bit to 0 or 1 
function setDisplayBit(index, on) {
    const displayContainer = document.getElementById('displaySolutionContainer');
    const display = displayContainer ? displayContainer.getElementsByClassName('ray ' + index)[0] : null;

    if(!display) return;

    const bitDiv = display.querySelector('.bit');
    if(on) {
        bitDiv.innerText = "1";
        display.classList.add('selected');
    } else {
        bitDiv.innerText = "0";
        display.classList.remove('selected');
    }
}


function setDisplaySolution() {
    const display = document.getElementById('displaySolutionContainer');
    if (!display) return;
    if (display.classList.contains('disabled')) return;
    // Reset the board state but keep the display bits intact so the
    // newly selected pattern is applied to a cleared board.
    reset(false);
    // Read all rays into an array
    const rays = Array.prototype.slice.call(display.getElementsByClassName('ray'));
    const bits = rays.map(r => {
        const bitEl = r.querySelector('.bit');
        return bitEl && bitEl.innerText.trim() === '1' ? 1 : 0;
    });

    // start solution algorithm

    const P_ROWS = 33; // number of bits
    const P_COLS = 75; // number of bases
    const P = Array.from({ length: P_ROWS }, () => Array(P_COLS).fill(0));

    // Manually set each row with long arrays
    P[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
    P[1] = [1, 3, 4, 5, 7, 9, 11, 12, 14, 15, 18, 19, 24, 26, 29, 32, 36, 38, 40, 43];
    P[2] = [1, 2, 7, 8, 11, 12, 14, 15, 16, 19, 20, 21, 22, 26, 29, 33, 34, 35, 36, 39, 40, 43];
    P[3] = [1, 3, 4, 6, 10, 11, 16, 17, 19, 20, 26, 27, 31, 33, 34, 36, 40, 41];
    P[4] = [8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 23, 25, 29, 31, 32, 33, 34, 35, 36, 37, 42, 43];
    P[5] = [3, 5, 7, 10, 14, 17, 18, 19, 20, 22, 24, 25, 27, 28, 29, 33, 35, 37, 40, 44];
    P[6] = [4, 5, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 23, 26, 28, 31, 32, 33, 36, 37, 40, 45];
    P[7] = [3, 6, 7, 10, 15, 17, 20, 24, 27, 29, 31, 33, 46, 47];
    P[8] = [1, 3, 5, 6, 7, 9, 10, 12, 14, 15, 17, 18, 19, 20, 23, 24, 26, 27, 28, 29, 32, 33, 46, 48];
    P[9] = [1, 2, 4, 5, 7, 8, 11, 12, 14, 15, 16, 18, 19, 21, 22, 24, 25, 26, 28, 29, 34, 36, 49, 50];
    P[10] = [1, 5, 7, 11, 14, 18, 19, 24, 25, 28, 35, 36, 49, 51];
    P[11] = [1, 3, 4, 5, 10, 12, 17, 20, 24, 25, 26, 27, 28, 33, 34, 35, 36, 37, 40, 43, 52, 53];
    P[12] = [3, 5, 9, 10, 14, 18, 20, 24, 27, 28, 32, 33, 34, 35, 52, 54];
    P[13] = [1, 4, 8, 10, 11, 12, 14, 16, 17, 19, 20, 25, 26, 31, 32, 33, 34, 35, 36, 37, 40, 43, 55, 56];
    P[14] = [10, 12, 17, 20, 22, 25, 28, 32, 35, 37, 40, 43, 55, 57];
    P[15] = [1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 17, 20, 23, 26, 29, 46, 49, 52, 55, 58];
    P[16] = [1, 4, 5, 6, 8, 10, 11, 12, 14, 16, 17, 18, 19, 20, 21, 24, 26, 28, 31, 32, 33, 36, 37, 40, 43, 46, 49, 52, 55, 59];
    P[17] = [5, 6, 10, 11, 14, 15, 16, 17, 18, 19, 24, 25, 28, 31, 32, 35, 36, 46, 49, 52, 55, 60];
    P[18] = [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 23, 24, 26, 27, 28, 29, 32, 46, 61];
    P[19] = [6, 7, 10, 15, 17, 31, 46, 62];
    P[20] = [3, 5, 6, 7, 9, 10, 12, 14, 15, 17, 18, 20, 24, 27, 29, 31, 32, 33, 46, 63];
    P[21] = [5, 18, 24, 25, 28, 35, 49, 64];
    P[22] = [3, 9, 10, 13, 20, 34, 49, 65];
    P[23] = [1, 4, 5, 7, 11, 14, 16, 18, 19, 22, 24, 25, 26, 28, 29, 34, 35, 36, 49, 66];
    P[24] = [1, 3, 4, 5, 7, 8, 9, 11, 12, 14, 15, 16, 18, 19, 21, 24, 26, 27, 28, 29, 32, 36, 40, 43, 52, 67];
    P[25] = [1, 6, 12, 13, 23, 37, 52, 68];
    P[26] = [3, 5, 7, 9, 10, 14, 17, 18, 19, 20, 24, 25, 27, 28, 29, 32, 33, 34, 35, 37, 52, 69];
    P[27] = [2, 5, 7, 8, 9, 11, 12, 13, 14, 15, 16, 18, 19, 21, 22, 23, 25, 28, 29, 31, 33, 34, 36, 40, 55, 70];
    P[28] = [1, 4, 9, 15, 26, 40, 55, 71];
    P[29] = [12, 25, 32, 35, 37, 43, 55, 72];
    P[30] = [1, 4, 5, 6, 9, 12, 13, 15, 23, 24, 25, 26, 28, 33, 35, 37, 40, 46, 49, 52, 55, 73];
    P[31] = [1, 6, 9, 10, 13, 15, 17, 20, 23, 26, 43, 46, 49, 52, 55, 74];
    P[32] = [5, 6, 10, 11, 13, 14, 15, 17, 18, 19, 20, 23, 24, 28, 31, 32, 35, 36, 43, 46, 49, 52, 55, 75];

    Podd = [1, 4, 7, 10, 13, 17, 20, 23, 26, 29, 31, 34, 37, 40, 43];

    v = Array.from({ length: P_ROWS }, () => Array(P_COLS).fill(0));

    for (let i = 0; i < P_ROWS; i++) {
        for (let j = 0; j < P_COLS; j++) {
            if(P[i].includes(j + 1)) {
                v[i][j] = 1;
            }
        }
    }

    let vodd = new Array(P_COLS).fill(0);
    for (let j = 0; j < P_COLS; j++) {
        if (Podd.includes(j + 1)) {
            vodd[j] = 1;
        }
    }

    let uout = new Array(P_COLS).fill(0);
    let uin = bits;


    for (let i = 0; i < P_ROWS; i++) {
        if (uin[i] == 1) {
            uout = binAdd(uout, v[i]);
        }
    }

    uout = binAdd(uout, vodd);

    var picked = new Set();

    for (let i = 0; i < P_COLS; i++) {
        if(uout[i] == 1) {
            picked.add(i);
        }
    }

    // end algorithm


    const board = document.querySelector('.board');
    
    // Transpose the bases to select them in the order that the algorithm outputs (down row first vs down col)
    const bases = (function() {
        if (!board) return Array.from(document.querySelectorAll('.basis'));

        const rows = Array.from(board.querySelectorAll('tr'));
        const cols = rows[0] ? rows[0].querySelectorAll('.gridSpot').length : 0;

        const out = [];
        for (let gx = 0; gx < cols; gx++) {
            for (let gy = 0; gy < rows.length; gy++) {
                const cell = rows[gy].querySelectorAll('.gridSpot')[gx];
                if (!cell) continue;
                out.push(...Array.from(cell.querySelectorAll('.basis')));
            }
        }
        return out;
    })();


    picked.forEach(idx => {
        const basisEl = bases[idx];
        basisEl.click();
    });

}

// Add binary strings w/ no carry over
function binAdd(arr1, arr2) {
    let ret = new Array(arr1.length).fill(0);
    for (let i = 0; i < arr1.length; i++) {
        if((arr1[i] || arr2[i]) && !(arr1[i] && arr2[i])) {
            ret[i] = 1;
        }
    }

    return ret;
}


function buildScoreboard(height, width, trans = false) {
    let scoreTable = document.getElementById("scoreboard");
	for (let gy = 0; gy < height; gy++) {
		let gridTableRow = document.createElement("tr");
		
		for (let gx = 0; gx < width; gx++) {
			let index = 1 + gy + gx * height;
			if(trans) {
				index = 1 + gx + gy * width;
			}
			
			let gridTableSpot = document.createElement("td");
			gridTableSpot.classList.add("ray");
			gridTableSpot.classList.add(index);
			
			gridTableSpot.innerHTML=`<div>${index}</div><div>(0)</div>`
			
			let val_elems = document.getElementsByClassName(`val ${index}`);
			gridTableSpot.onmouseenter = () => {
				for (let j = 0; j < val_elems.length; ++j) {
					//console.log(i);
					val_elems[j].classList.toggle("hover", true);
				}
			};

			gridTableSpot.onmouseleave = () => {
				for (let j = 0; j < val_elems.length; ++j) {
					val_elems[j].classList.toggle("hover", false);
				}
			};
			
			gridTableRow.appendChild(gridTableSpot);
		}
		
		scoreTable.appendChild(gridTableRow);
		
		
	}
}


let listeners = [];
function addListener(el, vals) {
	el.onclick = () => {
        if(el.classList.toggle("selected")) {
            addValues(vals);
        } else {
            removeValues(vals);
        }
        checkWon();
    };

    el.onmouseenter = () => {
        vals.forEach(v => {
			document.getElementsByClassName("ray " + v)[0].classList.add("highlight");
        });
    };

    el.onmouseleave = () => {
        vals.forEach(v => {
			document.getElementsByClassName("ray " + v)[0].classList.remove("highlight");
        });
    };
	
	listeners.push(el);
}

function addValues(values) {
    values.forEach(v => {
        let entry = document.getElementsByClassName("ray " + v)[0];
        let current = entry.children[1].innerText;
        let current_n = parseInt(current.substr(1, current.length-2));

        current_n++;
        entry.children[1].innerText = "(" + current_n + ")";

        entry.classList.toggle("even", current_n % 2 == 0);
        entry.classList.toggle("odd", current_n % 2 == 1);
    });
    //checkWon();
    updateScore();
}

function removeValues(values) {
    values.forEach(v => {
        let entry = document.getElementsByClassName("ray " + v)[0];
        let current = entry.children[1].innerText;
        let current_n = parseInt(current.substr(1, current.length-2));

        current_n--;
        entry.children[1].innerText = "(" + current_n + ")";

        entry.classList.toggle("even", current_n % 2 == 0 && current_n > 0);
        entry.classList.toggle("odd", current_n % 2 == 1 && current_n > 0);
    });
    //checkWon();
    updateScore();
}

function updateScore() {
    let even = document.getElementsByClassName("ray even").length
    let odd = document.getElementsByClassName("ray odd").length
    //console.log(`Num even = ${even} Num odd = ${odd}`);

    let numBasis = document.getElementsByClassName("basis selected").length
    let basisDiv = document.getElementById("numBasis");
	if (basisDiv != null) {
		basisDiv.innerHTML = numBasis;

		basisDiv.classList.toggle("even", numBasis%2 == 0);
		basisDiv.classList.toggle("odd", numBasis%2 == 1);
	}

    let rays = document.getElementsByClassName("ray");

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

function checkWon() {
    const allEven = Array.prototype.slice.call(document.getElementsByClassName("ray")).every(e => !e.classList.contains("odd"));
    const numTurns = boardContainer.querySelectorAll(".board .circle.selected").length
				   + boardContainer.querySelectorAll(".basis.selected").length;
	
	const won = allEven && numTurns % 2 == 1;
	
	if(boardContainer != null) {
		boardContainer.classList.toggle("won", won);
	}
	if(document.querySelector(".moveCounter") != null) {
		document.querySelector(".moveCounter .inner").innerText = numTurns;
		document.querySelector(".moveCounter").classList.toggle("even", numTurns % 2 == 0 && numTurns > 0);
		document.querySelector(".moveCounter").classList.toggle("odd", numTurns % 2 == 1 && numTurns > 0);
	}

	if(document.querySelector("#does") != null) {
    	document.querySelector("#does").classList.toggle("won", won);
	}
}

function reset(clearDisplay = true) {
    Array.prototype.slice.call(document.querySelectorAll("#scoreboard .ray")).forEach(e => {
        e.children[1].innerText = "(0)";
        e.classList.remove("even");
        e.classList.remove("odd");
    });

    listeners.forEach(e => {
        e.classList.remove("selected");
    });
	
	if(document.querySelector(".moveCounter") != null) {
		document.querySelector(".moveCounter .inner").innerText = "0";
		document.querySelector(".moveCounter").classList.remove("even");
		document.querySelector(".moveCounter").classList.remove("odd");
	}
	
	if(boardContainer != null) {
		boardContainer.classList.remove("won");
	}
	if(document.querySelector("#does") != null) {
		document.querySelector("#does").classList.remove("won");
	}

    // reset displaySolution (optional)
    if (clearDisplay) {
        Array.prototype.slice.call(document.querySelectorAll("#displaySolutionContainer .ray")).forEach(e => {
            const bit = e.querySelector('.bit');
            if (bit) bit.innerText = '0';
            e.classList.remove("selected");
        });
    }
    updateScore();
}