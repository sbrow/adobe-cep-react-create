import * as React from "react";
import { useContext, useEffect } from "react";
import controller from "../controller";
import { StoreContext, Update } from "../Stores/AppStore";
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
                    controller.error(`run failed with: ${JSON.stringify(error)}`, { source: "Submit" });
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
        Update(state, dispatch);
    };

    return (<button type="button" onClick={onClick}>Refresh</button>);
}

function Display() {
    const state = useContext(StoreContext)[0];
    return (<pre>{JSON.stringify(state, null, 2)}</pre>);
}

export function Form(): JSX.Element {
    const [state, dispatch] = useContext(StoreContext);
    const numBlocks = [1, 2, 3];

    // useEffect(() => {
    //     Update(state, dispatch);
    // });

    return (<React.Fragment>
        <form>
            <h2>Intro</h2>
            {/* <Dropdown id="level" label="Workout Level" options="library" /> */}
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
    </React.Fragment>);
}
