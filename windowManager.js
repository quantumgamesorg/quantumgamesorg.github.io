
var activeWindow = null

// check window.open for information
// this just provides consistency and decent default settings
function OpenWindow({url, name='subwindow', width=600, height=800}={}) {
	try {
		activeWindow = window.open(url, name, `width=${width}px, height=${height}px`)
		// resize corrections, add another 15 to width for scroll bar
		width += 16 
		height += 70
		activeWindow.resizeTo(width, height)
	}
	catch(e) {
		console.error(e)
	}
}

OpenWindow()
activeWindow.close()

window.onbeforeunload = () => { if(activeWindow != null) activeWindow.close() }