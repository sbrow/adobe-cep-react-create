import { checkPropTypes } from "prop-types";
import * as React from "react";
import { Store, StoreContext } from "../Store";

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
        <div id={props.id}>
            <label htmlFor={`${props.id}-data`}>{props.label}
                <select id={`${props.id}-data`} value={state[props.id]} onChange={onChange} {...props.id}>
                    {props.options.map((listValue) => {
                        return (
                            <Option value={listValue} />
                        );
                    })}
                </select>
            </label>
        </div >
    );
}
