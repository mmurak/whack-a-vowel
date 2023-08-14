class GlobalManager {
    constructor() {
        this.qCounter = 0;
        this.hitCounter = 0;
        this.dummy = document.getElementById("dummy");
        this.qCountDisplay = document.getElementById("qCountDisplay");
        this.hitDisplay = document.getElementById("hitDisplay");
        this.mode = document.getElementById("mode");
        this.allowance = 4;
        this.inTest = false;
    }
}
