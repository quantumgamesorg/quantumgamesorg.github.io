function startSimulation() {
    window.setInterval(simulate, 3000);
    document.getElementById("pauseButton").innerHTML = 'Pause'
    document.getElementById("pauseButton").onClick = pauseSimulation;
}  

function pauseSimulation() {
    window.clearInterval; 
    document.getElementById("pauseButton").innerHTML = 'Resume'
    document.getElementById("pauseButton").onClick = startSimulation;
}


window.onLoad = function() {
    startSimulation;
}


let content = document.getElementById("content");

let boardContainer = document.getElementById("boardContainer");
const defaultBoardContainerSize = { width: parseInt(getComputedStyle(boardContainer).width), height: parseInt(getComputedStyle(boardContainer).height) };

document.querySelectorAll("#upperLeft button")[0].onclick = () => pauseSimulation;
document.querySelectorAll("#upperLeft button")[1].onclick = () => document.querySelector("#win_about").classList.toggle("hidden");
document.querySelectorAll("#upperLeft button")[2].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > hr")[1].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
document.q
// document.querySelectorAll("#upperLeft button")[4].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > h2")[1].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
// document.querySelectorAll("#upperLeft button")[5].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > h2")[2].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
// document.querySelectorAll("#upperLeft button")[6].onclick = () => window.scrollTo({top: document.querySelectorAll("#content > h2")[3].getBoundingClientRect().top + window.pageYOffset - 40, behavior: "smooth"});
document.getElementById("toTop").onclick = () => window.scrollTo({top: 0, behavior: "smooth"});

document.querySelectorAll(".person").forEach((e, i) => {
    e.onmouseenter = ev => {
        document.querySelectorAll(".personDesc")[Math.floor(i / 3)].classList.toggle("highlight", true);
    };
    e.onmouseleave = ev => {
        document.querySelectorAll(".personDesc")[Math.floor(i / 3)].classList.toggle("highlight", false);
    };
});

function simulate() {
    //emmiter needs to light up first
    let emmiter = document.getElementById("emmiter");
    emmiter.style.backgroundColor = "yellow";
}