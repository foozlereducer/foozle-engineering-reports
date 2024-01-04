export class iApiAdapter {
    constructor() {
        if("undefined" === typeof this.authenticate) {
            throw 'Implement a authenticate method to use iApiAdapter';
        }

        if("undefined" === typeof this.setRoute) {
            throw 'Implement a setRoute method to use iApiAdapter';
        }

        if("undefined" === typeof this.runRoute) {
            throw 'Implement a runRoute method to use iApiAdapter';
        }
    }

    createToken() {}
}