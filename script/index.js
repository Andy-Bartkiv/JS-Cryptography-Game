function setLevel() {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        let currentLevel = document.getElementById("level").value;
        localStorage.setItem("Crypto-Game-Level", currentLevel);
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}
function displayScore() {
// Check browser support
if (typeof (Storage) !== "undefined") {
    if (localStorage.getItem("Crypto-Game-Level") == null) 
        localStorage.setItem("Crypto-Game-Level", 1);
    document.getElementById("level").value = localStorage.getItem("Crypto-Game-Level");
    } else {
        alert("Sorry, your browser does not support Web Storage...");
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function exitTo(location, t = 500) {
// show TV power-off animation
    document.querySelector('.tv').classList.add('_off');
    document.querySelector('.container').innerHTML = "";
    sleep(t).then(() => {
        window.location.replace(location);
    });
}
document.getElementById("btn-info").addEventListener('click', () => exitTo("infoCW.html"));   
document.getElementById("btn-start").addEventListener('click', () => exitTo("gameCW.html"));  