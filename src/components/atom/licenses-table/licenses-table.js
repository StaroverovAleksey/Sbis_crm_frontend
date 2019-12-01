import * as React from "react";
import {connect} from "react-redux";

import "./licenses-table.css";
import * as axios from "axios";
import {options} from "../../../redux/api";

class LicensesTable extends React.Component {
  constructor(props) {
    super(props);
    this.tableRef = React.createRef();
    this.state = {redact: false};
    this.__activateRedactHandler = this.__activateRedactHandler.bind(this);
    this.__getTable = this.__getTable.bind(this);
    this.__clickHandler = this.__clickHandler.bind(this);
    this.__highlightingLicense = this.__highlightingLicense.bind(this);
  }
  __recountIncome(data) {
    let licensesSum = 0;
    for (let license of data.clientLicenses) {
      licensesSum = licensesSum + parseInt(license.sum);
    }
    let rtp = licensesSum * data.object.rtp / 100;
    let tenzor = licensesSum * data.object.tenzor / 100;
    let tax = licensesSum * data.object.tax / 100;
    return licensesSum - rtp - tenzor - tax;
  }
  __clickHandler(event) {
    let flag = true;
    const data = new FormData();
    const id = this.props.id;
    const stateData = [];
    data.append(`id`, id);
    event.currentTarget.classList.toggle(`license--active`);
    for (let i = 0; i < this.tableRef.current.children.length; i++) {
      if (this.tableRef.current.children[i].classList.contains(`license--active`)) {
        flag = false;
        data.append(`licenses[]`, this.tableRef.current.children[i].id);
        for (let j = 0; j < this.props.licenses.length; j++) {
          if (this.props.licenses[j]._id === this.tableRef.current.children[i].id) {
            stateData.push(this.props.licenses[j]);
          }
        }
      }
    }
    if (flag) {
      data.append(`licenses[]`, []);
    }
    axios.put(`data`, data, options).then(() => {
      this.props.updateLicenses(id, `licenses`, stateData);
      this.props.callback(`success`);
    }).catch((error) => console.log(error));
  }
  __activateRedactHandler(event) {
    if (this.state.redact) {
      this.setState({redact: false});
      event.currentTarget.classList.remove(`licenses-redact--paint--active`);
      for (let license of this.tableRef.current.children) {
        license.classList.remove(`license--active`);
      }
    } else {
      this.setState({redact: true});
      event.currentTarget.classList.add(`licenses-redact--paint--active`);
    }
  }
  __highlightingLicense() {
    const {clientLicenses} = this.props;
    const licenses = this.tableRef.current.children;
    if (this.state.redact) {
      for (let i = 0; i < licenses.length; i++) {
        for (let j = 0; j < clientLicenses.length; j++) {
          if (licenses[i].id === clientLicenses[j]._id) {
            licenses[i].classList.add(`license--active`);
          }
        }
      }
    }
  }
  __getTable() {
    const {clientLicenses, licenses} = this.props;
    if (this.state.redact) {
      return licenses.map((license, i) => {
        return <tr className={`table__stroke`}
          key={`license-` + i}
          onClick={this.__clickHandler}
          id={license._id}>
          <td className={`licenses__value licenses-table__name licenses--clickable`}>{license.reduction}</td>
          <td className={`licenses__value licenses-table__position licenses--clickable`}>{license.name}</td>
          <td className={`licenses__value licenses-table__tel licenses--clickable`}>{license.sum}</td>
        </tr>;
      });
    } else {
      return clientLicenses.map((contact, i) => {
        return <tr className={`table__stroke`}
          key={`license-` + i}>
          <td className={`licenses__value licenses-table__name`}>{contact.reduction}</td>
          <td className={`licenses__value licenses-table__position`}>{contact.name}</td>
          <td className={`licenses__value licenses-table__tel`}>{contact.sum}</td>
        </tr>;
      });
    }
  }
  render() {
    const {clientLicenses, licenses} = this.props;
    let outputLicenses = clientLicenses;
    return <div className={`licenses-table__wrapper`}>
      <table className={`item__value open-item__table`}>
        <tbody ref={this.tableRef}>
          <tr className={`table__title`}>
            <th className={`licenses-table__name`}>Сокр.</th>
            <th className={`licenses-table__position`}>Название</th>
            <th className={`licenses-table__tel`}>
              Цена
              <p className={`licenses-redact--paint`}
                onClick={this.__activateRedactHandler}>
              </p>
            </th>
          </tr>
          {this.__getTable()}
        </tbody>
      </table>
    </div>;
  }
  componentDidUpdate(prevProps) {
    this.__highlightingLicense();
    if (this.props.clientLicenses.length !== prevProps.clientLicenses.length) {
      const preIncome = this.__recountIncome(prevProps);
      const newIncome = this.__recountIncome(this.props);
      const differenceIncome = newIncome - preIncome;
      this.props.redactIncome(differenceIncome);
    }
  }
}
export default connect(
    (mapStateToProps) => ({licenses: mapStateToProps.licenses.licenses}),
    (mapDispatchToProps) => ({
      updateLicenses: (id, name, value) => {
        mapDispatchToProps({type: `SET_COST_LIGHT`, payload: {id, name, value}});
      },
      redactIncome: (difference) => {
        mapDispatchToProps({type: `REDACT_INCOME`, payload: difference});
      }
    })
)(LicensesTable);
