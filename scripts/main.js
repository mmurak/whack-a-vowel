let G = new GlobalManager();

let studyDic = {};
for (let ent of soundArray) {
    studyDic[ent[0]] = ent[1];
}

let audio = new Audio();
let buzz = new Audio();
buzz.src = soundArray[0][1];


// Entry point is here
function run() {
    _resetValues();
    // just buzz and wait for end event
    audio.src = soundArray[0][1];
    audio.onended = nextAudio;
    audio.play();
}

//
function _resetValues() {
    G.qCounter = 0;
    G.qCountDisplay.innerHTML = "";
    G.hitDisplay.innerHTML = G.hitCounter = 0;
    G.errorDisplay.innerHTML = G.errorCounter = 0;
    G.mode.checked = true;
    G.mode.disabled = true;
    G.testStart.disabled = true;
    G.scoreDisplayinnerHTML = "";
    G.errorBucket = new Set();
    _bleachTable();
}

// 
function _bleachTable() {
    for (let e of soundArray) {
        if (e[0] =="!") continue;   // skip buzz
        document.getElementById(e[0]).style = "background-color: white";
    }
}

function _selectNextAudioIdx() {
    return Math.trunc(Math.random() * (soundArray.length - 1)) + 1;
}

function _sustime() {
    let i = 0;
    while(G.qCounter > suspensionTimeArray[i][0]) {
        i++;
    }
    return suspensionTimeArray[i][1];
}

// Audio event raised (on-ended)
function nextAudio() {
    if (G.qCounter < numberOfQuestions) {
        setTimeout(nowInTest, _sustime());
    } else {
        setTimeout(cleaningUpProcess, _sustime());
    }
}

function nowInTest() {
    let nextAudio = soundArray[_selectNextAudioIdx()];
    G.currentPhoneme = nextAudio[0];
    audio.src = nextAudio[1];
    G.qCountDisplay.innerHTML = ++G.qCounter;
//    if (G.answerRights)  buzz.play();
    G.answerRights = true;
//    _bleachTable();
    audio.play();
}  

function cleaningUpProcess() {
    audio.onended = null;
    audio.src = soundArray[0][1];   // finishing buzz
    audio.play();
    G.answerRights = false;
    let missedOnes = Array.from(G.errorBucket);
    for (let o of missedOnes) {
        let elem = document.getElementById(o);
        elem.style = "background-color: #F9EBEA";
    }
    G.scoreDisplay.innerHTML = Math.round((G.hitCounter - (G.errorCounter / 2.0)) / G.qCounter * 10000.0) / 100.0;
    G.mode.disabled = false;
    G.testStart.disabled = false;
}



function pushed(val) {
    // lesson mode
    if (G.mode.checked == false) {
        audio.src = studyDic[val];
        audio.onended = null;
        audio.play();
        return;
    }
    // test mode
    if (G.answerRights) {
        if (val == G.currentPhoneme) {
            G.hitDisplay.innerHTML = ++G.hitCounter;
        } else {
            buzz.play();
//            document.getElementById(G.currentPhoneme).style = "background-color: red";
            G.errorDisplay.innerHTML = ++G.errorCounter;
            G.errorBucket.add(G.currentPhoneme);
        }
    }
    G.answerRights = false;
}