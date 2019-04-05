import * as  React from "react";
import { StoreContext } from "../Store";
import { PathBox } from "./PathBox";

interface BlockProps {
    id: number;
}

function Block(props: BlockProps) {
    const state = React.useContext(StoreContext)[0];
    const id = `blocks-${props.id}`;
    const arr = [{}, {}];
    return (
        <React.Fragment key={id}>
            <h3>Block #{props.id}</h3>
            <PathBox parent={state.blocks[props.id]} id={`${id}-intro`} label="Intro" />
            {arr.map((_, i) => {
                return (<PathBox id={`${id}-excercises-${i + 1}`} label={`Exercise #${i + 1}`} />);
            })}
        </React.Fragment>
    );
}

export function Blocks(): JSX.Element {
    const [state, dispatch] = React.useContext(StoreContext);
    return (
        <React.Fragment key="blocks">
            {state.blocks.map((_: any, i: number) => {
                return <Block id={i + 1} />;
            })}
        </React.Fragment>
    );
}
