import * as React from "react";
import { get, StoreContext } from "../Store";

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
    return (
        <div class="row">
            <label htmlFor={props.id}>{props.label}</label>
            <input id={props.id} type="text" value={get(state, props.id)} onChange={onChange} />
            <button type="button">Select</button>
        </div>
    );
}
