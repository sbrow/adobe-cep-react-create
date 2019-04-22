/**
 * @author Tomer Riko Shalev
 */

import "@babel/polyfill";

import * as React from "react";
import ReactDOM from "react-dom";

import "./assets/css/style.css";
import "./assets/fonts/material-icons/index.css";
import "./assets/fonts/typeface-roboto/index.css";
import controller from "./controller";

import { App } from "./App";
// import { App } from "./test/TestApp";
window.onerror = (event: string | Event, source?: any, fileno?: any, columnNumber?: any, error?: any): void => {
    console.error(error);
    if (controller.hasSession()) {
        const src = (typeof event === "string") ? event : event.type;
        controller.error(error.message, { source: src });
    }
};

ReactDOM.render(<App title="Video Builder" />, document.getElementById("root"));
