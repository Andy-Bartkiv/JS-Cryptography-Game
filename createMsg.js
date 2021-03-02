// Picking random element of the array
function rndArr(arr) {
	return arr[Math.floor(Math.random() * arr.length)]
}

let difLvl = 1;
let msgBody = "";

fetch('/json/test.json')
    .then(response => response.json())
    .then(data => {
 //   let msgObj = createMsgItems(data);
 //   console.log("OBJ =", msgObj);
    msgBody = rndArr(data.coreMsg);
    if (difLvl <= 5) msgBody += " " + rndArr(data.bshtMsg);
    if (difLvl <= 4) msgBody =  rndArr(data.o1Msg) + " " + msgBody;
    if (difLvl <= 3) msgBody += " " + rndArr(data.c1Msg);
    if (difLvl <= 2) msgBody += " " + rndArr(data.c2Msg);
    if (difLvl <= 1) msgBody += " " + rndArr(data.o2Msg);
 //   msgBody = replaceNames(msgBody, msgObj);
    console.log("different JS ", msgBody);
    });

function createMsg() {
    return msgBody;
}

export default createMsg;
