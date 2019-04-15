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

    constructor(logger: Logger) {
        this.cs = new CSInterface();
        this.logger = logger;
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

        cs.evalScript('$.evalFile("' + extensionRoot + fileName + '")');
    }

    /**
     * evalScript - evaluate a JSX script
     *
     * @param  {string} functionName the string name of the function to invoke
     * @param  {any} params the params object
     * @return {Promise} a promise
     */
    public async evalScript(functionName: string, params: any): Promise<any> {
        let params_string = params ? JSON.stringify(params) : "";
        let eval_string = `${functionName}('${params_string}')`;
        const that = this;

        return new Promise((resolve, reject) => {
            const callback = function (eval_res: any) {
                // console.log('weird' + eval_res)
                if (typeof eval_res === "string") {
                    // console.log(eval_res)
                    if (eval_res.toLowerCase().indexOf("error") != -1) {
                        that.log("err eval");
                        reject(that.createScriptError(eval_res));

                        return;
                    }
                }

                that.log("success eval");

                resolve(eval_res);

                return;
            };

            that.cs.evalScript(eval_string, callback);
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
    }

    get name() {
        return "ScriptLoader";
    }

}

// var scriptLoader = new ScriptLoader()

export default ScriptLoader;
