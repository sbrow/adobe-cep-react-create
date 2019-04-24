/**
 * @author Tomer Riko Shalev
 */
import { Logger } from "winston";

/**
 * load jsx scripts dynamically
 */
class ScriptLoader {
    public readonly EvalScript_ErrMessage = "EvalScript error.";
    public cs: CSInterface;
    public logger: Logger;
    public nextID: number;

    constructor(logger: Logger) {
        this.cs = new CSInterface();
        this.logger = logger;
        this.nextID = 0;
    }

    public getID(): number {
        const id = this.nextID;
        this.nextID++;
        return id;
    }

    /**
     * loadJSX - load a jsx file dynamically, this
     * will also load all of it's includes which is desirable
     *
     * @param  {string} fileName the file name
     */
    public loadJSX(fileName: string): void {
        const cs = this.cs;
        const extensionRoot = cs.getSystemPath(SystemPath.EXTENSION) + "/host/";

        cs.evalScript('$.evalFile("' + extensionRoot + fileName + '")', (result: any) => {
            this.logger.info("", { source: "CSInterface.evalScript", result });
        });
    }

    public stringify(obj: any): string {
        switch (typeof obj) {
            case "string":
                return obj;
            case "object":
            default:
                return JSON.stringify(obj);
        }
    }
    /**
     * evalScript - evaluate a JSX script
     *
     * @param  {string} functionName the string name of the function to invoke
     * @param  {any} params the params object
     * @return {Promise} a promise
     */
    public async evalScript(functionName: string, params?: any): Promise<any> {
        const paramsString = (params === undefined) ? "" : `'${this.stringify(params)}'`;
        const evalString = `${functionName}(${paramsString})`;
        const that = this;
        const id = this.getID();

        return new Promise((resolve, reject) => {
            const callback = function (result: any) {
                // console.log('weird' + eval_res)
                if (typeof result === "string") {
                    // console.log(eval_res)
                    if (result.toLowerCase().indexOf("error") != -1) {
                        that.log("err eval");
                        reject(that.createScriptError(result));
                        return;
                    }
                }

                that.logger.info(`result: ${result}`, { source: that.name, id, success: true });
                resolve(result);
                return;
            };

            that.logger.info(`calling: ${evalString}`, { source: that.name, id, success: true });
            that.cs.evalScript(evalString, callback);
        });

    }

    public createScriptError(reason: string, data: any = null) {
        return { reason, data };
    }

    /**
     * log some info with session prefix
     *
     * @param  {string} val what to log
     */
    public log(val: string) {
        console.log(`${this.name} ${val}`);
        this.logger.info(val, { source: this.name });
    }

    get name() {
        return "ScriptLoader";
    }

}

// var scriptLoader = new ScriptLoader()

export default ScriptLoader;
