"use strict";

let content = document.getElementById("content");

let boardContainer = document.getElementById("boardContainer");

function make_120_Board(boardContainer, vals) {
    // Clear any existing board
    boardContainer.innerHTML = "";
    boardContainer.classList.add("board", "board-120");

    const keys = Object.keys(vals);
    const ROWS = 9;
    const COLS = 5;
    // Adjustable table horizontal shift in pixels. Negative moves the table left.
    // Change this value to nudge the table horizontally.
    const TABLE_SHIFT_PX = -150;

    // Gap between numbers in a basis display.
    const BASIS_VALUES_GAP_PX = 1;
    // Horizontal offset of the popup panel from the main board.
    const PANEL_HORIZONTAL_OFFSET_PX = -1;

    // Inject isolated styles for this board (do not rely on pre-existing styles)
    if (!document.getElementById('basis-120-styles')) {
        const style = document.createElement('style');
        style.id = 'basis-120-styles';
        style.textContent = `
            /* Container table rules */
            #boardContainer { border-collapse: collapse; width: 100%; table-layout: fixed; }
            #boardContainer tr { }
            #boardContainer td { padding: 8px; vertical-align: top; border: 0; background: transparent; }

            /* Each basis block: fixed key column + grid of values
               Use a fixed key width so value columns line up across rows. */
            .basis { display: flex; gap: 1px; align-items: center; width: 100%; background: transparent; }
            /* key area contains the key text and an equal sign aligned across rows */
            .basis .key { font-weight: 700; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 0 0 40px; width: 100px; display:flex; align-items:center; justify-content: space-between; font-size:16px; }
            .basis .key .key-text { overflow: hidden; text-overflow: ellipsis; }
            .basis .key .eq { flex: 0 0 14px; width: 14px; text-align: center; opacity:0.95; }
            .basis .values { display: grid; gap: 1px; width: 100%; }
            .basis .val { text-align: center; font-family: monospace; font-size:16px; }
            .basis.clickable { cursor: pointer; }
            /* Selection colors are adjustable via the CSS variables below */
            .basis.selected { outline: 2px solid var(--basis-selected-outline, rgba(0,150,0,0.35)); background-color: var(--basis-selected-bg, rgba(0,150,0,0.06)); border-radius:4px; }

            /* Wrapper and panel for left-side popup */
            .board-wrapper { display: block; position: relative; }
            .basis-panel { position: absolute; width: 260px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); background: #fff; border: 1px solid #eee; padding: 8px; box-sizing: border-box; display: none; z-index: 30; font-size:16px; }
            .basis-panel.visible { display: block; }
            .basis-panel .panel-header { display:flex; justify-content:center; align-items:center; margin-bottom:8px; font-weight:700; font-size:18px; position: relative; }
            .basis-panel .panel-close { cursor:pointer; border:0; background:transparent; font-size:16px; line-height:1; position: absolute; right: 8px; }
            /* panel rows: each row is a grid of 4 cells with a divider between rows */
            .basis-panel .panel-grid { display: block; }
            .basis-panel .panel-row { display: grid; grid-template-columns: repeat(4, 1fr); gap:4px; align-items:center; border-bottom:1px solid #eee; }
            .basis-panel .panel-row:last-child { border-bottom: none; }
            .basis-panel .panel-cell { padding:6px 4px; text-align:center; border: none; font-family: monospace; line-height:1; }
            .basis-panel .panel-row.panel-row-bold .panel-cell { font-weight: bold; font-size: 24px;}
        `;
        document.head.appendChild(style);
    }

    // Compute maximum number of values in any basis so columns align perfectly
    const maxVals = Math.max(1, ...Object.values(vals).map(arr => Array.isArray(arr) ? arr.length : 1));

    // Ensure the table is inside a wrapper so we can position a left-hand popup
    let wrapper = boardContainer.parentNode;
    if (!wrapper || !wrapper.classList || !wrapper.classList.contains('board-wrapper')) {
        const oldParent = boardContainer.parentNode;
        const newWrapper = document.createElement('div');
        newWrapper.className = 'board-wrapper';
        // replace boardContainer in DOM with wrapper, then move table into wrapper
        oldParent.replaceChild(newWrapper, boardContainer);
        newWrapper.appendChild(boardContainer);
        wrapper = newWrapper;
    }

    // Create the popup panel (left of table)
    let panel = wrapper.querySelector('.basis-panel');
    if (!panel) {
        panel = document.createElement('div');
        panel.className = 'basis-panel';
        panel.innerHTML = `
            <div class="panel-header"><span class="panel-title">Basis</span><button class="panel-close">✕</button></div>
            <div class="panel-grid"></div>
        `;
        wrapper.appendChild(panel);
    }

    // Position the panel to the right of the table and align to top
    const table = boardContainer; // it's a <table id="boardContainer"> in the HTML
    const panelWidth = 260;
    // place panel to the right of the table (adjustable spacing)
    panel.style.left = `calc(100% + ${PANEL_HORIZONTAL_OFFSET_PX}px)`;
 
    panel.style.top = `0px`;

    // Nudge the table horizontally using the adjustable value above
    table.style.marginLeft = TABLE_SHIFT_PX + 'px';

    // Default panel data (16 rows x 4 values) - easy to change here
    // Change `panelDefaults` to modify the displayed numbers later
    const panelDefaults = Array.from({length:16}, (_,r)=>[`R${r+1}C1`,`R${r+1}C2`,`R${r+1}C3`,`R${r+1}C4`]);
    panelDefaults[0] = ['A', 'B', 'C', 'D'];
    // Panel will be populated dynamically based on the selected basis

    // Helper to populate panel-grid with a 16x4 array
    function populatePanelGrid(data16x4) {
        const grid = panel.querySelector('.panel-grid');
        grid.innerHTML = '';
        for (let r = 0; r < 16; r++) {
            const rowData = data16x4[r] || ['', '', '', ''];
            const rowDiv = document.createElement('div');
            rowDiv.className = 'panel-row';
            if (r < 1) { // Apply bolding to the first two rows
                rowDiv.classList.add('panel-row-bold');
            }
            for (let c = 0; c < 4; c++) {
                const cell = document.createElement('div');
                cell.className = 'panel-cell';
                cell.textContent = rowData[c] || '';
                rowDiv.appendChild(cell);
            }
            grid.appendChild(rowDiv);
        }
    }

    // Wire up close button to hide panel and clear selection
    const closeBtn = panel.querySelector('.panel-close');
    let currentSelected = null;
    closeBtn.addEventListener('click', () => {
        if (currentSelected) currentSelected.classList.remove('selected');
        currentSelected = null;
        panel.classList.remove('visible');
    });

    let idx = 0;
    for (let r = 0; r < ROWS; r++) {
        const tr = document.createElement('tr');
        for (let c = 0; c < COLS; c++) {
            const td = document.createElement('td');
            td.style.width = (100 / COLS) + '%';

            if (idx < keys.length) {
                const key = keys[idx];
                const values = vals[key] || [];

                const basisDiv = document.createElement('div');
                basisDiv.className = 'basis clickable';
                basisDiv.setAttribute('role', 'button');
                basisDiv.dataset.key = key;
                const keyDiv = document.createElement('div');
                keyDiv.className = 'key';
                const keyText = document.createElement('span');
                keyText.className = 'key-text';
                keyText.textContent = key;
                const eqSpan = document.createElement('span');
                eqSpan.className = 'eq';
                eqSpan.textContent = '=';
                keyDiv.appendChild(keyText);
                keyDiv.appendChild(eqSpan);
                basisDiv.appendChild(keyDiv);

                // values container uses CSS grid; columns set so each basis has same count
                const valuesContainer = document.createElement('div');
                valuesContainer.className = 'values';
                valuesContainer.style.gridTemplateColumns = `repeat(${maxVals}, 1fr)`;

                // Add each value; if fewer than maxVals, pad with empty placeholders so alignment stays consistent
                for (let i = 0; i < maxVals; i++) {
                    const vDiv = document.createElement('div');
                    vDiv.className = 'val';
                    vDiv.textContent = (i < values.length) ? values[i] : '';
                    valuesContainer.appendChild(vDiv);
                }

                basisDiv.appendChild(valuesContainer);

                // Click handler: highlight selection, update panel, and keep single selection
                basisDiv.addEventListener('click', (ev) => {
                    const el = ev.currentTarget;
                    // if another element was selected, unselect it
                    if (currentSelected && currentSelected !== el) {
                        currentSelected.classList.remove('selected');
                    }
                    // toggle selection on clicked element
                    const willSelect = !el.classList.contains('selected');
                    if (willSelect) {
                        el.classList.add('selected');
                        currentSelected = el;
                        // populate panel dynamically based on new rules
                        console.log(el.dataset.key);
                        const dynamicPanelData = [];

                        // Row 1: Calculated based on the basis values
                        const firstRow = [];
                        for (let c = 0; c < 4; c++) {
                            const basis_number = values[c] || 0; // handle cases with less than 4 values
                            const index = Math.floor(basis_number / 15);
                            firstRow.push(String.fromCharCode(65 + index));
                        }
                        dynamicPanelData.push(firstRow);

                        // Row 2: values from the selected basis (not calculated)
                        dynamicPanelData.push(values);

                        // For rows 3-16, increment the previous value in that column by one.
                        // If the new value is a multiple of 15 + 1, decrease by 15.
                        // The calculation starts from dynamicPanelData[2] (Row 3).
                        for (let r = 2; r < 16; r++) { // Loop for rows 3 to 16
                            const prevRow = dynamicPanelData[r - 1]; // Previous row for calculation
                            const newRow = [];
                            for (let c = 0; c < 4; c++) {
                                const prevVal = prevRow[c] || 0; // handle cases with less than 4 values
                                let nextVal = prevVal + 1;
                                if (nextVal > 1 && nextVal % 15 === 1) {
                                    nextVal -= 15;
                                }
                                newRow.push(nextVal);
                            }
                            dynamicPanelData.push(newRow);
                        }

                        populatePanelGrid(dynamicPanelData);
                        panel.querySelector('.panel-title').textContent = el.dataset.key + '';
                        panel.classList.add('visible');
                    } else {
                        el.classList.remove('selected');
                        currentSelected = null;
                        panel.classList.remove('visible');
                    }
                });

                td.appendChild(basisDiv);
            }

            tr.appendChild(td);
            idx++;
        }
        table.appendChild(tr);
    }
    
}

function setupBoard() {
	const defaultBoardContainerSize = { width: parseInt(getComputedStyle(boardContainer).width), height: parseInt(getComputedStyle(boardContainer).height) };
	// const defaultBoardContainerSize = { width: , height: };

	let circleMap = [];
    const dict = {
        "a": [1, 20, 274, 296],
        "b": [1, 42, 268, 291],
        "c": [1, 50, 245, 286],
        "d": [1, 65, 222, 289],
        "e": [1, 87, 230, 298],
        "f": [1, 95, 207, 292],
        "g": [1, 117, 200, 237],
        "h": [1, 155, 192, 215],
        "i": [16, 177, 200, 237],
        "j": [16, 20, 265, 266],
        "k": [16, 65, 228, 275],
        "l": [16, 102, 193, 280],
        "m": [16, 117, 221, 246],
        "n": [16, 139, 178, 259],
        "o": [16, 140, 176, 268],
        "p": [16, 147, 177, 256],
        "q": [31, 35, 280, 281],
        "r": [31, 87, 224, 267],
        "s": [31, 95, 231, 244],
        "t": [31, 110, 199, 262],
        "u": [31, 125, 155, 271],
        "v": [31, 132, 156, 274],
        "w": [31, 133, 154, 283],
        "x": [46, 65, 183, 269],
        "y": [46, 64, 224, 253],
        "z": [46, 79, 201, 280],
        "a'": [46, 80, 201, 280],
        "b'": [46, 94, 200, 247],
        "c'": [46, 110, 184, 250],
        "d'": [46, 125, 168, 246],
        "e'": [46, 139, 156, 251],
        "f'": [61, 80, 212, 229],
        "g'": [61, 94, 209, 215],
        "h'": [61, 118, 131, 298],
        "i'": [61, 116, 193, 224],
        "j'": [61, 140, 162, 234],
        "k'": [76, 94, 141, 289],
        "l'": [76, 96, 199, 228],
        "m'": [76, 118, 183, 237],
        "n'": [76, 132, 170, 218],
        "o'": [91, 116, 187, 200],
        "p'": [91, 124, 172, 192],
        "q'": [106, 148, 160, 200],
        "r'": [121, 123, 156, 163],
        "s'": [136, 138, 171, 178],
        };
	make_120_Board(boardContainer, dict);
}
setupBoard();
// create the two-row calculation bits (15 on top, 14 below)
createCalculationBits();

function createCalculationBits() {
    const container = document.getElementById('calculations');
    if (!container) return;
    if (container.dataset.calcBitsCreated) return;

    // New function to process the bits
    function processBits(bitsArray) {
        console.log('Bits array:', bitsArray);
        // Add your logic here

        let s = [];
        s[0] = ['j', 'q'];
        s[1] = ['j', 'R'];
        s[2] = ['j', 'S'];
        s[3] = ['n', 'o'];
        s[4] = ['n', 'p'];
        s[5] = ['u', 'v'];
        s[6] = ['u', 'w'];

        s[7] = ['c', 'd', 'j', 'y'];
        s[8] = ['c', 'e', 'j', 'A'];
        s[9] = ['c', 'f', 'j', 'B'];
        s[10] = ['c', 'g', 'j', 'C'];
        s[11] = ['d', 'e', 'j', 'F'];
        s[12] = ['d', 'f', 'j', 'G'];
        s[13] = ['d', 'g', 'j', 'I'];
        s[14] = ['e', 'f', 'j', 'L'];
        s[15] = ['e', 'g', 'j', 'M'];
        s[16] = ['f', 'g', 'j', 'O'];

        s[17] = ['a', 'b', 'd', 'e', 'k', 'r'];
        s[18] = ['a', 'b', 'f', 'g', 'l', 't'];
        s[19] = ['b', 'c', 'k', 'l', 's', 'x'];
        s[20] = ['a', 'h', 'k', 'l', 'm', 's', 'u', 'H'];
        s[21] = ['a', 'b', 'h', 'i', 'j', 'l', 'm', 'n', 's', 'Q'];
        s[22] = ['a', 'c', 'd', 'e', 'f', 'g', 'k', 'l', 'm', 'z'];
        s[23] = ['a', 'c', 'f', 'g', 'h', 'i', 'm', 's', 'u', 'D'];
        s[24] = ['b', 'c', 'f', 'g', 'h', 'i', 'm', 'n', 's', 'E'];
        s[25] = ['f', 'g', 'h', 'i', 'j', 'l', 'm', 's', 'u', 'P'];
        s[26] = ['a', 'b', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 's', 'J'];
        s[27] = ['b', 'd', 'e', 'f', 'g', 'i', 'k', 'l', 'm', 'n', 's', 'K'];
        s[28] = ['d', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 's', 'u', 'N'];
        s[29] = ['j'];



        let SS = ['j'];

        for (let i = 0; i < bitsArray.length; i++) {
            // Example logic: just log the index and value of each bit
            // console.log(`Bit ${i}: ${bitsArray[i]}`);
            if (bitsArray[i] == 1) {
                SS = G(SS, s[i]);
            }
            // console.log(s[bitsArray[i]]);

        }

        // Sort SS. put all lowercase letters first and sort those a-z. Then all uppercase letters later. Sort A-Z
        SS.sort((a, b) => {
            const aIsLower = a >= 'a' && a <= 'z';
            const bIsLower = b >= 'a' && b <= 'z';
            if (aIsLower && !bIsLower) return -1; // a is lowercase, b is uppercase
            if (!aIsLower && bIsLower) return 1;  // a is uppercase, b is lowercase
            return a.localeCompare(b); // both are same case, sort alphabetically
        });

        // Set the big boxes to the sorted SS values
        const bigCells = document.querySelectorAll('.big-cell');
        bigCells.forEach((cell, idx) => {
            if (idx < SS.length) {
                cell.textContent = SS[idx];
                cell.className = 'big-cell off';
                // make clickable
                cell.addEventListener('click', () => {
                    if (cell.classList.contains('on')) {
                        cell.classList.remove('on');
                        cell.classList.add('off');
                    } else {
                        cell.classList.remove('off');
                        cell.classList.add('on');
                    }
                    printGreenLetters();
                });
            } else {
                cell.textContent = '';
                cell.className = 'big-cell empty';
            }
        });

        

    }

    function listAdd(l1, l2) {
        let new_list = [];

        for (let i = 0; i < l1.length; i++) {
            new_list[i] = l1[i] + l2[i];
        }

        return new_list;
    }

    function G(l1, l2) {
        // Take the exclusive or of two lists (symmetric difference)
        const set = new Set(l1);
        for (const item of l2) {
            if (set.has(item)) {
                set.delete(item);
            } else {
                set.add(item);
            }
        }
        return Array.from(set);
    }

    function printGreenLetters() {
        let BG = [];
        BG[0] = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1];
        BG[1] = [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1];
        BG[2] = [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1];
        BG[3] = [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        BG[4] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1];
        BG[5] = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
        BG[6] = [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1];
        BG[7] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0];
        BG[8] = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0];
        BG[9] = [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0];
        BG[10] = [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0];
        BG[11] = [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
        BG[12] = [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0];
        BG[13] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0];
        BG[14] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0];
        BG[15] = [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0];
        BG[16] = [0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0];
        BG[17] = [0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0];
        BG[18] = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0];
        BG[19] = [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0];
        BG[20] = [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
        BG[21] = [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
        BG[22] = [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
        BG[23] = [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0];
        BG[24] = [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0];
        BG[25] = [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0];
        BG[26] = [0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0];
        BG[27] = [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0];
        BG[28] = [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
        BG[29] = [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0];
        BG[30] = [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0];
        BG[31] = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
        BG[32] = [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0];
        BG[33] = [0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        BG[34] = [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0];
        BG[35] = [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0];
        BG[36] = [0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
        BG[37] = [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0];
        BG[38] = [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0];
        BG[39] = [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0];
        BG[40] = [0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
        BG[41] = [0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0];
        BG[42] = [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0];
        BG[43] = [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        BG[44] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0];


        // collect and print all green letters
        const greenLetters = Array.from(document.querySelectorAll('.big-cell.on')).map(c => c.textContent).filter(text => text);
        console.log('Green letters:', greenLetters);
        let uu = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (const letter of greenLetters) {
            // translate letter to number: a=1, b=2, ..., z=26, A=27, B=28, ..., Z=52 and set uu[num] to 1
            let num = 0;
            if (letter >= 'a' && letter <= 'z') {
                num = letter.charCodeAt(0) - 'a'.charCodeAt(0) + 0;
            } else if (letter >= 'A' && letter <= 'Z') {
                num = letter.charCodeAt(0) - 'A'.charCodeAt(0) + 26;
            }
            uu[num] = 1;
        }
        console.log('uu array:', uu);

        let vv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < 45; i++) {
            if (uu[i] == 1) {
                vv = listAdd(vv, BG[i]);
            }
        }

        console.log('vv array:', vv);

        // Update the number cells with vv values
        for (let i = 0; i < 20; i++) {
            numCells[i].textContent = String(vv[i]);
            if (vv[i] % 2 === 0) {
                numCells[i].classList.remove('off');
                numCells[i].classList.add('on');
                letterCells[i].classList.remove('off');
                letterCells[i].classList.add('on');
            } else {
                numCells[i].classList.remove('on');
                numCells[i].classList.add('off');
                letterCells[i].classList.remove('on');
                letterCells[i].classList.add('off');
            }
        }

    }

    // Inject styles for the calculation bits and the Set button
    if (!document.getElementById('calc-bit-styles')) {
        const style = document.createElement('style');
        style.id = 'calc-bit-styles';
        style.textContent = `
            .calc-container { display: flex; gap: 12px; align-items: flex-start; }
            .calc-bits { display: inline-flex; flex-direction: column; gap: 6px; }
            .calc-row { display: flex; gap: 8px; }
            .calc-bit {
                width: 34px;
                height: 34px;
                border-radius: 6px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                cursor: pointer;
                user-select: none;
                background: #fbb;
                color: #600;
                border: 1px solid #c44;
                box-sizing: border-box;
            }
            .calc-bit.on {
                background: #bfb;
                color: #063;
                border: 1px solid #3a3;
            }
            .calc-controls { display: flex; flex-direction: column; gap: 8px; }
            .calc-set-btn {
                appearance: none;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                background: linear-gradient(#dff8e8, #bff4c7);
                color: #063;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 2px 0 #0002, inset 0 1px 0 #fff;
            }
            /* Big boxes layout (39 boxes: 15+15+9) - touching horizontally and vertically */
            .big-area { display: flex; gap: 12px; align-items: flex-start; margin-top: 8px; }
            .big-boxes { display: flex; flex-direction: column; gap: 0; }
            .big-row { display: flex; gap: 0; }
            .big-cell {
                width: 34px;
                height: 34px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #000;
                background: #fff; /* default white */
                box-sizing: border-box;
                font-weight: 600;
                margin: 0;
                cursor: pointer;
                user-select: none;
                /* make cells appear as round buttons while still touching each other */
                border-radius: 50%;
            }
            .big-cell.on { background: #bfb; color: #063; border-color: #3a3; }
            .big-cell.off { background: #fbb; color: #600; border-color: #c44; }
            .big-cell.empty { background: #fff; color: #000; cursor: default; }
            /* Letter / number area */
            .letter-area { display: flex; gap: 12px; align-items: flex-start; margin-top: 12px; }
            .letter-block { display: flex; flex-direction: column; gap: 0; }
            .letter-row, .num-row { display: flex; gap: 0; }
            .letter-cell {
                width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center;
                border: 1px solid #000; box-sizing: border-box; font-weight: 700; margin: 0;
            }
            .letter-cell.on { background: #bfb; color: #063; border-color: #3a3; }
            .letter-cell.off { background: #fbb; color: #600; border-color: #c44; }
            .num-cell { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid #000; box-sizing: border-box; margin: 0; cursor: pointer; }
            .num-cell.on { background: #bfb; color: #063; border-color: #3a3; }
            .num-cell.off { background: #fbb; color: #600; border-color: #c44; }
            .big-controls { display: flex; flex-direction: column; gap: 8px; }
            .big-set-btn {
                appearance: none;
                border: none;
                padding: 8px 12px;
                border-radius: 6px;
                background: linear-gradient(#dff8e8, #bff4c7);
                color: #063;
                font-weight: 700;
                cursor: pointer;
                box-shadow: 0 2px 0 #0002, inset 0 1px 0 #fff;
            }
            /* spacing for the three main calculation sections */
            .calc-section { margin-bottom: 18px; }
        `;
        document.head.appendChild(style);
    }

    const containerWrap = document.createElement('div');
    containerWrap.className = 'calc-container';

    const bitsWrapper = document.createElement('div');
    bitsWrapper.className = 'calc-bits';

    const row1 = document.createElement('div');
    row1.className = 'calc-row';
    const row2 = document.createElement('div');
    row2.className = 'calc-row';

    // top row: 15 bits
    for (let i = 0; i < 15; i++) {
        let btn = document.createElement('div');
        btn.className = 'calc-bit';
        btn.textContent = '0';
        btn.setAttribute('role', 'button');
        btn.dataset.index = i;
        btn.addEventListener('click', () => {
            const isOn = btn.classList.toggle('on');
            btn.textContent = isOn ? '1' : '0';
        });
        row1.appendChild(btn);
    }

    // second row: 14 bits
    for (let i = 0; i < 14; i++) {
        let btn = document.createElement('div');
        btn.className = 'calc-bit';
        btn.textContent = '0';
        btn.setAttribute('role', 'button');
        btn.dataset.index = 15 + i;
        btn.addEventListener('click', () => {
            const isOn = btn.classList.toggle('on');
            btn.textContent = isOn ? '1' : '0';
        });
        row2.appendChild(btn);
    }

    bitsWrapper.appendChild(row1);
    bitsWrapper.appendChild(row2);

    const controls = document.createElement('div');
    controls.className = 'calc-controls';
    const setBtn = document.createElement('button');
    setBtn.className = 'calc-set-btn';
    setBtn.textContent = 'Set';
    // visual feedback on click (no other purpose yet)
    setBtn.addEventListener('click', (e) => {
        // reset number cells to 0
        numCells.forEach((cell, i) => {
            cell.textContent = '0';
            cell.classList.remove('off');
            cell.classList.add('on');
            letterCells[i].classList.remove('off');
            letterCells[i].classList.add('on');
        });
        const bits = Array.from(document.querySelectorAll('.calc-bit')).map(btn => parseInt(btn.textContent));
        processBits(bits);
        setBtn.classList.add('pressed');
        setBtn.disabled = true;
        setTimeout(() => { setBtn.classList.remove('pressed'); setBtn.disabled = false; }, 180);
    });
    controls.appendChild(setBtn);

    containerWrap.appendChild(bitsWrapper);
    containerWrap.appendChild(controls);
    // Preferserting into explicit wrapper divs in the HTML, falling back to the container
    const calcBitsTarget = document.getElementById('calc-bits-wrapper') || container;
    calcBitsTarget.appendChild(containerWrap);

    // --- 39 plain boxes: two rows of 15, one row of 9 ---
    // All start empty, white, unclickable

    const boxesWrapper = document.createElement('div');
    boxesWrapper.className = 'big-boxes';
    const rowCounts = [15, 15, 9];
    for (let r = 0; r < rowCounts.length; r++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'big-row';
        for (let c = 0; c < rowCounts[r]; c++) {
            const cell = document.createElement('div');
            cell.className = 'big-cell empty';
            cell.textContent = '';
            rowDiv.appendChild(cell);
        }
        boxesWrapper.appendChild(rowDiv);
    }
    // Put boxes and its Set button into a horizontal area so the button sits to the right
    const bigArea = document.createElement('div');
    bigArea.className = 'big-area';
    const bigControls = document.createElement('div');
    bigControls.className = 'big-controls';
    const bigSetBtn = document.createElement('button');
    bigSetBtn.className = 'big-set-btn';
    bigSetBtn.textContent = 'Set';
    bigSetBtn.addEventListener('click', () => {
        bigSetBtn.classList.add('pressed');
        bigSetBtn.disabled = true;
        setTimeout(() => { bigSetBtn.classList.remove('pressed'); bigSetBtn.disabled = false; }, 180);
    });
    bigControls.appendChild(bigSetBtn);
    bigArea.appendChild(boxesWrapper);
    bigArea.appendChild(bigControls);
    const bigBoxesTarget = document.getElementById('big-boxes-wrapper') || container;
    bigBoxesTarget.appendChild(bigArea);
    // big Set button behavior: set all non-empty big cells to green and print green letters
    bigSetBtn.addEventListener('click', () => {
        // reset number cells to 0
        numCells.forEach((cell, i) => {
            cell.textContent = '0';
            cell.classList.remove('off');
            cell.classList.add('on');
            letterCells[i].classList.remove('off');
            letterCells[i].classList.add('on');
        });
        const cells = boxesWrapper.querySelectorAll('.big-cell:not(.empty)');
        cells.forEach(c => { c.classList.remove('off'); c.classList.add('on'); });
        printGreenLetters();
        bigSetBtn.classList.add('pressed');
        bigSetBtn.disabled = true;
        setTimeout(() => { bigSetBtn.classList.remove('pressed'); bigSetBtn.disabled = false; }, 180);
    });

    // --- Letter/Number block (20 letters A-T, 20 numbers below) ---
    const letterArea = document.createElement('div');
    letterArea.className = 'letter-area';
    const letterBlock = document.createElement('div');
    letterBlock.className = 'letter-block';

    const letterRow = document.createElement('div');
    letterRow.className = 'letter-row';
    const numRow = document.createElement('div');
    numRow.className = 'num-row';

    const letters = Array.from({length:20}, (_,i) => String.fromCharCode(65 + i)); // A..T
    // starting counts at zero
    const numbers = Array(20).fill(0);

    // create letter cells and number cells
    const letterCells = [];
    const numCells = [];
    for (let i = 0; i < 20; i++) {
        const L = document.createElement('div');
        L.className = 'letter-cell';
        L.textContent = letters[i] || '';
        // initial color based on parity of corresponding number
        const n = numbers[i] || 0;
        if (n % 2 === 0) {
            L.classList.add('on');
        } else {
            L.classList.add('off');
        }
        letterRow.appendChild(L);
        letterCells.push(L);

        const N = document.createElement('div');
        N.className = 'num-cell';
        N.textContent = (numbers[i] !== undefined) ? String(numbers[i]) : '';
        if (numbers[i] !== undefined) {
            if (numbers[i] % 2 === 0) N.classList.add('on'); else N.classList.add('off');
        }
        // clicking the number toggles parity (increment by 1) and updates the letter color
        N.addEventListener('click', () => {
            if (!N.textContent) return;
            let val = parseInt(N.textContent, 10);
            if (Number.isNaN(val)) return;
            val = val + 1; // toggles parity
            N.textContent = String(val);
            if (val % 2 === 0) {
                N.classList.remove('off'); N.classList.add('on');
                letterCells[i].classList.remove('off'); letterCells[i].classList.add('on');
            } else {
                N.classList.remove('on'); N.classList.add('off');
                letterCells[i].classList.remove('on'); letterCells[i].classList.add('off');
            }
        });
        numRow.appendChild(N);
        numCells.push(N);
    }

    letterBlock.appendChild(letterRow);
    letterBlock.appendChild(numRow);
    letterArea.appendChild(letterBlock);

    // optionally add a small control area (empty for now) to the right
    const letterControls = document.createElement('div');
    letterControls.className = 'big-controls';
    letterArea.appendChild(letterControls);

    const letterAreaTarget = document.getElementById('letter-area-wrapper') || container;
    letterAreaTarget.appendChild(letterArea);

    container.dataset.calcBitsCreated = '1';
}

// Function to process the bits and update the big cells
function processBits(bits) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const SS = [];
    for (let i = 0; i < Math.min(bits.length, letters.length); i++) {
        if (bits[i] === 1) SS.push(letters[i]);
    }
    const sortedSS = SS.sort();
    const bigCells = document.querySelectorAll('.big-cell');
    for (let i = 0; i < bigCells.length; i++) {
        if (i < sortedSS.length) {
            bigCells[i].textContent = sortedSS[i];
            bigCells[i].className = 'big-cell off'; // red for letter
        } else {
            bigCells[i].textContent = '';
            bigCells[i].className = 'big-cell'; // white for empty
        }
    }
}
