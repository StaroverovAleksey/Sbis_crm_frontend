import * as React from "react";
import {connect} from "react-redux";

import "./connect-table.css";
import ClientConnect from "../client-connect/client-connect.js";
import CalcIncome from "../atom/calcIncom.js";

class ConnectTable extends React.Component {
  constructor(props) {
    super(props);
    this._clickHandler = this._clickHandler.bind(this);
    this._doubleClickHandler = this._doubleClickHandler.bind(this);
    this._closeHandler = this._closeHandler.bind(this);
    this.state = {activeElement: ``, openElement: ``};
  }
  /* Строка в фокусе */
  _clickHandler(event) {
    if (event.target.parentNode === this.state.activeElement) {
      this.setState({activeElement: ``});
    } else {
      this.setState({activeElement: event.target.parentNode});
    }
  }
  /* Строка в открытом состоянии */
  _doubleClickHandler(event) {
    this.setState({activeElement: ``, openElement: event.target.parentNode});
  }
  /* Закрытие карточки клиента */
  _closeHandler() {
    this.setState({openElement: ``});
  }
  render() {
    let number = 0;
    let serverData = null;
    if (this.props.data.filterActive) {
      serverData = this.props.data.search;
    } else {
      serverData = this.props.data.serverData;
    }
    if (serverData) {
      const data = [];
      for (let item of serverData) {
        if (item.served === `candidate`) {
          data.push(item);
        }
      }
      return <React.Fragment>
        <CalcIncome
          data = {data}/>
        <ul className={`title-list`}>
          <li className={`title-item item__number`}>№</li>
          <li className={`title-item item__inn`}>ИНН</li>
          <li className={`title-item item__name`}>Имя</li>
          <li className={`title-item item__date`}>Дата</li>
          <li className={`title-item item__license`}>Лицензии</li>
          <li className={`title-item item__cost`}>Стоимость</li>
          <li className={`title-item item__rtp`}>РТП</li>
          <li className={`title-item item__tenzor`}>Тензор</li>
          <li className={`title-item item__tax`}>Налог</li>
          <li className={`title-item item__income`}>Доход</li>
        </ul>
        <section className={`main-table`}>
          <ul className={`chief__list`}>
            {data.map((dataElem) => {
              number++;
              return <li className={`connect-list`}
                key={`clientData-` + number}>
                <ClientConnect
                  data = {dataElem}
                  number = {number}
                  clickHandler = {this._clickHandler}
                  doubleClickHandler = {this._doubleClickHandler}
                  closeHandler = {this._closeHandler}
                  activeElement = {this.state.activeElement}
                  openElement = {this.state.openElement}
                  key={`clientData-` + number}
                  removeCallback = {this._closeHandler}/>
              </li>;
            })}
          </ul>
        </section>
      </React.Fragment>;
    } else {
      return null;
    }
  }
}
export default connect(
    (mapStateToProps) => ({data: mapStateToProps.data, licenses: mapStateToProps.licenses}),
    (mapDispatchToProps) => ({
      changeRout: (data) => {
        mapDispatchToProps({type: `GET_DATA`, payload: data});
      },
      addLicenses: (data) => {
        mapDispatchToProps({type: `GET_LICENSES`, payload: data});
      }
    })
)(ConnectTable);
