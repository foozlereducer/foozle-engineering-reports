export class HttpStatusCode {
    static OK = 200;
    static BAD_REQUEST = 400;
    static NOT_FOUND = 404;
    static NOT_ACCEPTABLE = 406;
    static INTERNAL_SERVER = 500;
   
    static get OK() { return this.OK; }
    static get BAD_REQUEST() { return this.BAD_REQUEST; }
    static get NOT_FOUND() { return this.NOT_FOUND; }
    static get INTERNAL_SERVER() { return this.INTERNAL_SERVER; }
    static get NOT_ACCEPTABLE() { return this.NOT_ACCEPTABLE; }
}