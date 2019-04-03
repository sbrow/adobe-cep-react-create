import * as React from "react";

import { Form } from "./components/Form";
import controller from "./controller"

export function App() {
    // @ts-ignore
    const click = () => { window.session.test(); };
    return (
        <div>
            <Form />
        </div>
    );
}
