import * as React from "react";
import {connect} from "react-redux";

import "./license.css";
import * as axios from "axios";
import {options} from "../../redux/api";

class License extends React.Component {
  constructor(props) {
    super(props);
    this.state = {active: false, newValue: false};
    this.cutNameRef = React.createRef();
    this.nameRef = React.createRef();
    this.descriptionRef = React.createRef();
    this.costRef = React.createRef();
    this.__activateClickHandler = this.__activateClickHandler.bind(this);
    this.__getInputFields = this.__getInputFields.bind(this);
    this.__blurHandler = this.__blurHandler.bind(this);
    this.__changeHandler = this.__changeHandler.bind(this);
    this.__keyDownHandler = this.__keyDownHandler.bind(this);
    this.__removeClickHandler = this.__removeClickHandler.bind(this);
  }
  __removeClickHandler() {
    const {_id} = this.props.licenses[this.props.i];
    const config = Object.assign({}, options, {headers: {data: JSON.stringify({id:_id})}});
    axios.delete(`licenses`, config).then(() => {
      this.props.deleteLicense(_id);
      this.props.deleteData();
    }).catch((error) => {
      console.log(error.response);
    });
  }
  __changeHandler(event) {
    this.setState({newValue: event.target.value});
  }
  __blurHandler(event) {
    event.target.parentNode.classList.remove(`license-field--active`);
    if (this.state.newValue || this.state.newValue === ``) {
      const number = this.props.i;
      const {_id, name, reduction, description, sum} = this.props.licenses[number];
      const data = new FormData();
      data.append(`id`, _id);
      const fieldName = this.state.active.id.split(`-`)[0];
      const container = event.target.parentNode;
      const value = this.state.newValue;
      data.append(fieldName, value);
      axios.put(`licenses`, data, options).then(() => {
        this.props.updateLicenses(_id, fieldName, value);
        if (this.props.i % 2 !== 0) {
          container.classList.add(`comments__redact--success-even`);
        } else {
          container.classList.add(`comments__redact--success-odd`);
        }
      }).catch((error) => {
        console.log(error.response);
        container.classList.add(`comments__redact--error`);
      });
    }
    this.setState({active: false, newValue: false});
  }
  __keyDownHandler(event) {
    if (event.key === `Enter`) {
      this.__blurHandler(event);
    }
    if (event.key === `Escape`) {
      this.state.active.classList.remove(`license-field--active`);
      this.setState({active: false, newValue: false});
    }
  }
  __activateClickHandler(event) {
    event.preventDefault();
    event.currentTarget.classList.remove(`comments__redact--success-even`);
    event.currentTarget.classList.remove(`comments__redact--error-even`);
    event.currentTarget.classList.remove(`comments__redact--success-odd`);
    event.currentTarget.classList.remove(`comments__redact--error-odd`);
    if (this.state.active && !this.state.active.contains(event.target)) {
      this.state.active.classList.remove(`license-field--active`);
    }
    if (!this.state.active) {
      this.setState({active: event.target});
      event.currentTarget.classList.add(`license-field--active`);
    } else if (!this.state.active.contains(event.target)) {
      this.setState({active: event.target});
      event.currentTarget.classList.add(`license-field--active`);
    }
  }
  __getInputFields(parent = false, value) {
    if (this.state.active && parent.current === this.state.active) {
      return <input className={`license__value--active`}
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
  render() {
    const number = this.props.i;
    const {_id, name, reduction, description, sum} = this.props.licenses[number];
    return <React.Fragment>
      <ul className={`dependence__list licenses__list`}>
        <li className={`button__remove remove-license__button`}
          onClick={this.__removeClickHandler}>
        </li>
        <li className={`license__item licenses__number`}>{number}</li>
        <li className={`license__item licenses__cut-name`}
          id={`reduction-` + number}
          ref={this.cutNameRef}
          onClick={this.__activateClickHandler}>
          {this.__getInputFields(this.cutNameRef, reduction)}
        </li>
        <li className={`license__item licenses__name`}
          id={`name-` + number}
          ref={this.nameRef}
          onClick={this.__activateClickHandler}>
          {this.__getInputFields(this.nameRef, name)}
        </li>
        <li className={`license__item licenses__description`}
          id={`description-` + number}
          ref={this.descriptionRef}
          onClick={this.__activateClickHandler}>
          {this.__getInputFields(this.descriptionRef, description)}
        </li>
        <li className={`license__item licenses__cost`}
          id={`sum-` + number}
          ref={this.costRef}
          onClick={this.__activateClickHandler}>
          {this.__getInputFields(this.costRef, sum)}
        </li>
      </ul>
    </React.Fragment>;
  }
}
export default connect(
    (mapStateToProps) => ({licenses: mapStateToProps.licenses.licenses, data: mapStateToProps.data.serverData}),
    (mapDispatchToProps) => ({
      updateLicenses: (id, name, value) => {
        mapDispatchToProps({type: `UPDATE_LICENSE`, payload: {id, name, value}});
      },
      deleteLicense: (id) => {
        mapDispatchToProps({type: `DELETE_LICENSE`, payload: id});
      },
      deleteData: () => {
        mapDispatchToProps({type: `DELETE_DATA`, payload: ``});
      }
    })
)(License);
