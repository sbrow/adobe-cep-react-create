import * as React from "react";
import { useContext } from "react";
import controller from "../controller";
import { importOption, StoreContext, StoreProvider } from "../Stores/AppStore";
import { Blocks } from "./Blocks";
import { Dropdown } from "./Dropdown";
import { PathBox } from "./PathBox";

// function parse
function Submit(): JSX.Element {
    const [state, dispatch] = useContext(StoreContext);
    const onClick = () => {
        try {
            if (controller.hasSession()) {
                const functionName = "insertClips";
                window.session.run(functionName, [state.intro]).then((res: string) => {
                    // dispatch({ type: "set", payload: { key: "library", value: JSON.parse(res) } });
                    controller.info(`${functionName} returned: ${res}`, { source: "Submit" });
                }).catch((error: Error) => {
                    controller.error(`run failed with: ${JSON.stringify(error, { source: "Submit" })}`);

                });
            }
        } catch (error) {
            controller.error(`run failed with: ${JSON.stringify(error)}`, { source: "Submit" });
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
                const source = "Refresh";
                const args = null;
                window.session.run(functionName, args).then((result: any) => {
                    dispatch({ type: "set", source, payload: { key: "library", value: ["", ...result] } });
                }).catch((error: Error) => {
                    controller.error(`run "${functionName}" failed with: "${error.message}"`, { args, stack: error.stack });
                });
                const level = (state.level === "") ? undefined : state.level;
                (window.session as Session).run("listProjectItemsJSON", level).then((result) => {
                    controller.debug(`result: ${JSON.stringify(result)}`, { source });
                    const value: string[] = [""];
                    if (result !== null) {
                        for (const item of result) {
                            value.push(item.name);
                        }
                    }
                    value.push(importOption);
                    dispatch({ type: "set", source, payload: { key: "availableVideos", value } });
                }).catch((error: Error) => {
                    controller.error(`run "${functionName}" failed with: "${error.message}"`, { args, stack: error.stack });
                });
            }
        } catch (error) {
            controller.error(`Couldn't call run: ${error}`);
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
        return <ul></ul>;
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
    const numBlocks = [1, 2, 3];

    return (
        <StoreProvider>
            <h1>{document.title}</h1>
            <form>
                <h2>Intro</h2>
                <Dropdown id="level" label="Workout Level" options="library" />
                <Dropdown id="numBlocks" label="# of Blocks" options={numBlocks} />
                <Dropdown id="intro" label="Intro" options="availableVideos" />
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
