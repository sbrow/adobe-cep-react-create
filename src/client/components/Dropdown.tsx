import { checkPropTypes } from "prop-types";
import * as React from "react";
import { importOption, StoreContext } from "../Stores/AppStore";

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
    options: any[] | string;
    id: string;
    parent?: any;
    allowEmpty?: boolean;
    allowImport?: boolean;
}

/**
 * A Simple dropdown menu, connected to StoreContext.
 *
 * @param props
 */
export function Dropdown(props: DropdownProps): JSX.Element {
    const [state, dispatch] = React.useContext(StoreContext);
    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch({ type: "set", source: "Dropdown", payload: { key: props.id, value: event.target.value } });
    };

    const options = [];
    if (props.options instanceof Array) {
        options.push(...props.options);
    } else {
        const opts = state.get(props.options);
        if (opts instanceof Array) {

            options.push(...opts);
        }
    }
    if (props.allowEmpty === true) {
        options.unshift("");
    }
    if (props.allowImport === true) {
        options.push(importOption);
    }
    return (
        <div id={props.id} class="row">
            <label htmlFor={`${props.id}-data`}>{props.label}</label>
            <select id={`${props.id}-data`} value={state.get(props.id)} onChange={onChange} {...props.id}>
                {options.map((listValue: string) => {
                    return (
                        <Option value={listValue} />
                    );
                })}
            </select>
        </div >
    );
}
