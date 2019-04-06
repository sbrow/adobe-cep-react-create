import * as React from "react";
import { useContext } from "react";
import { StoreContext, StoreProvider } from "../Stores/AppStore";
import { Blocks } from "./Blocks";
import { Dropdown } from "./Dropdown";
import { PathBox } from "./PathBox";

function Button(): JSX.Element {
    // const [state, dispatch] = useContext(StoreContext);
    const state = useContext(StoreContext)[0];
    const onClick = () => {
        try {
            state.insert().then((res) => {
                window.alert(res);
            });
        } catch (err) {
            window.alert(err);
        }
        // dispatch({ type: "set", payload: { key: "blocks-1-intro", value: "3" } });
    };

    return (<button type="button" onClick={onClick}>Click Me!</button>);
}

function Display() {
    const state = useContext(StoreContext)[0];
    return (<pre>{JSON.stringify(state, null, 2)}</pre>);
}

export function Form(): JSX.Element {
    const state = useContext(StoreContext)[0];
    return (
        <StoreProvider>
            <h1>{document.title}</h1>
            <form>
                <h2>Intro</h2>
                <Dropdown id="level" label="Workout Level" options={[1, 2, 3]} />
                <Dropdown id="numBlocks" label="# of Blocks" options={[1, 2, 3]} />
                <PathBox id="intro" label="Intro" />
                <PathBox id="warmup" label="warmup" />
                <h2>Blocks</h2>
                <Blocks />
                <h2>Conclusion</h2>
                <PathBox id="outro" label="Outro" />
                <Button />
            </form>
            <Display />
        </StoreProvider>
    );
}
