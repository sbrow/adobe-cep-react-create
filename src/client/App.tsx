import * as React from "react";
import { AppStoreProvider } from "./components/AppStoreProvider";
import { Form } from "./components/Form";
import controller from "./controller";

export function App(props: { title?: string }) {
    document.title = props.title || "";
    return (
        <div id="app">
            <AppStoreProvider>
                <Form />
            </AppStoreProvider>
        </div>
    );
}
