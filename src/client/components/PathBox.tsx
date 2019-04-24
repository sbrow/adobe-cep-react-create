import * as React from "react";
import { StoreContext } from "../Stores/AppStore";

interface PathBoxProps {
    id: string;
    label?: string;
    parent?: any;
}

export function PathBox(props: PathBoxProps): JSX.Element {
    const [state, dispatch] = React.useContext(StoreContext);
    const source = PathBox.name;

    props.label = (props.label === undefined) ? props.id : props.label;

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: `set`, source, payload: { key: props.id, value: event.target.value } });
    };
    return (
        <div class="row">
            <label htmlFor={props.id}>{props.label}</label>
            <input id={props.id} type="text" value={state.get(props.id)} onChange={onChange} />
        </div>
    );
}
