class GlobalManager {
    constructor() {
        this.currentPhoneme = "";
        this.answerRights = false;
        this.qCounter = 0;
        this.hitCounter = 0;
        this.errorCounter = 0;
        this.errorBucket = new Set();
        this.testStart = document.getElementById("testStart");
        this.qCountDisplay = document.getElementById("qCountDisplay");
        this.hitDisplay = document.getElementById("hitDisplay");
        this.errorDisplay = document.getElementById("errorDisplay");
        this.passDisplay = document.getElementById("passDisplay");
        this.scoreDisplay = document.getElementById("scoreDisplay");
        this.mode = document.getElementById("mode");
    }
}
