import * as React from "react";
import { useContext, useEffect } from "react";
import packageInfo from "../../../package.json";
import controller from "../controller";
import { StoreContext, Update } from "../Stores/AppStore";
import { Blocks } from "./Blocks";
import { Dropdown } from "./Dropdown";

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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        window.session.run("insertClips", state.videos());
    };

    useEffect(() => {
        Update(state, dispatch);
    });

    return (<React.Fragment>
        <form onSubmit={handleSubmit}>
            <section>
                <h2>Intro</h2>
                <Dropdown id="level" label="Workout Level" options="bins" allowEmpty={true} />
                <Dropdown id="numBlocks" label="# of Blocks" options={numBlocks} />
                <Dropdown id="intro" label="Intro" options="availableVideos" allowEmpty={true} allowImport={true} />
                <Dropdown id="warmup" label="warmup" options="availableVideos" allowEmpty={true} allowImport={true} />
            </section>
            <section>
                <h2>Blocks</h2>
                <Blocks />
            </section>
            <section>
                <h2>Conclusion</h2>
                <Dropdown id="outro" label="outro" options="availableVideos" allowEmpty={true} allowImport={true} />
            </section>
            <Refresh /><button type="submit">Submit</button>
        </form>
        {/* <Display /> */}
        <footer><p>V{packageInfo.version}</p></footer>
    </React.Fragment>);
}
