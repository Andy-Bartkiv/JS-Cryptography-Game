function createMainGrid(msg1, msg2) {
    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let c1 = c2 = "_";
    for (let i in msg1) {
        if (msg2[i] == ' ') c2 = "&nbsp";
        else c2 = msg2[i];

        if (msg1[i] == ' ') c1 = "&nbsp";
        else if (abc.indexOf(String(msg1[i])) < 0) c1 = c2;
        else c1 = "_"

        let newDiv = document.createElement("div");
        newDiv.className = 'cell'
        newDiv.innerHTML = "<div class='cell-top' style = 'color: #000'>" + c2 + "</div>"
            + "<div class='cell-bottom' id='B" + i + "' style = 'color: #000'>" + c1 + " </div>";
        document.getElementById("main-grid").appendChild(newDiv);
    }
}

function createLeftGrid() {
    let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i in abc) {
        // Creating DIV element
        let newDiv = document.createElement("div");
        newDiv.className = "lg-row";
        newDiv.innerHTML = "<div class='lgr1'>" + "_" + "</div>"
        + "<div class='lgr2'>" + abc[i] + "</div>"
        + "<div class='lgr3'>" + 0 + "</div>";
        document.getElementById("left-container").appendChild(newDiv);
    }
}

// Initial green letters of scrumbled msg slowly appears in game terminal  
function animateMainGrid(lvl, t=25) {
    mode = 3;
    [...topCells].forEach((element, i) => {
        sleep(i*t).then(() => { 
            element.style.color = null;
            if (abc.indexOf(element.innerHTML) >= 0)
                lgr3[abc.indexOf(element.innerHTML)].innerHTML = 
                    parseInt(lgr3[abc.indexOf(element.innerHTML)].innerHTML) + 1;
        });
    });
    sleep(t*orgMsg.length).then(() => {
        [...bottomCells].forEach(element => element.style.color = null);
        mode = 1;
        if (lvl <= 1) showOneLetter(0,0)
        if (lvl <= 0)
            for (let i=0; i<4; i++) {
                mode = 1;
                showOneLetter(0,0)
        }
        setInterval(function(){ 
            if (score >= 0 && mode == 1) score -= 1;
            if (score < 0) score = 0;
            document.getElementById("timer").innerHTML = score;
        }, 1000);
    });
}

// Encrypting filtered Msg according to the key
function encryptMsg(msg, key) {
    let res = '';
    const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let c of msg)
        res += (abc.indexOf(String(c)) < 0) ? c : key[abc.indexOf(String(c))];
    return res;
}

//  Filtering the original Msg, depending on difficulty lvl 
function filterMsg(msg, lvl) {
    let res = msg;
    if (lvl == 3) res = msg.replace(/\s/g,"")
    else if (lvl > 3) res = msg.replace(/\s|\./g,"")
    return res;
}

// counting appearence of SYM in the MSG
function countSymbols(msg, sym) {
    let res = 0;
    for (let i in msg) res += (msg[i] === sym) ? 1 : 0;
    return res;
}

// removing certain sym, positioned at POS index in MSG
function removeSymbol(msg, pos) {
    let arr = msg.split("");
    arr.splice(pos, 1);
    return arr.join("")
}

// Scrumble key generator
function scrumble(msg) {
    return msg.split("")
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value)
    .join("");
}

// sleeping function, requires THEN when used
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// GIVE UP mode = showing all letters in original Msg
function showAllLetters(t=7) {
    mode = 3; // Game ended by Give-UP
    score = 0;
    // displaying letters from original Msg and fading green letters
    [...bottomCells].forEach((element, i) => {
        sleep(i*t).then(() => { 
            element.style.backgroundColor = null;
            element.style.color = null;
            char = (orgMsg[i] == ' ') ? "&nbsp" : orgMsg[i]
            element.innerHTML = orgMsg[i];
            topCells[i].style.color = '#070';
        });
    });
    // Fading vertical green letters 
    for (let i in abc) lgr2[i].style.color = '#070';
    // 
    sleep(topCells.length*t).then (() => {
        document.getElementById("msg").style.color = "#ADFF2F";
        document.getElementsByClassName("main-top")[0].style.backgroundColor = "#115"
        document.getElementById("msg").innerHTML = "MSG DECODED";
        // displaying original Msg in separate window.
        alert(sourceMsg);
    });
    // displaying vertical blue letters
    for (let i in abc) lgr1[abc.indexOf(scrumbleKey[i])].innerHTML = abc[i];

}

// HINT mode = only one leter is showed after iterating through all blue letters
function showOneLetter(lvl=difLvl, t=7) {
    if (mode !== 3) {
        mode = 3;
        lgr1[abc.indexOf(char2)].style.backgroundColor = null;
        lgr1[abc.indexOf(char2)].style.color = null;
        [...bottomCells].forEach((element, i) => {
            sleep(i*t).then(() => { 
                element.style.backgroundColor = "#87ceeb";
                element.style.color = null;
            });
            sleep(t+i*t).then(() => { element.style.backgroundColor = null });
        });
        sleep(t*orgMsg.length).then(() => { 
            let indexHint = Math.floor(Math.random() * hintKey.length);
            char = hintKey[indexHint];
            hintKey = removeSymbol(hintKey, indexHint);
            if (hintKey.length <= 0) hintKey = "A" ////  !!!!! TO BE CHANGED   
            lgr1[abc.indexOf(scrumbleKey[abc.indexOf(char)])].innerHTML = char;
            lgr1[abc.indexOf(scrumbleKey[abc.indexOf(char)])].style.backgroundColor = null;
            lgr1[abc.indexOf(scrumbleKey[abc.indexOf(char)])].style.color = null;
            for (let i in orgMsg) { // Getting all the indexes of selected letter
                if (orgMsg[i] == char) {
                    document.getElementById("B" + i).innerHTML = char;
                    document.getElementById("B" + i).style.backgroundColor = null;
                    document.getElementById("B" + i).style.color = null;
                }
            }
            mode = 1;
            score -= lvl*15; 
            score = (score < 0) ? 0 : score;
        });
    }
}

function restartGame() {
    // let res = confirm("Are you sure you want to ReSTART the game?\nAll your progress will be lost!");
    // if (res) 
        document.location.reload(true);
}

function exitToMain() {
    // let res = confirm("Are you sure you want to EXIT the game?\nAll your progress will be lost!");
    // if (res) 
        window.location.replace("index.html");
}



// Creating message to be coded
const cities = ["Washington", "Bogota", "Caracas", "Havana", "Kingston"];
const crimOrgs = ["Amazon Cartel", "Colombian Cartel", "Haitian Junta", "Jamaican Gang", "Tupamaros"];
const targets = ["US Ambassy", "Nuclear Plant"];
let index = Math.floor(Math.random() * crimOrgs.length);
let org1 = crimOrgs.splice(index, 1);
index = Math.floor(Math.random() * cities.length);
let org2 = crimOrgs.splice(index, 1);
index = Math.floor(Math.random() * cities.length);
let city1 = cities.splice(index, 1);
index = Math.floor(Math.random() * cities.length);
let city2 = cities.splice(index, 1);
index = Math.floor(Math.random() * targets.length);
let targ = targets.splice(index, 1);

const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let sourceMsg = `You are instructed to acquire current passwords for the ${targ}. A courier will arrive shortly to pick up this information.`;

const difLvl = localStorage.getItem("Crypto-Game-Level");

if (difLvl <= 5) sourceMsg += " " + `None doubt your loyalty.`;
if (difLvl <= 4) sourceMsg = `${org1} is ready to reward you for your success.` + " " + sourceMsg;
if (difLvl <= 3) sourceMsg += " " + `Our project here in ${city1} proceeds on schedule.`;
if (difLvl <= 2) sourceMsg += " " + `We are confident your work in ${city2} will continue on schedule.`;
if (difLvl <= 1) sourceMsg += " " + `Fellow warriors of the ${org2} now is the time for action.`;

let orgMsg = filterMsg(sourceMsg.toUpperCase(), difLvl);
// SCRUMBLING ABC-order to get a random encryption Key//
let scrumbleKey = scrumble(abc);
let scrMsg = encryptMsg(orgMsg, scrumbleKey);
createLeftGrid();
createMainGrid(orgMsg, scrMsg);
let lgr1 = document.getElementsByClassName("lgr1");
let lgr2 = document.getElementsByClassName("lgr2");
let lgr3 = document.getElementsByClassName("lgr3");
let topCells = document.getElementsByClassName("cell-top");
let bottomCells = document.getElementsByClassName("cell-bottom");
let mode = 1; // Game mode: 1=normal flow, 3=animation in progress
// key used to count hints (each time excludes one letter from this key)
let hintKey = abc.split("").filter(ch => countSymbols(orgMsg, ch) > 0).join("");
let idMg = [];
let char = char2 = "A";

const msgNum = "MSG #" + orgMsg[0] + difLvl + "." + orgMsg.length;
document.getElementById("msg").innerHTML = msgNum;

let score = difLvl * 60 * 5;
document.getElementById("timer").innerHTML = score;

animateMainGrid(difLvl, 5);


// - - - KEYBOARD EVENTS - - -------------------------------------------------------------------------

document.addEventListener('keydown', event => {

    char = String.fromCharCode(event.keyCode);
    index = abc.indexOf(char);
    console.log(char, index);

// if any letter is pressed ------------------------------------------------------------------------------
    if ((index >= 0) || (event.keyCode == 32)) { // choosing phase
        if ((mode == 1) && (event.keyCode != 32)) {// cannot choose " " to substitute
            mode = 0; char2 = char;
            idMg = [];
            for (let i in scrMsg) { // Getting all the indexes of selected letter
                if (scrMsg[i] == char) idMg.push("B" + i);
            }
            idMg.forEach(val => {
                document.getElementById(val).style.backgroundColor = "#252";
                document.getElementById(val).style.color = "#ADFF2F";
            });
            lgr1[abc.indexOf(char)].style.backgroundColor = "#229";
            lgr1[abc.indexOf(char)].style.color = "#ADFF2F";
        }
        else if (mode == 0) { // substitution phase
            mode = 1;
            idMg.forEach(val => {
                document.getElementById(val).innerHTML = (event.keyCode !== 32) ? char : "_";
                document.getElementById(val).style.backgroundColor = null;
                document.getElementById(val).style.color = null;
            });
            lgr1[abc.indexOf(char2)].innerHTML = (event.keyCode !== 32) ? char : "_";
            lgr1[abc.indexOf(char2)].style.backgroundColor = null;
            lgr1[abc.indexOf(char2)].style.color = null;
        }
    }

// getting 1 hint by pressin "1" KEY
    if (event.keyCode == 49 && mode !== 3) {
        showOneLetter(difLvl);
    }
// KEY = "2" - END of the Game - testing
    if (event.keyCode == 50) { 
        showAllLetters();
    }
    if (event.keyCode == 51) { // KEY = 3
        alert("1 = hint \n2 = solve \n3 = help \n4 = exit");
    }
    if (event.keyCode == 52) { // KEY = 4
        exitToMain();
    }

}); // END OF KEYBOARD EVENT LISTENER --------------------------------------
