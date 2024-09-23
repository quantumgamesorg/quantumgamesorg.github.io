function makeBoard(boardContainer, vals) {

    boardContainer.classList.add("board");

    for(let gy = 0; gy < 5; gy++) {

        let gridTableRow = document.createElement("tr");

        for(let gx = 0; gx < 5; gx++) {

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
                

                basisRow.onclick = () => {
                    if(basisRow.classList.toggle("selected")) {
                        addValues(basis_vals);
                    } else {
                        removeValues(basis_vals);
                    }
                    updateScore();
                };

                basisRow.onmouseenter = () => {
                    basis_vals.forEach(v => {
                        document.getElementsByClassName(`ray ${v}`)[0].classList.add("highlight");
                    });
                };
            
                basisRow.onmouseleave = () => {
                    basis_vals.forEach(v => {
                        document.getElementsByClassName(`ray ${v}`)[0].classList.remove("highlight");
                    });
                };

             
            }
            gridTableRow.appendChild(gridTableSpot);

            //gridRow.appendChild(gridSpot);
        }

        boardContainer.appendChild(gridTableRow);
        //board.appendChild(gridRow);
    }

    buildScoreboard(15, 4);
}

function buildScoreboard(height, width) {
    let scoreTable = document.getElementById("scoreboard");
	for (let gy = 0; gy < height; gy++) {
		let gridTableRow = document.createElement("tr");
		
		for (let gx = 0; gx < width; gx++) {
			let index = 1 + gy + gx * height;
			
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
}

function removeValues(values) {
    values.forEach(v => {
        let entry = document.getElementsByClassName("ray " + v)[0];;
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
    const numTurns = boardContainer.querySelectorAll(".board .circle.selected").length;

    boardContainer.querySelector(".moveCounter .inner").innerText = numTurns;
    boardContainer.querySelector(".moveCounter").classList.toggle("even", numTurns % 2 == 0 && numTurns > 0);
    boardContainer.querySelector(".moveCounter").classList.toggle("odd", numTurns % 2 == 1 && numTurns > 0);

    const won = allEven && numTurns % 2 == 1;
    boardContainer.classList.toggle("won", won);

    document.querySelector("#does").classList.toggle("won", won);
}

function reset() {
    Array.prototype.slice.call(document.querySelectorAll("#scoreboard .ray")).forEach(e => {
        e.children[1].innerText = "(0)";
        e.classList.remove("even");
        e.classList.remove("odd");
    });

    Array.prototype.slice.call(boardContainer.querySelectorAll(".board .basis")).forEach(e => {
        e.classList.remove("selected");
    });

    updateScore();
}