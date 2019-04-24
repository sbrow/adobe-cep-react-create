/**
 * @author Tomer Riko Shalev
 */

import "@babel/polyfill";

import * as React from "react";
import ReactDOM from "react-dom";

import { App } from "./App";
// import { App } from "./test/TestApp";
import "./assets/css/style.css";
import "./assets/fonts/material-icons/index.css";
import "./assets/fonts/typeface-roboto/index.css";
import controller from "./controller";

window.onerror = (event: string | Event, source?: any, fileno?: any, columnNumber?: any, error?: any): void => {
    console.error(error);
    if (controller.hasSession()) {
        const source = (typeof event === "string") ? event : event.type;
        // @ts-ignore
        window.session.logger.log("error", error.message, { source });
    }
};

// import { createLogger, format, Logger, LoggerOptions, transports } from "winston";

// const logger = createLogger({
//     level: "info",
//     format: format.json(),
//     transports: [new transports.File({ filename: "/Users/sbrow/Documents/GitHub/cep-react/logs/test.log" })],
// });

// logger.info("'ello!");

ReactDOM.render(<App title="Video Builder" />, document.getElementById("root"));
