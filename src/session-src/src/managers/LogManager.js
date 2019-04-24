import { writeFileSync } from "fs";
import { createLogger, format, transports } from "winston";

/**
 * @author Tomer Riko Shalev
 */


/**
 * log management
 *
 */
export default class LogManager {
    _logs = []
    _logger = createLogger({
        level: "info",
        format: format.cli(),
        transports: [
            new transports.File({ filename: "/Users/sbrow/Documents/GitHub/cep-react/logs/winston.log" })
        ]
    })

    constructor() {

    }

    init() {
        this.log('initing...')
        this._logger.info("Testing...")

        var log = console.log

        if (console === undefined)
            return
        var that = this
        // override the console.log method
        console.log = function () {
            // log.call(this, 'My Console!!!')
            // log.apply(this, Array.prototype.slice.call(arguments))
            // retain older console.log functionality
            log.call(this, ...arguments)
            // save the log internally
            that.addRawLog(...arguments)
        }
    }

    dump(path) {
        try {
            if (typeof path !== "string") {
                throw new Error(`Error at dump(): path argument is not a string`)
            }
            writeFileSync(path, this.rawLogs.join("\r\n"))
        } catch (error) {
            window.alert(error)
        }
    }

    /**
     * addLog - collect log
     *
     * @param  {Object} val anything
     *
     */
    addRawLog(val) {
        this._logs.push(val)
    }

    get rawLogs() {
        return this._logs
    }

    get name() {
        return 'LogManager:: '
    }

    log(val) {
        return `${this.name} ${val}`
    }
}
