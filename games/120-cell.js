"use strict";

let content = document.getElementById("content");

let boardContainer = document.getElementById("boardContainer");

function make_120_Board(boardContainer, vals) {
    boardContainer.innerHTML = "";
    boardContainer.classList.add("board", "board-120");

    const keys = Object.keys(vals);
    const ROWS = 9;
    const COLS = 5;
    const TABLE_SHIFT_PX = -150;
    const BASIS_VALUES_GAP_PX = 1;
    const PANEL_WIDTH_PX = 220;
    const PANEL_HORIZONTAL_OFFSET_PX = -22; // manually tuned
    const maxVals = Math.max(1, ...Object.values(vals).map(arr => Array.isArray(arr) ? arr.length : 1));

    let wrapper = boardContainer.parentNode;
    if (!wrapper || !wrapper.classList || !wrapper.classList.contains('board-wrapper')) {
        const oldParent = boardContainer.parentNode;
        const newWrapper = document.createElement('div');
        newWrapper.className = 'board-wrapper';
        oldParent.replaceChild(newWrapper, boardContainer);
        newWrapper.appendChild(boardContainer);
        wrapper = newWrapper;
    }

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

    const table = boardContainer;
    panel.style.width = `${PANEL_WIDTH_PX}px`;
    panel.style.left = `calc(100% + ${PANEL_HORIZONTAL_OFFSET_PX}px)`;
    panel.style.top = `0px`;
    table.style.marginLeft = TABLE_SHIFT_PX + 'px';
    const panelDefaults = Array.from({length:16}, (_,r)=>[`R${r+1}C1`,`R${r+1}C2`,`R${r+1}C3`,`R${r+1}C4`]);
    panelDefaults[0] = ['A', 'B', 'C', 'D']; // 15-gon options

    function populatePanelGrid(data16x4) {
        const grid = panel.querySelector('.panel-grid');
        grid.innerHTML = '';
        for (let r = 0; r < 16; r++) {
            const rowData = data16x4[r] || ['', '', '', ''];
            const rowDiv = document.createElement('div');
            rowDiv.className = 'panel-row';
            if (r < 1) {
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

    const closeBtn = panel.querySelector('.panel-close');
    let currentSelected = null;

    function hidePanel() {
        if (currentSelected) currentSelected.classList.remove('selected');
        currentSelected = null;
        panel.classList.remove('visible');
    }

    closeBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        hidePanel();
    });

    if (wrapper._outsideClickHandler) {
        document.removeEventListener('click', wrapper._outsideClickHandler);
    }
    wrapper._outsideClickHandler = (ev) => {
        const clickedInsidePanel = panel.contains(ev.target);
        const clickedBasis = wrapper.contains(ev.target) && ev.target.closest('.basis.clickable');
        if (!clickedInsidePanel && !clickedBasis) {
            hidePanel();
        }
    };
    document.addEventListener('click', wrapper._outsideClickHandler);

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

                const valuesContainer = document.createElement('div');
                valuesContainer.className = 'values';
                valuesContainer.style.gridTemplateColumns = `repeat(${maxVals}, 1fr)`;

                for (let i = 0; i < maxVals; i++) {
                    const vDiv = document.createElement('div');
                    vDiv.className = 'val';
                    vDiv.textContent = (i < values.length) ? values[i] : '';
                    valuesContainer.appendChild(vDiv);
                }

                basisDiv.appendChild(valuesContainer);

                basisDiv.addEventListener('click', (ev) => {
                    const el = ev.currentTarget;

                    if (currentSelected && currentSelected !== el) {
                        currentSelected.classList.remove('selected');
                    }

                    const willSelect = !el.classList.contains('selected');
                    if (willSelect) {
                        el.classList.add('selected');
                        currentSelected = el;
                        const dynamicPanelData = [];
                        const firstRow = [];
                        for (let c = 0; c < 4; c++) {
                            const basis_number = values[c] || 0;
                            const index = Math.floor(basis_number / 15);
                            firstRow.push(String.fromCharCode(65 + index));
                        }
                        dynamicPanelData.push(firstRow);

                        dynamicPanelData.push(values);

                        for (let r = 2; r < 16; r++) {
                            const prevRow = dynamicPanelData[r - 1];
                            const newRow = [];
                            for (let c = 0; c < 4; c++) {
                                const prevVal = prevRow[c] || 0;
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
                        hidePanel();
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

	let circleMap = [];
    const dict = {
        "a": [1, 20, 274, 296],
        "b": [1, 42, 268, 291],
        "c": [1, 50, 245, 286],
        "d": [1, 65, 222, 289],
        "e": [1, 87, 230, 298],
        "f": [1, 95, 207, 292],
        "g": [1, 117, 185, 295],
        "h": [1, 155, 192, 215],
        "i": [1, 177, 200, 237],
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
        "a'": [46, 80, 235, 244],
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
createCalculationBits();

function createCalculationBits() {
    const container = document.getElementById('calculations');
    if (!container) return;
    if (container.dataset.calcBitsCreated) return;

    function processBits(bitsArray) {
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
            if (bitsArray[i] == 1) {
                SS = G(SS, s[i]);
            }
        }

        SS.sort((a, b) => {
            const aIsLower = a >= 'a' && a <= 'z';
            const bIsLower = b >= 'a' && b <= 'z';
            if (aIsLower && !bIsLower) return -1;
            if (!aIsLower && bIsLower) return 1;
            return a.localeCompare(b);
        });

        const bigCells = document.querySelectorAll('.big-cell');
        bigCells.forEach((cell, idx) => {
            if (idx < SS.length) {
                const letter = SS[idx];
                cell.dataset.letter = letter;

                // Bad logic to convert uppercase letters to lowercase with a prime symbol
                if (letter >= 'A' && letter <= 'Z') {
                    cell.textContent = `${letter.toLowerCase()}'`;
                } else {
                    cell.textContent = letter;
                }

                cell.className = 'big-cell off';
            } else {
                delete cell.dataset.letter;
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

    function printGreenLetters() { // Algorithm
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


        const greenLetters = Array.from(document.querySelectorAll('.big-cell.on')).map(c => c.dataset.letter || c.textContent).filter(text => text);
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

        let vv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (let i = 0; i < 45; i++) {
            if (uu[i] == 1) {
                vv = listAdd(vv, BG[i]);
            }
        }

        for (let i = 0; i < 20; i++) {
            numCells[i].textContent = String(vv[i]);
            numCells[i].classList.remove('off', 'on', 'zero');
            letterCells[i].classList.remove('off', 'on', 'zero');

            if (vv[i] === 0) {
                numCells[i].classList.add('zero');
                letterCells[i].classList.add('zero');
            } else if (vv[i] % 2 === 0) {
                numCells[i].classList.add('on');
                letterCells[i].classList.add('on');
            } else {
                numCells[i].classList.add('off');
                letterCells[i].classList.add('off');
            }
        }

        // Calc formula
        let num_twos = 0;
        let num_fours = 0;
        let num_sixes = 0;
        let num_eights = 0;
        for (let i = 0; i < 20; i++) {
            if (vv[i] == 2) num_twos++;
            else if (vv[i] == 4) num_fours++;
            else if (vv[i] == 6) num_sixes++;
            else if (vv[i] == 8) num_eights++;
        }

        num_twos = num_twos * 15;
        num_fours = num_fours * 15;
        num_sixes = num_sixes * 15;
        num_eights = num_eights * 15;

        document.getElementById("2_rays").textContent = num_twos;
        document.getElementById("4_rays").textContent = num_fours;
        document.getElementById("6_rays").textContent = num_sixes;
        document.getElementById("8_rays").textContent = num_eights;
        document.getElementById("bases_formula").textContent = ((num_twos * 2+ num_fours * 4 + num_sixes * 6+ num_eights * 8) / 4);

    }

    const containerWrap = document.createElement('div');
    containerWrap.className = 'calc-container';

    const bitsWrapper = document.createElement('div');
    bitsWrapper.className = 'calc-bits';

    const row1 = document.createElement('div');
    row1.className = 'calc-row';
    const row2 = document.createElement('div');
    row2.className = 'calc-row';

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
    setBtn.addEventListener('click', (e) => {
        numCells.forEach((cell, i) => {
            cell.textContent = '0';
            cell.classList.remove('off', 'on', 'zero');
            cell.classList.add('zero');
            letterCells[i].classList.remove('off', 'on', 'zero');
            letterCells[i].classList.add('zero');
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
    const calcBitsTarget = document.getElementById('calc-bits-wrapper') || container;
    calcBitsTarget.appendChild(containerWrap);


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
            cell.addEventListener('click', () => {
                if (cell.classList.contains('empty')) return;
                if (cell.classList.contains('on')) {
                    cell.classList.remove('on');
                    cell.classList.add('off');
                } else {
                    cell.classList.remove('off');
                    cell.classList.add('on');
                }
                printGreenLetters();
            });
            rowDiv.appendChild(cell);
        }
        boxesWrapper.appendChild(rowDiv);
    }

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
    bigSetBtn.addEventListener('click', () => {
        // reset number cells to 0
        numCells.forEach((cell, i) => {
            cell.textContent = '0';
            cell.classList.remove('off', 'on', 'zero');
            cell.classList.add('zero');
            letterCells[i].classList.remove('off', 'on', 'zero');
            letterCells[i].classList.add('zero');
        });
        const cells = boxesWrapper.querySelectorAll('.big-cell:not(.empty)');
        cells.forEach(c => { c.classList.remove('off'); c.classList.add('on'); });
        printGreenLetters();
        bigSetBtn.classList.add('pressed');
        bigSetBtn.disabled = true;
        setTimeout(() => { bigSetBtn.classList.remove('pressed'); bigSetBtn.disabled = false; }, 180);
    });

    const letterArea = document.createElement('div');
    letterArea.className = 'letter-area';
    const letterBlock = document.createElement('div');
    letterBlock.className = 'letter-block';

    const letterRow = document.createElement('div');
    letterRow.className = 'letter-row';
    const numRow = document.createElement('div');
    numRow.className = 'num-row';

    const letters = Array.from({length:20}, (_,i) => String.fromCharCode(65 + i)); // A..T
    const numbers = Array(20).fill(0);

    const letterCells = [];
    const numCells = [];
    for (let i = 0; i < 20; i++) {
        const L = document.createElement('div');
        L.className = 'letter-cell';
        L.textContent = letters[i] || '';
        const n = numbers[i] || 0;
        if (n === 0) {
            L.classList.add('zero');
        } else if (n % 2 === 0) {
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
            if (numbers[i] === 0) N.classList.add('zero');
            else if (numbers[i] % 2 === 0) N.classList.add('on');
            else N.classList.add('off');
        }
        numRow.appendChild(N);
        numCells.push(N);
    }

    letterBlock.appendChild(letterRow);
    letterBlock.appendChild(numRow);
    letterArea.appendChild(letterBlock);

    const letterControls = document.createElement('div');
    letterControls.className = 'big-controls';
    letterArea.appendChild(letterControls);

    const letterAreaTarget = document.getElementById('letter-area-wrapper') || container;
    letterAreaTarget.appendChild(letterArea);

    container.dataset.calcBitsCreated = '1';
}

function reset() {
    document.querySelectorAll('.calc-bit').forEach(btn => {
        btn.classList.remove('on');
        btn.textContent = '0';
    });
    document.querySelectorAll('.big-cell').forEach(cell => {
        cell.className = 'big-cell empty';
        cell.textContent = '';
    });
    document.querySelectorAll('.letter-cell').forEach(cell => {
        cell.classList.remove('off', 'on', 'zero');
        cell.classList.add('zero');
    });
    document.querySelectorAll('.num-cell').forEach(cell => {
        cell.textContent = '0';
        cell.classList.remove('off', 'on', 'zero');
        cell.classList.add('zero');
    });

    document.getElementById("2_rays").textContent = 0;
    document.getElementById("4_rays").textContent = 0;
    document.getElementById("6_rays").textContent = 0;
    document.getElementById("8_rays").textContent = 0;
    document.getElementById("bases_formula").textContent = 0;
}

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
            const uppercaseLetter = sortedSS[i];
            bigCells[i].dataset.letter = uppercaseLetter;
            bigCells[i].textContent = `${uppercaseLetter.toLowerCase()}'`;
            bigCells[i].className = 'big-cell off';
        } else {
            delete bigCells[i].dataset.letter;
            bigCells[i].textContent = '';
            bigCells[i].className = 'big-cell';
        }
    }
}
