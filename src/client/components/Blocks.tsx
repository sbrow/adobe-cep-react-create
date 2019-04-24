import * as  React from "react";
import { StoreContext } from "../Stores/AppStore";
import { Dropdown } from "./Dropdown";
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
            <Dropdown id={`${id}-intro`} label="Intro" options="availableVideos"
                allowEmpty={true} allowImport={true} />;
            {arr.map((_, i) => {
                    return (<Dropdown id={`${id}-exercises-${i + 1}`} label={`Exercise #${i + 1}`}
                        options="availableVideos" allowEmpty={true} allowImport={true} />);
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
