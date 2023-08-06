class AudioCylinder {
    constructor(cylinderNo) {
        this.cylinderNo;
        this.cylinder = [];
    }
    play(uri) {
        let audio = new Audio(uri);
        audio.play();
        this.cylinder.push(audio);
        if (this.cylinder.length > this.cylinderNo) {
            this.cylinder.shift();
        }
    }
}
class GaraponSound {
    constructor(soundDict, numOfCylinder, allowance) {
        this.soundArrayURI = Object.values(soundDict);
        this.soundDict = soundDict;
        this.audioCylinder = new AudioCylinder(numOfCylinder);
        this.allowance = allowance;
        this.inPlayArray = new Array(this.soundArrayURI.length);
        this.inPlayArray = this.inPlayArray.fill(0);
        this.qCounter = 0;
        this.hitCount = 0;
        this.errorCount = 0;
        this.available = false;
        this.currentSound = -1;
    }
    reset() {
        for (let i = 0; i < this.inPlayArray.length; i++) {
            let elem = document.getElementById("p" + i);
            elem.style = "background-color: white";
        }
        this.inPlayArray = this.inPlayArray.fill(0);
        this.qCounter = 0;
        this.hitCount = 0;
        this.errorCount = 0;
        this.available = false;
    }
    playRandomSound() {
        let ct = new Date().getTime();
        let candidate = 0;
        do {
            candidate = Math.trunc(Math.random() * this.inPlayArray.length);
//            console.log(ct - this.inPlayArray[candidate]);
        } while ((ct - this.inPlayArray[candidate]) <= this.allowance);
        this.currentSound = candidate;
        console.log(this.getKey(this.soundArrayURI[candidate]) + ":" + candidate);
        this.inPlayArray[candidate] = new Date().getTime();
        this.qCounter++;
        if (this.available) {
            this.makeSomeNoise();
        }
        this.available = true;
        G.qCountDisplay.innerHTML = this.qCounter;
        G.scoreDisplay.innerHTML = calcScore();
        this.playN(candidate);
    }
    playN(n) {
        this.audioCylinder.play(this.soundArrayURI[n]);
    }
    getKey(val) {
        for (let key of Object.keys(this.soundDict)) {
            if (this.soundDict[key] == val) {
                return key;
            }
        }
    }
    makeSomeNoise() {
        this.audioCylinder.play("./sounds/buzzer.mp3");
    }
}


class GlobalManager {
    constructor() {
        this.speedParm = [
            [0, 3000],      // at first, interval would be 2 sec.
            [10000, 2000],    // after 15 sec., it would be 1.5 sec.
            [20000, 1500],    // after 15 sec., it would be 1.5 sec.
            [30000, 0],      // then stop after 20 sec.
/*
            [0, 1000],      // at first, interval would be 1 sec.
            [10000, 800],    // after 10 sec., it would be 0.8 sec.
            [19600,  600],
            [29800,  400],
            [39800,  300],
            [50000,  200],
            [60000,  0],      // then stop after 60 sec.
*/
        ];
        this.soundDict = {
            "i": "./sounds/cfu.mp3",
            "u": "./sounds/cbr.mp3",
            "ɪ": "./sounds/ncnfu.mp3",
            "ʊ": "./sounds/ncnbr.mp3",
            "e̞": "./sounds/mfu.mp3",
            "ə": "./sounds/mc.mp3",
            "ɔ": "./sounds/ombr.mp3",
            "æ": "./sounds/nofu.mp3",
            "ɑ": "./sounds/obu.mp3",
            "ɒ": "./sounds/obr.mp3",
        };
        this.allowance = 3000;
        this.garapon = new GaraponSound(this.soundDict, 10, this.allowance);
        this.startTime = 0;
        this.timerDisplay = document.getElementById("timerDisplay");
        this.qCountDisplay = document.getElementById("qCountDisplay");
        this.hitDisplay = document.getElementById("hitDisplay");
        this.errorDisplay = document.getElementById("errorDisplay");
        this.scoreDisplay = document.getElementById("scoreDisplay");
        this.mode = document.getElementById("mode");
        this.errorBucket = new Set();
    }
}

function gameStart() {
    G.startTime = new Date().getTime();
    G.qCounter = 0;
    G.garapon.makeSomeNoise();
    G.errorBucket = new Set();
    fn();
}

function fn() {
    G.garapon.playRandomSound();
    let lapse = new Date().getTime() - G.startTime;
    let lag = findLag(lapse);
    if (lag > 0) {
        setTimeout(fn, lag);
    }
}
function findLag(time) {
    let i = G.speedParm.length-1;
    while (time < G.speedParm[i][0]) {
        i--;
    }
    let lag = G.speedParm[i][1];
    return lag;
}

let G = new GlobalManager();

function oneSecTimer() {
    let lapse = new Date().getTime() - G.startTime;
    G.timerDisplay.innerHTML = Math.trunc(lapse / 1000);
    if (lapse <= G.speedParm[G.speedParm.length-1][0]) {
        setTimeout(oneSecTimer, 1000);
    } else {
        setTimeout(review, 2000);
    }
}

function calcScore() {
    return Math.round((G.garapon.hitCount - (G.garapon.errorCount / 2.0)) / G.garapon.qCounter * 10000.0) / 100.0;
}

function testStart() {
    G.mode.checked = true;
    G.mode.disabled = true;
    G.garapon.reset();
    G.timerDisplay.innerHTML = 0;
    G.hitDisplay.innerHTML = G.garapon.hitCount;
    G.errorDisplay.innerHTML = G.garapon.errorCount;
    G.scoreDisplay.innerHTML = "0";
    setTimeout(oneSecTimer, 1000);
    gameStart();
}

function pushed(val) {
    if (G.mode.checked == false) {
        G.garapon.playN(val);
        return;
    }
    if (!G.garapon.available) return;
    G.garapon.available = false;
    let ct = new Date().getTime();
//    console.log(ct - G.garapon.inPlayArray[val]);
    if (ct - G.garapon.inPlayArray[val] <= G.allowance) {
        G.garapon.hitCount++;
        G.hitDisplay.innerHTML = G.garapon.hitCount;
    } else {
        G.garapon.makeSomeNoise();
        G.garapon.errorCount++;
        G.errorDisplay.innerHTML = G.garapon.errorCount;
        console.log("ERR:" + G.garapon.currentSound);
        G.errorBucket.add(G.garapon.currentSound);
    }
}

function review() {
    G.garapon.available = false;
    G.mode.disabled = false;
    let ids = Array.from(G.errorBucket);
    for (let o of ids) {
        let elem = document.getElementById("p" + o);
        elem.style = "background-color: #F9EBEA";
    }
}
