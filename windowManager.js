var mydragg = function(){
    return {
        move : function(divid,xpos,ypos){
            divid.style.left = xpos + 'px';
            divid.style.top = ypos + 'px';
        },
        startMoving : function(divid,container,evt){
            evt = evt || window.event;
            var posX = evt.clientX,
                posY = evt.clientY,
            divTop = divid.style.top,
            divLeft = divid.style.left,
            eWi = divid.clientWidth;
            eHe = divid.clientHeight;
            cWi = container.clientWidth;
            cHe = container.clientHeight;
            container.style.cursor='move';
            divTop = divTop.replace('px','');
            divLeft = divLeft.replace('px','');
            var diffX = posX - divLeft,
                diffY = posY - divTop;
            document.onmousemove = function(evt){
                if (evt.buttons == 0) {
                    mydragg.stopMoving(container);
                    return;
                }
                evt = evt || window.event;
                var posX = evt.clientX,
                    posY = evt.clientY,
                    aX = posX - diffX,
                    aY = posY - diffY;
                    if (aX < 0) aX = 0;
                    if (aY < 0) aY = 0;
                    if (aX + eWi > cWi) aX = cWi - eWi;
                    if (aY + eHe > cHe) aY = cHe -eHe;
                mydragg.move(divid,aX,aY);
            }
        },
        stopMoving : function(container){
            var a = document.createElement('script');
            container.style.cursor='default';
            document.onmousemove = function(){}
        },
    }
}();

function initWindows(container) {
    container.querySelectorAll(".window").forEach(win => {
        const content_html = win.innerHTML;

        win.innerHTML = "";

        let topBar = document.createElement("div");
        topBar.classList.add("topBar");
        win.appendChild(topBar);
        let close = document.createElement("button");
        close.classList.add("close");
        topBar.appendChild(close);

        let content = document.createElement("div");
        content.classList.add("content");
        content.innerHTML = content_html;
        win.appendChild(content);

        topBar.onmousedown = e => mydragg.startMoving(win, container, e);
        win.onmouseup = e => mydragg.stopMoving(container);

        close.onclick = () => win.classList.toggle("hidden", true);
    });
}

initWindows(document.getElementById("windowContainer"));