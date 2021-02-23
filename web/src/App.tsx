import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { DayService } from "./generated/openapi";
import { Day } from "./generated/day";
// @ts-ignore
import themisWasm from "./themis/libthemis.wasm";
import * as themis from "./themis";

new DayService();
console.log(Day.toJSON({ date: "sdf" }));
themis.initialize(themisWasm).then(function () {
  let cell = themis.SecureCellSeal.withPassphrase("sdf");
  const encrypted = cell.encrypt(new TextEncoder().encode("Hello World"));
  console.log(new TextDecoder().decode(cell.decrypt(encrypted)));
});

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);

export default App;
