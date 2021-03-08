let data = { // UGLY substitution to FETCH JSON 
    "city":["Washington", "Bogota", "Caracas", "Havana", "Kingston", "Los Angeles", "Managua", "Medellin", "Mexico City", "Miami", "Nassau", "Panama City", "Rio de Janeiro", "San Juan"],
    "crimOrg":["Amazon Cartel", "Colombian Cartel", "Haitian Junta", "Jamaican Gang", "Tupamaros", "FLN", "M18", "Shining Way", "Mercenaries", "Dignity Battalion", "Death Squads"],
    "target":["Air-Base ID cards", "Embassy Visitor Passes", "Summit ID Documents"],
    "coreMsg":["We have a job for you. I hope your lockpicks are in order. A sample ${targ} is required. Acquire one and report to the paymaster.",
              "You are required to make a sensitive delivery. Bring a wrist-cuffed briefcase.",
              "The ${targ} has been acquired. Awaiting further instructions and payment.",
              "You are to pick up the ${targ} and deliver it to our special operative.",
              "I represent your employer. Turn the ${targ} over to me. Don't worry about payment - your check is already in the mail.",
              "Apply your special talents to this item. A perfect duplicate is required. We will make it worth your while."
            ],
    "bshtMsg":["None doubt your loyalty.",
            "Some aspects of the situation remain unclear.",
            "Our enemies are on the verge of collapse.",
            "Your organization is noted for these activities and your assistance will be rewarded.",
            "Deviations from this plan are not acceptable.",
            "Destiny is our ally.",
            "Our power increases with each passing day."
            ],
    "c1Msg":["Our project here in ${city1} proceeds on schedule.",
            "Our recruiting in ${city1} has been quite successful.",
            "The struggle in ${city1} advances from triumph to victory.",
            "Having a wonderful time in ${city1} wish you were here.",
            "All ${city1} echoes with praise of your success."
            ],
    "c2Msg":["We are confident your work in ${city2} will continue on schedule.",
            "Send us details of your activities in ${city2}.",
            "How is ${city2} this time of year.",
            "Take precautions ${city2} is dangerous.",
            "Send us details of your activities in ${city2}."
            ],
    "o1Msg":["${org1} is ready to reward you for your success.",
            "${org1} may be assisting in this operation.",
            "${org1} is ready to reward you for your success.",
            "This operation has the approval of ${org1} high command.",
            "We of the ${org1} commend your excellent work."
            ],
    "o2Msg":["Fellow warriors of the ${org2} now is the time for action.",
            "We welcome cooperation with the ${org2}.",
            "Thanks for your assistance ${org2}.",
            "Your success assures the goodwill of ${org2}.",
            "We note the heroic actions of the ${org2}."
            ]
}

function createMainGrid(msg1, msg2) {
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
    for (let i in abc) {
        for (let j=1; j<4; j++) { // filling left grid by rows
            let newDiv = document.createElement("div");
            newDiv.className = `lgr${j}`;
            newDiv.innerHTML = {1:"_", 2: abc[i], 3: "0"}[j]
            document.getElementById("left-container").appendChild(newDiv);
        }
    }
}

// Initial green letters of scrumbled msg slowly appears in game terminal  
function animateMainGrid(lvl, t=25) {
    mode = 3;
    [...topCells].forEach((element, i) => {
        sleep(i*t).then(() => {
            bottomCells[i].style.color = null; 
            element.style.color = null;
            if (abc.indexOf(element.innerHTML) >= 0)
                lgr3[abc.indexOf(element.innerHTML)].innerHTML = 
                    parseInt(lgr3[abc.indexOf(element.innerHTML)].innerHTML) + 1;
        });
    });
    sleep(t*orgMsg.length).then(() => {
        [...bottomCells].forEach(element => element.style.color = null);
        mode = 1;
        if (lvl <= 0)
        for (let i=0; i<4; i++) {
            mode = 1;
            showOneLetter(0,i*2.5)
        }
        if (lvl == 1) showOneLetter(0,5)
        setInterval(function(){ 
            if (score >= 0 && mode == 1) score -= 1;
            if (score < 0) score = 0;
            timerDiv.innerHTML = score;
        }, 1000);
    });
}

function generateMsg(data, difLvl) {
    let msgObj = createMsgItems(data);
    msgBody = rndArr(data.coreMsg);
    if (difLvl <= 5) msgBody += " " + rndArr(data.bshtMsg);
    if (difLvl <= 4) msgBody =  rndArr(data.o1Msg) + " " + msgBody;
    if (difLvl <= 3) msgBody += " " + rndArr(data.c1Msg);
    if (difLvl <= 2) msgBody += " " + rndArr(data.c2Msg);
    if (difLvl <= 1) msgBody += " " + rndArr(data.o2Msg);
    return replaceNames(msgBody, msgObj);
}

// Encrypting filtered Msg according to the key
function encryptMsg(msg, key) {
    let res = '';
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

// counting appearance of SYM in the MSG
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
    if (mode !== 3) {
        mode = 3; // Game ended by Give-UP
        score = 0;
        // displaying letters from original Msg and fading green letters
        [...bottomCells].forEach((element, i) => {
            sleep(i*t).then(() => { 
                element.style.backgroundColor = null;
                element.style.color = null;
                char = (orgMsg[i] == ' ') ? "&nbsp" : orgMsg[i]
                element.innerHTML = orgMsg[i];
                topCells[i].style.color = colorDarkGreen;
            });
        });
        // Fading vertical green letters 
        for (let i in abc) lgr2[i].style.color = colorDarkGreen;
        // 
        sleep(topCells.length*t).then (() => {
            msgDiv.style.color = colorGreenYellow;
            timerDiv.style.color = colorGreenYellow;
            document.getElementsByClassName("letter-input")[0].style.color = "transparent";
            msgDiv.innerHTML = "MSG DECODED";
            // show original Msg in separate window.
            showModal(sourceMsg);
        });
        // displaying vertical blue letters
        for (let i in abc) lgr1[abc.indexOf(scrumbleKey[i])].innerHTML = abc[i];
    }
}

// HINT mode = only one letter is showed after iterating through all blue letters
function showOneLetter(lvl=difLvl, t=7) {
    if (mode !== 3) {
        mode = 3;
        timerDiv.setAttribute('style', 'color: #66D9EF')
        lgr1[abc.indexOf(char2)].style.backgroundColor = null;
        lgr1[abc.indexOf(char2)].style.color = null;
        [...bottomCells].forEach((element, i) => {
            sleep(i*t).then(() => { 
                element.style.backgroundColor = colorSkyBlue;
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
                    document.getElementById("B" + i).removeAttribute('style');
                }
            }
            mode = 1;
            score -= lvl*15; 
            score = (score < 0) ? 0 : score;
            timerDiv.removeAttribute('style');
            timerDiv.innerHTML = score;
        });
    }
}

function restartGame() {
    document.location.reload(true);
}
function exitToMain() {
    sleep(500).then(() => {
        window.location.replace("index.html");
    });
}
// Picking random element of the array
 function rndArr(arr) {
 	return arr[Math.floor(Math.random() * arr.length)]
}
// Picking longest element of the array (DVP Function)
function longestStr(arr) {
    let res = 0;
	arr.forEach((el, ind) => {if (el.length > arr[res].length) res = ind})
    return arr[res];
}
// create object of Items to fill placeholders = ${} to form message
function createMsgItems(data) {
	return {
		targ: rndArr(data.target),
		city1: rndArr(data.city),
		city2: rndArr(data.city),
		org1: rndArr(data.crimOrg),
		org2: rndArr(data.crimOrg),
	}
}
// replacing placeholders ${} in STR with correct Items from OBJ
function replaceNames(str, obj) {
	for (key in obj) {
		let exp = "${"+key+"}";
		if (str.indexOf(exp) >= 0)
			str = str.replace(exp, obj[key]);
	}
	return str;
} 
// display decoded msg new line each sentence
function splitByDot(str) {
    let res = str.split(".");
    str = "";
    res.forEach(p => str += p + ".<br>");
    return str.slice(0,-5);
} 
// display decoded msg at the end
function showModal(str) {
    let modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.getElementById("modal-text").innerHTML= splitByDot(str);
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
const colorSkyBlue = "#87ceeb";
const colorGreenYellow = "#ADFF2F"
const colorDarkGreen = "#070"
const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const difLvl = (localStorage.getItem("Crypto-Game-Level")) ? localStorage.getItem("Crypto-Game-Level") : 1;

// Creating message to be coded

// fetch('/json/test.json')
//     .then(response => response.json())
//     .then(data => {

        let sourceMsg  = generateMsg(data, difLvl);

        // sourceMsg = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Est, itaque? Eos deleniti quisquam, odio cum quidem reiciendis velit incidunt dolorem cupiditate laborum tempora nisi pariatur sapiente necessitatibus? Reprehenderit numquam eveniet harum, consequatur ab totam assumenda. Cupiditate repellendus, voluptates exercitationem nostrum magni inventore dolorem sed eveniet recusandae consequuntur excepturi libero nihil officiis facere eos beatae cumque culpa corporis harum ipsum. Illo praesentium quae libero eum aliquam quis corporis commodi sequi."

        let orgMsg = filterMsg(sourceMsg.toUpperCase(), difLvl);

        // SCRUMBLING ABC-order to get a random encryption Key//
        let scrumbleKey = scrumble(abc);
        let scrMsg = encryptMsg(orgMsg, scrumbleKey);
        createLeftGrid();
        createMainGrid(orgMsg, scrMsg);

        const lgr1 = document.getElementsByClassName("lgr1");
        const lgr2 = document.getElementsByClassName("lgr2");
        const lgr3 = document.getElementsByClassName("lgr3");
        const topCells = document.getElementsByClassName("cell-top");
        const bottomCells = document.getElementsByClassName("cell-bottom");
        const timerDiv = document.getElementById("timer");
        const msgDiv = document.getElementById("msg");
        let mode = 1; // Game mode: 1=normal flow, 3=animation in progress

        // key used to count hints (each time excludes one letter from this key)
        let hintKey = abc.split("").filter(ch => countSymbols(orgMsg, ch) > 0).join("");
        let idMg = [];
        let char = char2 = "A";
        
        const msgNum = "MSG #" + orgMsg[0] + difLvl + "." + orgMsg.length;
        msgDiv.innerHTML = msgNum;
        
        let score = difLvl * 60 * 5;
        timerDiv.innerHTML = score;
        
        animateMainGrid(difLvl, 15);

    // });  //------------ JSON processing closing brackets

// - - -  Menu Buttons

document.getElementById("btn-hint").addEventListener('click', () => showOneLetter());

document.getElementById("btn-exit").addEventListener('click', () => exitToMain());
document.getElementById("btn-restart").addEventListener('click', () => restartGame());
document.getElementById("btn-giveup").addEventListener('click', () => showAllLetters());

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
                document.getElementById(val).style.color = colorGreenYellow;
            });
            lgr1[abc.indexOf(char)].style.backgroundColor = "#229";
            lgr1[abc.indexOf(char)].style.color = colorGreenYellow;
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

}); // END OF KEYBOARD EVENT LISTENER --------------------------------------
