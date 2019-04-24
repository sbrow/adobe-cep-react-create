import * as React from "react";
// import { useState } from "react";

import * as $ from "jquery";
import { Form } from "./components/Form";

export function App(props: { title?: string }) {
    document.title = props.title;
    return (
        <div>
            <Form />
            <button>Hello</button>
        </div>
    );
}
