import * as React from "react";
// import { useState } from "react";
import { Form } from "./components/Form";
import controller from "./controller";
import { StoreProvider } from "./Stores/AppStore";

export function App(props: { title?: string }) {
    document.title = props.title || "";
    return (
        <div>
            <StoreProvider>
                <Form />
            </StoreProvider>
        </div>
    );
}
