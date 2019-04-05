import { checkPropTypes } from "prop-types";
import * as React from "react";
import { get, Store, StoreContext } from "../Store";

interface OptionProps {
    value: string;
    id?: string;
}
function Option(arg: OptionProps | string): JSX.Element {
    let props;
    if (typeof arg === "string") {
        props = { value: arg };
    } else {
        props = arg;
    }
    return (<option {...props}>{props.value}</option>);
}

interface DropdownProps {
    label?: string;
    options: any[];
    id: string;
    parent?: any;
}

/**
 * A Simple dropdown menu, connected to StoreContext.
 * @param props
 */
export function Dropdown(props: DropdownProps): JSX.Element {
    const [state, dispatch] = React.useContext(StoreContext);
    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: "set", payload: { key: props.id, value: event.target.value } });
    };
    return (
        <div id={props.id} class="row">
            <label htmlFor={`${props.id}-data`}>{props.label}</label>
            <select id={`${props.id}-data`} value={get(state, props.id)} onChange={onChange} {...props.id}>
                {props.options.map((listValue) => {
                    return (
                        <Option value={listValue} />
                    );
                })}
            </select>
        </div >
    );
}
