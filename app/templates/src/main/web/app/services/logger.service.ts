import {Injectable} from '@angular/core';
import {Constants} from "../constants";

export enum LogLevel {
    ALL = 0,
    TRACE = 1,
    DEBUG = 2,
    INFO = 3,
    WARN = 4,
    ERROR = 5,
    OFF = 7
}

export class Log {

    constructor(private level: LogLevel, private name: string, private displayDate: boolean) {
    }

    get trace() {
        return this.canLog(LogLevel.TRACE) ? Function.prototype.bind.call(console.trace, console, this.getMessage()) : () => {};
    }

    get debug() {
        return this.canLog(LogLevel.DEBUG) ? Function.prototype.bind.call(console.debug, console, this.getMessage()) : () => {};
    }

    get info() {
        return this.canLog(LogLevel.INFO) ? Function.prototype.bind.call(console.info, console, this.getMessage()) : () => {};
    }

    get warn() {
        return this.canLog(LogLevel.WARN) ? Function.prototype.bind.call(console.warn, console, this.getMessage()) : () => {};
    }

    get error() {
        return this.canLog(LogLevel.ERROR) ? Function.prototype.bind.call(console.error, console, this.getMessage()) : () => {};
    }

    private getMessage() : string {
        let dateObj = new Date();
        let date = this.displayDate ? dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString() + ' ': '';
        return date + '['+this.name+']';
    }

    private canLog(level: LogLevel) : boolean {
        return level >= this.level;
    }
}

@Injectable()
export class LoggerService {

    private level: LogLevel = LogLevel.ALL;
    private defaultDisplayDate: boolean = false;

    constructor(private constants: Constants) {
        if(constants.logLevel && LogLevel[constants.logLevel]){
            this.level = LogLevel[constants.logLevel.toUpperCase()];
        }
        this.getLogger().debug('Logger service initialized with level : ' + LogLevel[this.level]);
    }

    public getLogger(name =  'root', displayDate?: boolean) : Log {
        return new Log(this.level, name, displayDate ? displayDate : this.defaultDisplayDate);
    }

}