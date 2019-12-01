import * as React from "react";

import "./transfer-popup.css";
import {connect} from "react-redux";

class TransferPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: null};
    this.popupList = React.createRef();
    this.__clickHandler = this.__clickHandler.bind(this);
  }
  __clickHandler(event) {
    if (this.props.type === `licenses` || this.props.type === `months`) {
      let valueArray = [];
      event.target.classList.toggle(`popup__item--active`);
      for (let value of this.popupList.current.children) {
        if (value.classList.contains(`popup__item--active`)) {
          valueArray.push(value.id);
        }
      }
      this.setState({value: valueArray});
      return;
    }
    for (let value of this.popupList.current.children) {
      value.classList.remove(`popup__item--active`);
    }
    event.target.classList.add(`popup__item--active`);
    this.setState({value: event.target.id});
  }
  __getPopup() {
    const {stateData, licenses} = this.props;
    let data = [];
    if (!Array.isArray(this.props.licenses)) {
      return;
    }
    if (this.props.type && this.props.type === `licenses`) {
      for (let value of licenses) {
        data = data.concat(value);
      }
    } else if (this.props.type && this.props.type === `months`) {
      data = [
        {name: `Январь`, _id: `01`},
        {name: `Февраль`, _id: `02`},
        {name: `Март`, _id: `03`},
        {name: `Апрель`, _id: `04`},
        {name: `Май`, _id: `05`},
        {name: `Июнь`, _id: `06`},
        {name: `Июль`, _id: `07`},
        {name: `Август`, _id: `08`},
        {name: `Сентябрь`, _id: `09`},
        {name: `Октябрь`, _id: `10`},
        {name: `Ноябрь`, _id: `11`},
        {name: `Декабрь`, _id: `12`}
      ]
    } else {
      data = [{name: `New group`, _id: `New group`}];
      for (let value of stateData) {
        if (value.served === `true`) {
          data = data.concat(value);
        }
      }
    }
    if (this.props.activate) {
      return <div className={`popup__container`}>
        <p className={`popup__title`}>{this.props.name}</p>
        <p className={`popup__close-button button__remove`}
          onClick={this.props.callback}>
        </p>
        <ul className={`popup__list`}
          ref={this.popupList}>
          {data.map((chiefItem, i) => {
            return <li
              className={`popup__item`}
              key={`chiefItem-` + i}
              id={chiefItem._id}
              onClick={this.__clickHandler}>
              {chiefItem.name}
            </li>;
          })}
        </ul>
        <button className={`popup__add-button button`}
          onClick={(event) => {
            this.props.callback(event, this.state.value);
            this.setState({value: null});
          }}>{this.props.button}</button>
      </div>;
    } else {
      return null;
    }
  }
  render() {
    return <React.Fragment>
      {this.__getPopup()}
    </React.Fragment>;
  }
}
export default connect(
    (mapStateToProps) => ({stateData: mapStateToProps.data.serverData, licenses: mapStateToProps.licenses.licenses}),
    (mapDispatchToProps) => ({
      setCostLight: (id, name, value) => {
        mapDispatchToProps({type: `SET_COST_LIGHT`, payload: {id, name, value}});
      },
      setIncome: (income) => {
        mapDispatchToProps({type: `SET_INCOME`, payload: income});
      }
    })
)(TransferPopup);
