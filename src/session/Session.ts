/**
 * @author Tomer Riko Shalev
 */

import ScriptLoader from "./ScriptLoader";

import { createLogger, format, Logger, LoggerOptions, transports } from "winston";

/**
 * the main plugin session. This can enter the node modules as
 * well as the host
 *
 */
export class Session {
    public logger: Logger;
    public readonly name: string;
    public scriptLoader: ScriptLoader;

    constructor(logOpts: LoggerOptions, name = "Session") {
        this.logger = createLogger(logOpts);
        this.scriptLoader = new ScriptLoader(this.logger);
        this.name = name;
        this.init("lib.jsx");
    }

    /**
     * init - session
     *
     */
    public init(scripts: string | string[] = []) {
        if (typeof scripts === "string") {
            scripts = [scripts];
        }
        this.log(`Session "${this.name}" is initializing...`);
        this.log("Loading scripts");
        let loaded = 0;
        scripts.forEach((script) => {
            this.log(`loading "${script}"`);
            this.scriptLoader.loadJSX(script);
            loaded++;
        });
        this.log(`Successfully loaded ${loaded} scripts.`);
        this.log(`"${this.name}" has initialized.`);
    }

    // /**
    //  * scriptLoader - get the script loader
    //  *
    //  */
    // public scriptLoader() {
    //     return scriptLoader;
    // }

    /**
     * test - let's test things
     *
     */
    public test() {
        const obj = {
            name: "tomer",
        };

        this.scriptLoader.evalScript("test_host", obj).then((res) => {
            this.log("result is " + res);
        });
    }

    public testAlert() {
        this.scriptLoader.evalScript("testAlert", null).then((res) => {
            this.log("succeeded.");
        });
    }

    public async run(functionName: string, arg?: any): Promise<any> {
        try {
            const result = await this.scriptLoader.evalScript(functionName, arg);
            this.logger.debug(`rawResult: ${result}`, { source: this.name });
            const resultString = this.scriptLoader.stringify(result);
            this.logger.debug(`resultString: ${resultString}`, { source: this.name });
            this.logger.debug(`result: ${JSON.stringify(JSON.parse(resultString))}`, { source: this.name });
            return JSON.parse(resultString);
        } catch (error) {
            window.alert(error);
        }
        return;
    }

    /**
     * invoke the plugin
     *
     * @param  {{textures:boolean, masks:boolean, info: boolean, flatten:boolean}} options for plugin
     *
     * @return {object} describes how well the execution of plugin was
     */
    public invokePlugin(options: any): object {
        const {
            folderPath, isFlattenChecked,
            isInfoChecked, isInspectVisibleChecked,
            isMasksChecked, isTexturesChecked,
            isMeaningfulNamesChecked, isHierarchicalChecked,
        } = options;

        // i reparse everything to detect failures
        const pluginData = {
            destinationFolder: folderPath,
            exportInfoJson: isInfoChecked,
            inspectOnlyVisibleLayers: isInspectVisibleChecked,
            exportMasks: isMasksChecked,
            exportTextures: isTexturesChecked,
            flatten: !isHierarchicalChecked,
            namePrefix: isMeaningfulNamesChecked ? "layer" : undefined,
        };

        const that = this;

        return new Promise((resolve, reject) => {

            this.scriptLoader.evalScript("invoke_document_worker", pluginData)
                .then((res: string) => {
                    resolve(JSON.parse(res));
                })
                .catch((err) => {
                    reject(err);
                });

        });

    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    public log(val: string) {
        this.logger.info(`${val}`, { source: this.name });
    }
}

export const session = new Session({
    level: "info",
    format: format.json(),
    transports: [
        new transports.File({
            level: "debug",
            filename: "/Users/sbrow/Documents/GitHub/cep-react/logs/main.log",
        }),
        new transports.File({
            format: format.cli(),
            filename: "/Users/sbrow/Documents/GitHub/cep-react/logs/simple.log",
        }),
    ],
});

export default session;
