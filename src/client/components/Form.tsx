import * as React from "react";
import { useContext } from "react";
import controller from "../controller";
import { StoreContext, StoreProvider } from "../Stores/AppStore";
import { Blocks } from "./Blocks";
import { Dropdown } from "./Dropdown";
import { PathBox } from "./PathBox";

const session: Session = window.session;

// function parse
function Submit(): JSX.Element {
    const [state, dispatch] = useContext(StoreContext);
    const onClick = () => {
        try {
            if (controller.hasSession()) {
                const functionName = "insertClips"
                window.session.run(functionName, [state.intro]).then((res: string) => {
                    // dispatch({ type: "set", payload: { key: "library", value: JSON.parse(res) } });
                    window.session.logger.info(`${functionName} returned: ${res}`, { source: "Submit" });
                }).catch((error: Error) => {
                    window.session.logger.error(`run failed with: ${error}`);

                });
            }
        } catch (error) {
            window.session.logger.error(`run failed with: ${error}`);
        }
    };

    return (<button type="button" onClick={onClick}>Submit</button>);
}

function Refresh(): JSX.Element {
    const [state, dispatch] = useContext(StoreContext);
    const onClick = () => {
        try {
            if (controller.hasSession()) {
                const functionName = "getBins";
                const args = null;
                window.session.run(functionName, args).then((result: string) => {
                    const value = JSON.parse(result) || [];
                    dispatch({ type: "set", source: "Refresh", payload: { key: "library", value } });
                }).catch((error: Error) => {
                    window.session.logger.error(`run "${functionName}" failed with: "${error.message}"`, { args, stack: error.stack });
                });
            }
        } catch (error) {
            window.alert(`Couldn't call run: ${error}`);
            window.alert(controller.logz.join("\r\n"));
        }
    };

    return (<button type="button" onClick={onClick}>Refresh</button>);
}

function Display() {
    const state = useContext(StoreContext)[0];
    return (<pre>{JSON.stringify(state, null, 2)}</pre>);
}

function Library() {
    const [state, dispatch] = useContext(StoreContext);
    if (state.library.length === 0) {
        return <ul></ul>
    }
    return (
        <ul>
            {state.library.map((item: any) => {
                return <li>{item}</li>;
            })}
        </ul>
    );
}

export function Form(): JSX.Element {
    const state = useContext(StoreContext)[0];
    return (
        <StoreProvider>
            <h1>{document.title}</h1>
            <form>
                <h2>Intro</h2>
                <Dropdown id="level" label="Workout Level" options="library" />
                <Dropdown id="numBlocks" label="# of Blocks" options={[1, 2, 3]} />
                <PathBox id="intro" label="Intro" />
                <PathBox id="warmup" label="warmup" />
                <h2>Blocks</h2>
                <Blocks />
                <h2>Conclusion</h2>
                <PathBox id="outro" label="Outro" />
                <Refresh /><Submit />
            </form>
            <Display />
            <Library />
        </StoreProvider>
    );
}
