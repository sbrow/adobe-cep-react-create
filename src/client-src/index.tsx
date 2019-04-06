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

// console.log = window.console.log;

ReactDOM.render(<App title="Video Builder" />, document.getElementById("root"));
