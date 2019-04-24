import React from "react";

interface OptionProps {
    value: string;
    id?: string;
}

export function Option(props: OptionProps | string): JSX.Element {
    if (typeof props === "string") {
        props = { value: props };
    }
    return (<option {...props}>{props.value}</option>);
}
