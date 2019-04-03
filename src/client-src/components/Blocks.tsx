import * as  React from "react";
import { StoreContext } from "../Store";
import { PathBox } from "./PathBox";

interface BlockProps {
    id: number;
}

function Block(props: BlockProps) {
    const state = React.useContext(StoreContext)[0];
    const id = `block-${props.id}`;
    return (<div>
        <h3>Block #{props.id}</h3>
        <PathBox parent={state.blocks[props.id]} id={`${id}-intro`} label="Intro" />
        <PathBox id={`${id}-excercise-1`} label="Exercise #1" />
        {/* <Dropdown label="Round #" /> */}
    </div>);
}

export function Blocks(): JSX.Element {
    const [state, dispatch] = React.useContext(StoreContext);
    return (
        <div>{state.blocks.map((_: any, i: number) => {

            return <Block id={i + 1} />;
        })}</div>
    );
}
