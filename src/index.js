import * as React from "react";
import * as ReactDOM from "react-dom";
import {createStore} from "redux";
import {Provider} from "react-redux";

import App from "./components/app/app.js";
import reducer from "./redux/reduсers";

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
const init = () => {
  ReactDOM.render(
      <Provider store = {store}>
        <App/>
      </Provider>,
      document.querySelector(`.react-container`)
  );
};
init();

