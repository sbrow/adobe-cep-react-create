import { checkPropTypes } from "prop-types";
import * as React from "react";
import controller from "../controller";
import { importOption, StoreContext } from "../Stores/AppStore";
import { Option } from "./Option";

interface DropdownProps {
    allowEmpty?: boolean;
    allowImport?: boolean;
    id: string;
    label?: string;
    options: any[] | string;
    parent?: any;
}

/**
 * A Simple dropdown menu, connected to StoreContext.
 *
 * @param {DropdownProps} props
 * @returns {JSX.Element}
 */
export function Dropdown(props: DropdownProps): JSX.Element {
    const [state, dispatch] = React.useContext(StoreContext);
    const source = "Dropdown";
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
    for (let i = 0; i < options.length; i++) {

        if (typeof options[i] === "object") {
            options[i] = options[i].name;
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === importOption) {
            window.session.run("importVideo", state.level).then((result) => {
                const value = result || "";
                controller.debug(`result ${JSON.stringify(result)}`, { source });
                dispatch({ type: "set", source, payload: { key: props.id, value } });
            }).catch((error) => {
                controller.error(error, { source });
            });
        } else {
            dispatch({ type: "set", source, payload: { key: props.id, value: event.target.value } });
        }
    };
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
