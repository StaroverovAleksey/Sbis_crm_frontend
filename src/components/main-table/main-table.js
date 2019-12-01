import * as React from "react";
import {connect} from "react-redux";
import * as axios from "axios";

import "./main-table.css";
import Client from "../client/client.js";
import CalcIncome from "../atom/calcIncom.js";
import {options} from "../../redux/api";

class MainTable extends React.Component {
  constructor(props) {
    super(props);
    this._clickHandler = this._clickHandler.bind(this);
    this._doubleClickHandler = this._doubleClickHandler.bind(this);
    this._closeHandler = this._closeHandler.bind(this);
    this.__addIncome = this.__addIncome.bind(this);
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
  __calcIncome(object) {
    let licensesSum = 0;
    for (let license of object.licenses) {
      licensesSum = licensesSum + parseInt(license.sum);
    }
    const rtp = licensesSum * parseInt(object.rtp) / 100;
    const tenzor = licensesSum * parseInt(object.tenzor) / 100;
    const tax = licensesSum * parseInt(object.tax) / 100;
    const income = licensesSum - rtp - tenzor - tax;
    return income;
  }
  __addIncome() {
    let income = 0;
    let serverData = null;
    if (this.props.data.filterActive) {
      serverData = this.props.data.search;
    } else {
      serverData = this.props.data.serverData;
    }
    if (!serverData) {
      return;
    }
    for (let object of serverData) {
      income = income + this.__calcIncome(object);
    }
    this.props.setIncome(income);
    console.log(income);
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
        if (item.served === `true`) {
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
              return <li className={`chief__item`}
                key={`clientData-` + number}>
                <Client
                  data = {dataElem}
                  number = {number}
                  clickHandler = {this._clickHandler}
                  doubleClickHandler = {this._doubleClickHandler}
                  closeHandler = {this._closeHandler}
                  activeElement = {this.state.activeElement}
                  openElement = {this.state.openElement}
                  key={`clientData-` + number}/>
                {dataElem.links.map((linkElem) => {
                  number++;
                  return <Client
                    parentData = {dataElem}
                    data = {linkElem}
                    number = {number}
                    clickHandler = {this._clickHandler}
                    doubleClickHandler = {this._doubleClickHandler}
                    closeHandler = {this._closeHandler}
                    activeElement = {this.state.activeElement}
                    openElement = {this.state.openElement}
                    key={`clientData-` + number}
                    removeCallback = {this._closeHandler}/>;
                })}
              </li>;
            })}
          </ul>
        </section>
        <div className={`preload-picture`}>
          <p className={`preload-picture__1`}></p>
          <p className={`preload-picture__2`}></p>
          <p className={`preload-picture__3`}></p>
          <p className={`preload-picture__4`}></p>
          <p className={`preload-picture__5`}></p>
          <p className={`preload-picture__6`}></p>
          <p className={`preload-picture__7`}></p>
        </div>
      </React.Fragment>;
    } else {
      return null;
    }
  }
  componentDidMount() {
    if (!this.props.data.serverData) {
      axios.get(`data`, options).then((response) => {
        this.props.changeRout(response.data);
      }).catch((error) => {
        this.activateInvalidField();
        if (error.response) {
          this.setState({reqStatus: `Внутренняя ошибка сервера.`});
        } else {
          this.setState({reqStatus: `Ответ от сервера не получен.`});
        }
      });
    }
    if (!this.props.licenses.licenses) {
      axios.get(`licenses`, options).then((response) => {
        this.props.addLicenses(response.data);
      }).catch((error) => {
        this.activateInvalidField();
        if (error.response) {
          this.setState({reqStatus: `Внутренняя ошибка сервера.`});
        } else {
          this.setState({reqStatus: `Ответ от сервера не получен.`});
        }
      });
    }
  }
}
export default connect(
    (mapStateToProps) => ({data: mapStateToProps.data, licenses: mapStateToProps.licenses, user: mapStateToProps.user}),
    (mapDispatchToProps) => ({
      changeRout: (data) => {
        mapDispatchToProps({type: `GET_DATA`, payload: data});
      },
      addLicenses: (data) => {
        mapDispatchToProps({type: `GET_LICENSES`, payload: data});
      },
      setIncome: (income) => {
        mapDispatchToProps({type: `SET_INCOME`, payload: income});
      }
    })
)(MainTable);
