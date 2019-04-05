/**
 * @author Tomer Riko Shalev
 */

import * as React from "react";
import ReactDOM from "react-dom";
import { createLogger, format, transports } from "winston";

import { App } from "./App";
// import { App } from "./test/TestApp";
import "./assets/css/style.css";
import "./assets/fonts/material-icons/index.css";
import "./assets/fonts/typeface-roboto/index.css";

export const log = createLogger({
    level: "debug",
    // format: format.cli(),
    format: format.simple(),
    transports: [
        new transports.Console(),
    ],
});
console.log = window.console.log;

ReactDOM.render(<App />, document.getElementById("root"));
