// Dreamweaver (or something else locally) likes to run scripts twice, which breaks games loading as it can run their scripts twice
// The main culpret is the use of let, so we use it here to prevent loading twice
let LOAD_RERUN_PROTECTION = true;

let params = new URL(document.location.toString()).searchParams;
let game = params.get("game");

// used for dreamweaver preview
if (game == null) game = "600-cell-2";

function FetchGame(url) {
	console.log("Loading Game: " + url)
	var el = document.getElementById("game_content");
	fetch("games_content/" + url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.text();
		})
		.then((text) => {
			setInnerHTML(el, text);
		})
		.catch((error) => {
			el.innerHTML = `Could not fetch game: ${error}`;
		})
}

function setInnerHTML(elm, html) {
elm.innerHTML = html;

Array.from(elm.querySelectorAll("script"))
	.forEach( oldScriptEl => {
		if (oldScriptEl.src == "" || oldScriptEl.src.includes("/static/")) {
			return;
		}
		console.log(oldScriptEl);
	
		const newScriptEl = document.createElement("script");

		Array.from(oldScriptEl.attributes).forEach( attr => {
			newScriptEl.setAttribute(attr.name, attr.value) 
		});

		const scriptText = document.createTextNode(oldScriptEl.innerHTML);
		newScriptEl.appendChild(scriptText);

		oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
	});
}

window.onload = FetchGame(game + ".html");

