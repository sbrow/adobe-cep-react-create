import * as  React from "react";
import { StoreContext } from "../Stores/AppStore";
import { Block } from "./Block";

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
