import * as React from "react";
import * as axios from "axios";

import "./redact-input.css";
import {options} from "../../../redux/api";
import {connect} from "react-redux";

class RedactInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: false, newValue: false};
    this.__activateHandler = this.__activateHandler.bind(this);
    this.__blurHandler = this.__blurHandler.bind(this);
    this.__changeHandler = this.__changeHandler.bind(this);
    this.__keyDownHandler = this.__keyDownHandler.bind(this);
  }
  __recountIncome(data) {
    let licensesSum = 0;
    for (let license of data.object.licenses) {
      licensesSum = licensesSum + parseInt(license.sum);
    }
    let rtp = licensesSum * data.object.rtp / 100;
    let tenzor = licensesSum * data.object.tenzor / 100;
    let tax = licensesSum * data.object.tax / 100;
    switch (this.props.name) {
      case `rtp`:
        rtp = licensesSum * data.value / 100;
        break;
      case `tenzor`:
        tenzor = licensesSum * data.value / 100;
        break;
      case `tax`:
        tax = licensesSum * data.value / 100;
        break;
    }
    return licensesSum - rtp - tenzor - tax;
  }
  __activateHandler(event) {
    event.target.parentNode.classList.remove(`item-value__wrapper--success`);
    event.target.parentNode.classList.remove(`item-value__wrapper--error`);
    this.setState({active: true});
  }
  __blurHandler(event) {
    if (this.state.newValue || this.state.newValue === ``) {
      const data = new FormData();
      const id = this.props.id;
      const value = this.state.newValue;
      const fieldName = this.props.name;
      const container = event.target.parentNode;
      data.append(`id`, id);
      data.append(fieldName, value);
      axios.put(`data`, data, options).then(() => {
        this.props.setCostLight(id, fieldName, value);
        this.props.callback(`success`);
        container.classList.add(`item-value__wrapper--success`);
      }).catch((error) => {
        console.log(error.response);
        this.props.callback(error.response);
        container.classList.add(`item-value__wrapper--error`);
      });
    }
    this.setState({active: false, newValue: false});
  }
  __changeHandler(event) {
    this.setState({newValue: event.target.value});
  }
  __keyDownHandler(event) {
    if (event.key === `Enter`) {
      this.__blurHandler(event);
    }
    if (event.key === `Escape`) {
      this.setState({active: false});
    }
  }
  __getDataField() {
    const {value, simbol = ``} = this.props;
    if (this.state.active) {
      return <input className={`item__value--active`}
        type={`text`}
        defaultValue={value}
        autoFocus={true}
        onChange={this.__changeHandler}
        onBlur={this.__blurHandler}
        onKeyDown={this.__keyDownHandler}/>;
    } else {
      return <p className={`item__value`}>{value + ` ` + simbol}</p>;
    }
  }
  render() {
    return <div className={`item-value__wrapper`}
      onClick={this.__activateHandler}>
      {this.__getDataField()}
    </div>;
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if ((this.props.name === `rtp` || this.props.name === `tenzor` || this.props.name === `tax`) && this.props.value !== prevProps.value) {
      const preIncome = this.__recountIncome(prevProps);
      const newIncome = this.__recountIncome(this.props);
      const differenceIncome = newIncome - preIncome;
      this.props.redactIncome(differenceIncome);
    }
  }
}
export default connect(
    undefined,
    (mapDispatchToProps) => ({
      setCostLight: (id, name, value) => {
        mapDispatchToProps({type: `SET_COST_LIGHT`, payload: {id, name, value}});
      },
      redactIncome: (difference) => {
        mapDispatchToProps({type: `REDACT_INCOME`, payload: difference});
      }
    })
)(RedactInput);
