let G = new GlobalManager();

let qa;
let finderArray;

let studyDic = {};
let interactiveDic = {};
for (let ent of soundArray) {
    let e0 = ent[0];
    if (!(e0 in studyDic)) {
        studyDic[e0] = [];
        interactiveDic[e0] = []
    }
    studyDic[e0].push([e0, ent[1]]);
    interactiveDic[e0].push(ent[1]);
}

function run() {
    whacker.playPhonemes([0, ["", "./sounds/buzzer.mp3"]], realStart, G.dummy);
}

function realStart() {
    _resetValues();
    qa = makeQArray();
    makeFinderArray(qa);
    debugDisplay();
    whacker.playPhonemes(qa, finished, G.qCountDisplay);
}

function makeFinderArray(qa) {
    finderArray = [];
    let idx = 0;
    for (let e of qa) {
        if (Array.isArray(e)) {
            finderArray.push([e[0], ""]);
        } else {
            finderArray.push(idx++);
        }
    }
}

function debugDisplay() {
    let res = [];
    for (let i of finderArray) {
        if (Array.isArray(i)) {
            res.push(i[0] + ":" + i[1]);
        }
    }
    console.log(res.join(", "));
}

function finished() {
    whacker.playPhonemes([0, ["", "./sounds/buzzer.mp3"]], nullCallback, G.dummy);
    G.inTest = false;
    G.mode.disabled = false;
    G.mode.options[0].selected = true;
}

function nullCallback() {
    _bleachTable();
}

function findSuspensionTime(n) {
    let t = 0;
    while(n >= suspensionTimeArray[t][0]) {
        t++;
    }
    return suspensionTimeArray[t][1];
}

function makeQArray() {
    let qarray = [];
    qarray.push(1000);      // first suspension time
    for (let i = 0; i < numberOfQuestions; i++) {
        qarray.push(soundArray[Math.trunc(Math.random()*soundArray.length)]);
        qarray.push(findSuspensionTime(i));
    }
    qarray.push(1000);      // last suspension time
    return qarray;
}

function pushed(c) {
    let pushedElement = document.getElementById(c);
    // 学習モード
    if (G.mode.value == "S") {
        let qarray = [studyDic[c][0]];
        pushedElement.style = "background-color: #75FF7C";
        whacker.playPhonemes(qarray, nullCallback, G.qCounter);
        return;
    } else if (G.mode.value == "F") {
        let qarray = studyDic[c];
        pushedElement.style = "background-color: #75FF7C";
        whacker.playPhonemes(qarray, nullCallback, G.qCounter);
        return;
    } else if ((G.mode.value == "X") && (!G.inTest)) {
        G.inTest = true;
        run();
        return;
    }
    // テストモード
    let i = whacker.currentPointer();
let sss = i;
    let limit = (i >= G.allowance) ? i - G.allowance : 0;
    while(i >= limit) {
        if (Array.isArray(finderArray[i])) {
            if (finderArray[i][1] == "X") {
                i = -1;
                break;
            }
            if (c == finderArray[i][0]) {
                finderArray[i][1] = "X";
                break;
            }
        }
        i--;
    }
    if (i >= limit) {
        G.hitDisplay.innerHTML = ++G.hitCounter;
        pushedElement.style = "background-color: #75FF7C";
        setTimeout(function() {
            pushedElement.style = "background-color: white";
        }, 100);
    } else {
        pushedElement.style = "background-color: #FF7C75";
        setTimeout(function() {
            pushedElement.style = "background-color: white";
        }, 100);
    }
}

function _resetValues() {
    G.qCounter = 0;
    G.qCountDisplay.innerHTML = "";
    G.hitDisplay.innerHTML = G.hitCounter = 0;
    G.mode.checked = true;
    G.mode.disabled = true;
    _bleachTable();
}

function _bleachTable() {
    for (let e of soundArray) {
        document.getElementById(e[0]).style = "background-color: white";
    }
}
