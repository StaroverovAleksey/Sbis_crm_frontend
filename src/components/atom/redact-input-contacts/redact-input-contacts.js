import * as React from "react";
import {connect} from "react-redux";

import "./redact-input-contacts.css";
import * as axios from "axios";
import {options} from "../../../redux/api";

class RedactInputContacts extends React.Component {
  constructor(props) {
    super(props);
    this.nameRef = React.createRef();
    this.positionRef = React.createRef();
    this.telRef = React.createRef();
    this.state = {active: false, newValue: false};
    this.__activateClickHandler = this.__activateClickHandler.bind(this);
    this.__blurHandler = this.__blurHandler.bind(this);
    this.__changeHandler = this.__changeHandler.bind(this);
    this.__getInputFields = this.__getInputFields.bind(this);
    this.__keyDownHandler = this.__keyDownHandler.bind(this);
    this.__removeClickHandler = this.__removeClickHandler.bind(this);
  }
  __removeClickHandler(event) {
    const data = new FormData();
    const id = this.props.id;
    const fieldName = `contacts[]`;
    const nameState = `contacts`;
    let valueState = this.props.contacts.concat();
    data.append(`id`, id);
    for (let i = 0; i < this.props.contacts.length; i++) {
      if (Number(event.target.id) === i) {
        valueState.splice(i, 1);
      } else {
        let value = this.props.contacts[i];
        value = JSON.stringify(value);
        data.append(fieldName, value);
      }
    }
    if (valueState.length === 0) {
      data.append(`contacts`, ``);
    }
    axios.put(`data`, data, options).then(() => {
      this.props.setCostLight(id, nameState, valueState);
      this.props.callback(`success`);
    }).catch((error) => {
      console.log(error.response);
      this.props.callback(error.response);
    });
    this.setState({active: false, newValue: false});
  }
  __getInputFields(parent = false, value) {
    if (this.state.active && parent.current === this.state.active) {
      return <input className={`contact__value--active`}
        defaultValue={value}
        type={`text`}
        autoFocus={true}
        onBlur={this.__blurHandler}
        onChange={this.__changeHandler}
        onKeyDown={this.__keyDownHandler}
      />;
    } else {
      return value;
    }
  }
  __activateClickHandler(event) {
    event.preventDefault();
    event.currentTarget.classList.remove(`comments__redact--success-even`);
    event.currentTarget.classList.remove(`comments__redact--error-even`);
    event.currentTarget.classList.remove(`comments__redact--success-odd`);
    event.currentTarget.classList.remove(`comments__redact--error-odd`);
    if (this.state.active && !this.state.active.contains(event.target)) {
      this.state.active.classList.remove(`contact-field--active`);
    }
    if (!this.state.active) {
      this.setState({active: event.target});
      event.currentTarget.classList.add(`contact-field--active`);
    } else if (!this.state.active.contains(event.target)) {
      this.setState({active: event.target});
      event.currentTarget.classList.add(`contact-field--active`);
    }
  }
  __blurHandler(event) {
    event.target.parentNode.classList.remove(`contact-field--active`);
    if (this.state.newValue || this.state.newValue === ``) {
      const data = new FormData();
      const id = this.props.id;
      const fieldName = this.props.name + `[]`;
      const container = event.target.parentNode;
      const valueState = this.props.contacts;
      const nameState = this.props.name;
      data.append(`id`, id);
      for (let i = 0; i < this.props.contacts.length; i++) {
        if (this.props.i === i) {
          const activeFieldName = this.state.active.id.split(`-`)[0];
          let value = this.props.contacts[i];
          switch (activeFieldName) {
            case `name`:
              value.name = this.state.newValue;
              valueState[i].name = this.state.newValue;
              break;
            case `position`:
              value.position = this.state.newValue;
              valueState[i].position = this.state.newValue;
              break;
            case `tel`:
              value.tel = this.state.newValue;
              valueState[i].tel = this.state.newValue;
              break;
          }
          value = JSON.stringify(value);
          data.append(fieldName, value);
        } else {
          let value = this.props.contacts[i];
          value = JSON.stringify(value);
          data.append(fieldName, value);
        }
      }
      axios.put(`data`, data, options).then(() => {
        this.props.setCostLight(id, nameState, valueState);
        this.props.callback(`success`);
        if (this.props.i % 2 !== 0) {
          container.classList.add(`comments__redact--success-even`);
        } else {
          container.classList.add(`comments__redact--success-odd`);
        }
      }).catch((error) => {
        console.log(error.response);
        this.props.callback(error.response);
        container.classList.add(`comments__redact--error`);
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
      this.state.active.classList.remove(`contact-field--active`);
      this.setState({active: false, newValue: false});
    }
  }
  render() {
    const {name, position, tel, i} = this.props.contact;
    return <React.Fragment>
      <td className={`contact-value contacts-table__name`}
        id={`name-` + this.props.i}
        ref={this.nameRef}
        onClick={this.__activateClickHandler}>
        {this.__getInputFields(this.nameRef, name)}
      </td>
      <td className={`contact-value contacts-table__position`}
        id={`position-` + this.props.i}
        ref={this.positionRef}
        onClick={this.__activateClickHandler}>
        {this.__getInputFields(this.positionRef, position)}
      </td>
      <td className={`contact-value contacts-table__tel`}
        id={`tel-` + this.props.i}
        ref={this.telRef}
        onClick={this.__activateClickHandler}>
        {this.__getInputFields(this.telRef, tel)}
      </td>
      <td className={`button__remove contacts__remove-button`}
        onClick={this.__removeClickHandler}
        id={this.props.i}>
      </td>
    </React.Fragment>;
  }
}
export default connect(
    undefined,
    (mapDispatchToProps) => ({
      setCostLight: (id, name, value) => {
        mapDispatchToProps({type: `SET_COST_LIGHT`, payload: {id, name, value}});
      },
    })
)(RedactInputContacts);
