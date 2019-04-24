import * as React from "react";

// import { Form } from "../components/Form";
import { Session } from "../../session-src/src/Session";
import controller from "../controller";

// @ts-ignore
const session: Session = window.session;

function run(fnName: string, args?: any): void {
    try {
        session.scriptLoader().evalScript(fnName, args).then((res) => {
            this.log("succeeded.");
            if (res !== undefined) {
                window.alert(`Returned: '${res}'`);
            }
        });
    } catch (e) {
        window.alert(e);
    }
}

function RunBtn(props: { fn: string | ((thing: any) => any), args?: any; }) {
    let handleClick: (args: any) => void;
    if (typeof props.fn === "string") {
        // @ts-ignore
        handleClick = (event) => { run(props.fn, props.args); };
    } else {
        handleClick = props.fn;
    }
    return (<button onClick={handleClick}>{props.fn}</button>);
}
export function App() {
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
        </div>
    );
}
