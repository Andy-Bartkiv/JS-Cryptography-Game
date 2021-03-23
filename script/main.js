function getRndChar(str) {
    return str[Math.floor(Math.random() * str.length)]
}
function getCharSet(min=48, max=122) {
    let str = "";
    for (let i=min; i<max+1; i++)
        if (i<91 || i>96)
            str += String.fromCharCode(i);
    return str;
}
function rndNum(max) {
    return Math.floor(Math.random() * max);
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function setFire(el, t=1000) {
    el.style.color = colorGreen;
    sleep(t).then(() => {
        el.removeAttribute("style");
    }); 
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
const COL = 80;
const ROW = 40;
const charSet = getCharSet(48, 122);
const colorGreen = '#adff2f'; // '#0f0'

for (let i=0; i < COL; i++) {
    let newDiv = document.createElement("div");
    newDiv.innerHTML = "";
    document.querySelector(".main-grid").appendChild(newDiv);
    for (let j=0; j < ROW; j++) {
        let newCh = document.createElement("div");
        newCh.className = 'cell';
        newCh.id = `c-${i}-${j}`;
        newCh.innerHTML = getRndChar(charSet);
        newDiv.appendChild(newCh);
    }
}
let mainLoop = setInterval(() => {
    let el = document.getElementById(`c-${rndNum(COL)}-0`)
    let pos = el.id.split("-"); // c - #col - #row
    let drainCol = setInterval(animateDrain, 50*(rndNum(3)+1));
    let i = Number(pos[2]);
    function animateDrain() {
        setFire(document.getElementById(`c-${pos[1]}-${i}`), 500);
        i++;
        if (i>= ROW) clearInterval(drainCol);
    }
}, 1000);
