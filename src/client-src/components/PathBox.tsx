import * as React from "react";
import { StoreContext } from "../Store";

interface PathBoxProps {
    id: string;
    label?: string;
    parent?: any;
}

export function PathBox(props: PathBoxProps): JSX.Element {
    const [state, dispatch] = React.useContext(StoreContext);
    if (props.label === undefined) {
        props.label = props.id;
    }
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: `set`, payload: { key: props.id, value: event.target.value } });
    };
    let localState = state;
    if (props.parent !== undefined) {
        localState = props.parent;
    }
    return (
        <div>
            <label htmlFor={props.id}>{props.label}
                <input id={props.id} type="text" value={localState[props.id]} onChange={onChange} />
                <button type="button">Select</button>
            </label>
        </div>
    );
}
