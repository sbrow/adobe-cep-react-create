import * as React from "react";
import controller from "../controller";
import { StoreContext } from "../Stores/AppStore";
import { NumberInputProps } from "../Types";

export function NumberInput(props: NumberInputProps): JSX.Element {
    const [state, dispatch] = React.useContext(StoreContext);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            dispatch({ type: "set", source: "Dropdown", payload: { key: props.id, value: event.target.value } });
        } catch (error) {
            controller.error(error, { source: "NumberInput" });
        }
    };
    return (<div class="row">
        <label htmlFor={`${props.id}-data`}>{props.label}</label>
        <input type="number" id={`${props.id}-data`} value={state.get(props.id)} onChange={onChange}
            min={props.min || 0} max={props.max} />
    </div>);
}

export default NumberInput;
