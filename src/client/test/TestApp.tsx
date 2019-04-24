import * as React from "react";

// import { Form } from "../components/Form";
import { Session } from "../../session/Session";
import controller from "../controller";

function run(fnName: string, args?: any): void {
    try {
        window.session.scriptLoader.evalScript(fnName, args).then((res) => {
            if (res !== undefined) {
                controller.info(`Returned: '${res}'`, { source: "TestApp.run" });
                window.alert(`${fnName} Returned: '${res}'`);
            }
        });
    } catch (e) {
        controller.error(`${e}`, { source: "TestApp.run" });
    }
}

function RunBtn(props: { fn: string, args?: any; }) {
    let handleClick: (args: any) => void;
    if (typeof props.fn === "string") {
        handleClick = (event) => { run(props.fn, props.args); };
    } else {
        handleClick = props.fn;
    }
    return (<button onClick={handleClick}>{props.fn}</button>);
}
export function App(props: { title?: string }) {
    return (
        <div>
            <RunBtn fn="itemChildren" />
            <RunBtn fn="testAlert" />
            <RunBtn fn="activeSequence" />
            <RunBtn fn="projectItem" args={0} />
            <RunBtn fn="getOutPoint" />
            <RunBtn fn="createClip" />
            <br />
            <RunBtn fn="insertClip" />
            <RunBtn fn="newSequence" />
            <RunBtn fn="getTimebase" />
        </div>
    );
}
