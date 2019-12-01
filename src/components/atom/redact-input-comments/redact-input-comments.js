import * as React from "react";
import * as axios from "axios";

import "./redact-input-comments.css";
import {options} from "../../../redux/api";
import {connect} from "react-redux";

class RedactInputComments extends React.Component {
  constructor(props) {
    super(props);
    this.commentsList = React.createRef();
    this.state = {active: false, newValue: false};
    this.__activateHandler = this.__activateHandler.bind(this);
    this.__blurHandler = this.__blurHandler.bind(this);
    this.__changeHandler = this.__changeHandler.bind(this);
    this.__keyDownHandler = this.__keyDownHandler.bind(this);
    this.__removeClickHandler = this.__removeClickHandler.bind(this);
  }
  __activateHandler(event) {
    event.preventDefault();
    event.target.parentNode.classList.remove(`comments__redact--success-even`);
    event.target.parentNode.classList.remove(`comments__redact--error-even`);
    event.target.parentNode.classList.remove(`comments__redact--success-odd`);
    event.target.parentNode.classList.remove(`comments__redact--error-odd`);
    for (let i = 0; i < this.props.commentsList.current.childNodes.length; i++) {
      if (this.props.commentsList.current.childNodes[i].contains(event.target)) {
        this.setState({active: i});
      }
    }
  }
  __blurHandler(event) {
    if (this.state.newValue || this.state.newValue === ``) {
      const data = new FormData();
      const id = this.props.id;
      const fieldName = this.props.name + `[]`;
      const container = event.target.parentNode;
      const valueState = this.props.comments;
      const nameState = this.props.name;
      data.append(`id`, id);
      for (let i = 0; i < this.props.comments.length; i++) {
        if (this.props.i === i) {
          const value = this.state.newValue;
          valueState[i] = this.state.newValue;
          data.append(fieldName, value);
        } else {
          const value = this.props.comments[i];
          data.append(fieldName, value);
        }
      }
      axios.put(`data`, data, options).then(() => {
        this.props.setCostLight(id, nameState, valueState);
        this.props.callback(`success`);
        if (this.props.i % 2 === 0) {
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
      this.setState({active: false, newValue: false});
    }
  }
  __getDataField() {
    const {comment} = this.props;
    if (this.props.i === this.state.active) {
      return <textarea className={`comment__value--active`}
        defaultValue={comment}
        rows={`3`}
        autoFocus={true}
        onChange={this.__changeHandler}
        onBlur={this.__blurHandler}
        onKeyDown={this.__keyDownHandler}
        onFocus={this.__cursorToEnd}>
      </textarea>;
    } else {
      return <p className={`comment__value`}
        onMouseDown={this.__activateHandler}>{comment}</p>;
    }
  }
  __removeClickHandler(event) {
    const data = new FormData();
    const id = this.props.id;
    const fieldName = this.props.name + `[]`;
    const nameState = this.props.name;
    let valueState = this.props.comments.concat();
    data.append(`id`, id);
    for (let i = 0; i < this.props.comments.length; i++) {
      if (Number(event.target.id) === i) {
        valueState.splice(i, 1);
      } else {
        const value = this.props.comments[i];
        data.append(fieldName, value);
      }
    }
    if (valueState.length === 0) {
      data.append(`comments`, ``);
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
  __cursorToEnd(event) {
    event.target.selectionStart = event.target.selectionEnd = event.target.value.length;
  }
  render() {
    return <li className={`comments__item`}>
      {this.__getDataField()}
      <div className={`button__remove`}
        id={this.props.i}
        onClick={this.__removeClickHandler}>
      </div>
    </li>;
  }
}
export default connect(
    undefined,
    (mapDispatchToProps) => ({
      setCostLight: (id, name, value) => {
        mapDispatchToProps({type: `SET_COST_LIGHT`, payload: {id, name, value}});
      },
    })
)(RedactInputComments);
