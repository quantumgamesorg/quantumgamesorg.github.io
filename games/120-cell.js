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
    const TABLE_SHIFT_PX = -120;

    // Inject isolated styles for this board (do not rely on pre-existing styles)
    if (!document.getElementById('basis-120-styles')) {
        const style = document.createElement('style');
        style.id = 'basis-120-styles';
        style.textContent = `
            /* Container table rules */
            #boardContainer { border-collapse: collapse; width: 100%; table-layout: fixed; }
            #boardContainer tr { }
            #boardContainer td { padding: 6px; vertical-align: top; border: 0; background: transparent; }

            /* Each basis block: fixed key column + grid of values
               Use a fixed key width so value columns line up across rows. */
            .basis { display: flex; gap: 4px; align-items: center; width: 100%; background: transparent; }
            /* key area contains the key text and an equal sign aligned across rows */
            .basis .key { font-weight: 700; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 0 0 40px; width: 100px; display:flex; align-items:center; gap:6px; }
            .basis .key .key-text { overflow: hidden; text-overflow: ellipsis; }
            .basis .key .eq { flex: 0 0 14px; width: 14px; text-align: center; opacity:0.95; }
            .basis .values { display: grid; gap: 3px; width: 100%; }
            .basis .val { text-align: center; font-family: monospace; }
            .basis.clickable { cursor: pointer; }
            /* Selection colors are adjustable via the CSS variables below */
            .basis.selected { outline: 2px solid var(--basis-selected-outline, rgba(0,150,0,0.35)); background-color: var(--basis-selected-bg, rgba(0,150,0,0.06)); border-radius:4px; }

            /* Wrapper and panel for left-side popup */
            .board-wrapper { display: block; position: relative; }
            .basis-panel { position: absolute; width: 200px; box-shadow: 0 6px 18px rgba(0,0,0,0.08); background: #fff; border: 1px solid #eee; padding: 6px; box-sizing: border-box; display: none; z-index: 30; font-size:12px; }
            .basis-panel.visible { display: block; }
            .basis-panel .panel-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:6px; font-weight:700; font-size:13px; }
            .basis-panel .panel-close { cursor:pointer; border:0; background:transparent; font-size:12px; line-height:1; }
            /* panel rows: each row is a grid of 4 cells with a divider between rows */
            .basis-panel .panel-grid { display: block; }
            .basis-panel .panel-row { display: grid; grid-template-columns: repeat(4, 1fr); gap:2px; align-items:center; border-bottom:1px solid #eee; }
            .basis-panel .panel-row:last-child { border-bottom: none; }
            .basis-panel .panel-cell { padding:4px 2px; text-align:center; border: none; font-family: monospace; line-height:1; }
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
    panel.style.left = `calc(100% + 12px)`;
    panel.style.top = `0px`;

    // Nudge the table horizontally using the adjustable value above
    table.style.marginLeft = TABLE_SHIFT_PX + 'px';

    // Default panel data (16 rows x 4 values) - easy to change here
    // Change `panelDefaults` to modify the displayed numbers later
    const panelDefaults = Array.from({length:16}, (_,r)=>[`R${r+1}C1`,`R${r+1}C2`,`R${r+1}C3`,`R${r+1}C4`]);

    // Helper to populate panel-grid with a 16x4 array
    function populatePanelGrid(data16x4) {
        const grid = panel.querySelector('.panel-grid');
        grid.innerHTML = '';
        for (let r = 0; r < 16; r++) {
            const rowData = data16x4[r] || ['', '', '', ''];
            const rowDiv = document.createElement('div');
            rowDiv.className = 'panel-row';
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
                        // populate panel (for now we use panelDefaults; you can change this mapping)
                        populatePanelGrid(panelDefaults);
                        panel.querySelector('.panel-title').textContent = el.dataset.key + ' orbit';
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
