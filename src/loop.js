export default class Loop {
    constructor() {
        this.start = new Date()
        this.thread = null
    }

    loop(method) {
        this.method = method
    }

    begin(framerate = 60) {
        const args = [ this.start ]
        this.thread = setInterval(this.method, Math.floor(1000 / framerate), ...args)
    }

    expire() {
        clearInterval(this.thread)
    }

}
