import { stat } from "fs";
import { func } from "prop-types";
import * as React from "react";
import { useContext } from "react";
import { Store, StoreContext } from "../Store";
import { Blocks } from "./Blocks";
import { Dropdown } from "./Dropdown";
import { PathBox } from "./PathBox";

function Button(): JSX.Element {
    const [state, dispatch] = useContext(StoreContext);
    const onClick = () => {
        dispatch({ type: "set", payload: { key: "blocks-1-intro", value: "3" } });
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
        <Store>
            <form>
                <Dropdown id="level" label="Workout Level" options={[1, 2, 3]} />
                <Dropdown id="numBlocks" label="# of Blocks" options={[1, 2, 3]} />
                <PathBox id="intro" label="Intro" />
                <PathBox id="warmup" label="warmup" />
                <Blocks />
                <PathBox id="outro" label="Outro" />
                <Button />
            </form>
            <Display />
        </Store>
    );
}
