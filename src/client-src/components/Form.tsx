import * as React from "react";
import { useContext } from "react";
// import { Display } from "../App";
import { Store, StoreContext } from "../Store";
import { Blocks } from "./Blocks";
import { Dropdown } from "./Dropdown";
import { PathBox } from "./PathBox";

function Button(): JSX.Element {
    const [state, dispatch] = useContext(StoreContext);
    const onClick = () => {
        dispatch({ type: "set", payload: { key: "numBlocks", value: 3 } });
    };

    return (<button type="button" onClick={onClick}>Click Me!</button>);
}

export function Form(): JSX.Element {
    return (<div id="form">
        <form>
            <Store>
                <Dropdown id="level" label="Workout Level" options={[1, 2, 3]} />
                <Dropdown id="numBlocks" label="# of Blocks" options={[1, 2, 3]} />
                <PathBox id="intro" label="Intro" />
                <PathBox id="warmup" label="warmup" />
                <Blocks />
                <PathBox id="outro" label="Outro" />
                {/* <Display /> */}
                <Button />
            </Store>
        </form>
    </div>);
}
