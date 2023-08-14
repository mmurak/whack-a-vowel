(function() {

    window.whacker = window.whacker || {};

    let audio = new Audio();
    audio.onended = nextElement;

    let processElements;
    let currentPointer = 0;
    let callBackFn;
    let qCounterDisp;

    function nextElement() {
        currentPointer++;
        if (currentPointer >= processElements.length) {
            callBackFn();
        } else {
            dispatcher();
        }
    }

    function dispatcher() {
        let head = processElements[currentPointer];
        if (Array.isArray(head)) {
            qCounterDisp.innerHTML = (currentPointer+1) / 2
            audio.src = head[1];
            audio.play();
        } else {
            setTimeout(nextElement, Number(head));
        }
    }

    window.whacker.playPhonemes = function (array, cbf, qcdisp) {
        processElements = array;
        callBackFn = cbf;
        qCounterDisp = qcdisp;
        currentPointer = 0;
        dispatcher();
    };

    window.whacker.currentPointer = function() {
        return currentPointer;
    }
})();
