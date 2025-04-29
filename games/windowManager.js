
var activeWindows = {}

// check window.open for information
// this just provides consistency and decent default settings
function OpenWindow({url, name='subwindow', width=600, height=800}={}) {
	try {
		activeWindows[name] = window.open(url, name, `width=${width}px, height=${height}px`)
		if (activeWindows[name] == null) {
			console.warn(`OpenWindow ${url} failed`)
			return;
		}
		// resize corrections, add another 15 to width for scroll bar
		width += 16 
		height += 70
		activeWindows[name].resizeTo(width, height)
	}
	catch(e) {
		console.error(e)
	}
}

window.onbeforeunload = () => {
	for (const key in activeWindows) {
		activeWindows[key].close();
	}
}