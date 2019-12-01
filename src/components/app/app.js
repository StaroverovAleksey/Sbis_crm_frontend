import * as React from "react";
import {connect} from "react-redux";

import {AuthScreen} from "../authorization-screen/authorization-screen.js";
import SelectorMenu from "../selector-menu/selector-menu";
import MainTable from "../main-table/main-table.js";
import LicensesTable from "../licenses-table/licenses-table.js";
import ConnectTable from "../connect-table/connect-table.js";
import RemoveTable from "../remove-table/remove-table.js";
import NavigationMenu from "../navigstion-menu/navigation-menu";
import "./app.css";

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {token} = this.props.user;
    const {routing} = this.props.user;
    if (token) {
      switch (routing) {
        case `main`: return <React.Fragment>
          <SelectorMenu/>
          <MainTable/>
          <NavigationMenu/>
        </React.Fragment>;
        case `connecting`: return <React.Fragment>
          <SelectorMenu/>
          <ConnectTable/>
          <NavigationMenu/>
        </React.Fragment>;
        case `disconnecting`: return <React.Fragment>
          <SelectorMenu/>
          <RemoveTable/>
          <NavigationMenu/>
        </React.Fragment>;
        case `history`: return <React.Fragment>
          <SelectorMenu/>
          <ConnectTable/>
          <NavigationMenu/>
        </React.Fragment>;
        case `licenses`: return <React.Fragment>
          <SelectorMenu/>
          <LicensesTable/>
          <NavigationMenu/>
        </React.Fragment>;
        case `settings`: return <React.Fragment>
          <SelectorMenu/>
          <ConnectTable/>
          <NavigationMenu/>
        </React.Fragment>;
      }
    } else {
      return <React.Fragment>
        <AuthScreen/>
      </React.Fragment>;
    }
  }
}

export default connect(
    (mapStateToProps) => ({user: mapStateToProps.user}),
    undefined
)(App);
