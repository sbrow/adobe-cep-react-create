import { createLogger, Logger, LoggerOptions } from "winston";
/**
 * @author Tomer Riko Shalev
 */

/**
 * the main plugin session. This can enter the node modules as
 * well as the host
 *
 */
class Controller {
    private backupLogger: Logger | Console | null;

    constructor(loggerConfig?: LoggerOptions) {
        // if (loggerConfig !== undefined) {
        // this.backupLogger = createLogger(loggerConfig);
        // } else {
        this.backupLogger = console;
        // }
        this.init();
    }

    /**
     * init - session
     *
     */
    public init() {
        this.log("client controller is initing...");
        this.log(`do we have session ? ${this.hasSession()}`);
        this.log("client controller has inited");
    }

    /**
     * invoke the plugin
     *
     * @param  {{textures:boolean, masks:boolean, info: boolean, flatten:boolean}} options for plugin
     *
     * @return {object} describes how well the execution of plugin was
     */
    public invokePlugin(options: object) {
        this.log("invokePlugin");
        console.log(options);

        if (!this.hasSession()) {
            return;
        }

        session.invokePlugin(options)
            .then((res) => console.log(res))
            .catch((err) => console.log(err));
    }

    get logger(): Logger | Console {
        if (this.hasSession()) {
            return window.session.logger;
        }
        if (this.backupLogger !== null) {
            return this.backupLogger;
        }
        return console;
    }

    /**
     * do we have access to session services ?
     *
     * @return {boolean} true/false
     */
    public hasSession() {
        return window.session !== undefined;
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} message what to log
     * @param {string} level
     */
    public log(message: string, level: string = "info") {
        const logger = this.logger;
        const params: [string, any | any[]] = [message, { source: this.name }];
        switch (level) {
            case "error":
                logger.error(...params);
                break;
            case "debug":
                logger.debug(...params);
                break;
            case "info":
            default:
                logger.info(...params);
        }
    }

    public debug(message: string, ...metadata: any) {
        this.logger.debug(message, ...metadata);
    }
    public info(message: string, ...metadata: any) {
        this.logger.info(message, ...metadata);
    }
    public error(message: string, ...metadata: any) {
        this.logger.error(message, ...metadata);
    }

    get name() {
        return "Client.Controller";
    }
}

const controller = new Controller();

export default controller;
