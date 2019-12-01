import * as React from "react";
import {connect} from "react-redux";

import "./licenses-table.css";
import License from "../license/license.js";

class LicensesTable extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {licenses} = this.props;
    return <React.Fragment>
      <ul className={`title-list`}>
        <li className={`title-item licenses__number`}>№</li>
        <li className={`title-item licenses__cut-name`}>Сокр. название</li>
        <li className={`title-item licenses__name`}>Название</li>
        <li className={`title-item licenses__description`}>Описание</li>
        <li className={`title-item licenses__cost`}>Цена</li>
      </ul>
      <section className={`licenses-table`}>
        {licenses.map((license, i) => {
          return <License
            key = {`license ` + i}
            i = {i}
            callback = {this.__update}/>;
        })}
      </section>
    </React.Fragment>;
  }
}
export default connect(
    (mapStateToProps) => ({licenses: mapStateToProps.licenses.licenses})
)(LicensesTable);
