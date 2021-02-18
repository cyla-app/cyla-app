import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { DayService } from "./generated/openapi";
import { Day } from "./generated/day";
import * as themis from "wasm-themis";

function App() {
  new DayService();
  console.log(Day.toJSON({ date: "sdf" }));
  themis.initialized.then(function () {
    //
    // Now you can use "themis" functions
    //
  });
  //let cell = themis.SecureCellSeal.withKey(Buffer.from("sdf"));

  return (
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
}

export default App;
