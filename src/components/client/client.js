import * as React from "react";
import {connect} from "react-redux";
import * as axios from "axios";

import "./client.css";
import RedactInput from "../atom/redact-input/redact-input.js";
import RedactInputComments from "../atom/redact-input-comments/redact-input-comments.js";
import RedactInputContacts from "../atom/redact-input-contacts/redact-input-contacts.js";
import LicensesTable from "../atom/licenses-table/licenses-table.js";
import {options} from "../../redux/api";
import TransferPopup from "../atom/transfer-popup/transfer-popup";

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.closeButton = React.createRef();
    this.containerClose = React.createRef();
    this.containerOpen = React.createRef();
    this.costLights = React.createRef();
    this.dateLights = React.createRef();
    this.errorMsg = React.createRef();
    this.commentsList = React.createRef();
    this.state = {lights: false, activeRedactField: false, errorMsg: ``, popup: false};
    this.__closeSectionHandler = this.__closeSectionHandler.bind(this);
    this.__contextMenu = this.__contextMenu.bind(this);
    this.__contextMenuClickHandler = this.__contextMenuClickHandler.bind(this);
    this.__openContextMenuHandler = this.__openContextMenuHandler.bind(this);
    this.__closeContextMenuHandler = this.__closeContextMenuHandler.bind(this);
    this.__updateComponent = this.__updateComponent.bind(this);
    this.__addContactClickHandler = this.__addContactClickHandler.bind(this);
    this.__removeClickHandler = this.__removeClickHandler.bind(this);
    this.__connectClickHandler = this.__connectClickHandler.bind(this);
    this.__connectCloseCallback = this.__connectCloseCallback.bind(this);
    this.__crownClickHandler = this.__crownClickHandler.bind(this);
    this.__addContactsPopUp = this.__addContactsPopUp.bind(this);
    this.__addCommentsPopUp = this.__addCommentsPopUp.bind(this);
    this.__addCommentClickHandler = this.__addCommentClickHandler.bind(this);
  }
  __crownClickHandler() {
    const data = new FormData();
    const newLinks = [];
    data.append(`id`, this.props.data._id);
    data.append(`chief`, `true`);
    for (let link of this.props.parentData.links) {
      if (link._id !== this.props.data._id) {
        data.append(`links[]`, link._id);
        newLinks.push(link);
      }
    }
    data.append(`links[]`, this.props.parentData._id);
    newLinks.push(this.props.parentData);
    newLinks[newLinks.length - 1].links = [];
    newLinks[newLinks.length - 1].chief = `false`;
    axios.put(`data`, data, options).then(() => {
    }).catch((error) => {
      console.log(error.response);
    });
    const chiefData = new FormData();
    chiefData.append(`id`, this.props.parentData._id);
    chiefData.append(`chief`, `false`);
    chiefData.append(`links`, ``);
    data.append(`links`, ``);
    axios.put(`data`, chiefData, options).then(() => {
      this.props.addObject(this.props.data);
      this.props.setCostLight(this.props.data._id, `chief`, `true`);
      this.props.setCostLight(this.props.data._id, `links`, newLinks);
      this.props.removeObject(this.props.parentData._id);
    }).catch((error) => {
      console.log(error.response);
    });
  }
  __connectOldGroup(value) {
    if (this.props.parentData && this.props.parentData._id === value) {
      return;
    }
    if (this.props.data.chief === `true` && this.props.data._id === value) {
      return;
    }
    const newLinksOldChief = [];
    if (this.props.data.chief === `true`) {
      const data = new FormData();
      data.append(`id`, this.props.data._id);
      data.append(`chief`, `false`);
      axios.put(`data`, data, options).then(() => {
      }).catch((error) => {
        console.log(error.response);
      });
    } else {
      const data = new FormData();
      data.append(`id`, this.props.parentData._id);
      for (let link of this.props.parentData.links) {
        if (link._id !== this.props.data._id) {
          data.append(`links[]`, link._id);
          newLinksOldChief.push(link);
        }
      }
      if (this.props.parentData.links.length === 1) {
        data.append(`links`, ``);
      }
      axios.put(`data`, data, options).then(() => {
      }).catch((error) => {
        console.log(error.response);
      });
    }
    const chiefData = new FormData();
    let chiefObject = null;
    const newLinks = [];
    for (let obj of this.props.stateData) {
      if (obj._id === value) {
        chiefObject = obj;
      }
    }
    chiefData.append(`id`, value);
    for (let link of chiefObject.links) {
      chiefData.append(`links[]`, link._id);
      newLinks.push(link);
    }
    chiefData.append(`links[]`, this.props.data._id);
    newLinks.push(this.props.data);
    axios.put(`data`, chiefData, options).then(() => {
      this.props.setCostLight(value, `links`, newLinks);
      if (this.props.data.chief === `true`) {
        this.props.removeObject(this.props.data._id);
      } else {
        this.props.setCostLight(this.props.parentData._id, `links`, newLinksOldChief);
      }
      this.props.removeCallback();
    }).catch((error) => {
      console.log(error.response);
    });
  }
  __connectNewGroup() {
    if (this.props.data.chief === `true`) {
      return;
    }
    const {_id} = this.props.data;
    const data = new FormData();
    data.append(`id`, _id);
    data.append(`chief`, `true`);
    axios.put(`data`, data, options).then(() => {
    }).catch((error) => {
      console.log(error.response);
    });
    const chiefData = new FormData();
    let chiefObject = null;
    let newObject = null;
    for (let obj of this.props.stateData) {
      for (let link of obj.links) {
        if (link._id === this.props.data._id) {
          chiefObject = obj;
          newObject = link;
        }
      }
    }
    newObject.chief = `true`;
    chiefData.append(`id`, chiefObject._id);
    let newLinks = [];
    for (let link of chiefObject.links) {
      if (link._id !== this.props.data._id) {
        chiefData.append(`links[]`, link._id);
        console.log(link);
        newLinks.push(link);
      }
    }
    if (chiefObject.links.length === 1) {
      chiefData.append(`links`, ``);
    }
    axios.put(`data`, chiefData, options).then(() => {
      console.log(newObject);
      this.props.addObject(newObject);
      this.props.setCostLight(chiefObject._id, `links`, newLinks);
      this.props.removeCallback();
    }).catch((error) => {
      console.log(error.response);
    });
  }
  __connectCloseCallback(event, value) {
    this.setState({popup: false});
    if (value === `New group`) {
      this.__connectNewGroup();
    }
    if (value && value !== `New group`) {
      this.__connectOldGroup(value);
    }
  }
  __connectClickHandler() {
    this.setState({popup: true});
  }
  __addToggleCrown() {
    if (this.props.data.chief === `true`) {
      return <React.Fragment>
        <button className={`buttons__crown button button--disabled`}>
          <p className={`buttons__crown--paint`}></p>
        </button>
      </React.Fragment>;
    } else {
      return <React.Fragment>
        <button className={`buttons__crown button`}
          onClick={this.__crownClickHandler}>
          <p className={`buttons__crown--paint`}></p>
        </button>
      </React.Fragment>;
    }
  }
  __addToggleButtons() {
    if (this.props.data.chief === `true` && this.props.data.links.length !== 0) {
      return <React.Fragment>
        <button className={`buttons__transfer button button--disabled`}>
          <p className={`buttons__transfer--paint`}></p>
        </button>
        <button className={`buttons__remove button  button--disabled`}>
          <p className={`buttons__remove--paint`}></p>
        </button>
      </React.Fragment>;
    } else {
      return <React.Fragment>
        <button className={`buttons__transfer button`}
          onClick={this.__connectClickHandler}>
          <p className={`buttons__transfer--paint`}></p>
        </button>
        <button className={`buttons__remove button`}
          onClick={this.__removeClickHandler}>
          <p className={`buttons__remove--paint`}></p>
        </button>
      </React.Fragment>;
    }
  }
  __removeClickHandler() {
    const {_id} = this.props.data;
    const data = new FormData();
    data.append(`id`, _id);
    data.append(`served`, `false`);
    data.append(`chief`, `true`);
    axios.put(`data`, data, options).then(() => {
      this.props.setCostLight(_id, `served`, `false`);
      this.props.setCostLight(_id, `chief`, `true`);
    }).catch((error) => {
      console.log(error.response);
    });
    if (!this.props.parentData) {
      return;
    }
    const parentData = new FormData();
    const newLinks = [];
    for (let value of this.props.parentData.links) {
      if (value._id !== _id) {
        newLinks.push(value);
        parentData.append(`links[]`, value._id);
      }
    }
    if (newLinks.length === 0) {
      parentData.append(`links`, ``);
    }
    parentData.append(`id`, this.props.parentData._id);
    axios.put(`data`, parentData, options).then(() => {
      this.props.addObject(this.props.data);
      this.props.setCostLight(this.props.parentData._id, `links`, newLinks);
      this.props.removeCallback();
    }).catch((error) => {
      console.log(error.response);
    });
  }
  __addContactClickHandler(event) {
    const data = new FormData();
    const id = this.props.data._id;
    const fieldName = `contacts[]`;
    const nameState = `contacts`;
    let valueState = this.props.data.contacts.concat();
    valueState.push({name: ``, position: ``, tel: ``});
    data.append(`id`, id);
    for (let i = 0; i < this.props.data.contacts.length; i++) {
      let value = this.props.data.contacts[i];
      value = JSON.stringify(value);
      data.append(fieldName, value);
    }
    let emptyObject = {name: ``, position: ``, tel: ``};
    emptyObject = JSON.stringify(emptyObject);
    data.append(fieldName, emptyObject);
    axios.put(`data`, data, options).then(() => {
      this.props.setCostLight(id, nameState, valueState);
      this.__updateComponent(`success`);
    }).catch((error) => {
      console.log(error.response);
      this.__updateComponent(error.response);
    });
  }
  __updateComponent(errorMsg) {
    if (errorMsg === `success`) {
      this.setState({errorMsg: ``});
      this.forceUpdate();
    } else {
      this.setState({errorMsg: errorMsg.data[0].msg});
    }
  }
  __closeSectionHandler() {
    this.setState({activeRedactField: false, errorMsg: ``});
    this.props.closeHandler();
  }
  __contextMenu(color, target) {
    if (this.state.lights && target.current.contains(this.state.lights)) {
      return <React.Fragment>
        <p className={`dependence__cost-image ${`cost__` + color}`}></p>
        <div className={`context-menu__wrapper`}
          onContextMenu={this.__openContextMenuHandler}
          onMouseLeave={this.__closeContextMenuHandler}>
          <ul className={`context-menu`}>
            <li className={`context-menu__item context-menu__none`}
              onClick={this.__contextMenuClickHandler}>none</li>
            <li className={`context-menu__item context-menu__green`}
              onClick={this.__contextMenuClickHandler}>green</li>
            <li className={`context-menu__item context-menu__yellow`}
              onClick={this.__contextMenuClickHandler}>yellow</li>
            <li className={`context-menu__item context-menu__red`}
              onClick={this.__contextMenuClickHandler}>red</li>
          </ul>
        </div>
      </React.Fragment>;
    } else {
      return <React.Fragment>
        <p className={`dependence__cost-image ${`cost__` + color}`}></p>
        <div className={`context-menu__wrapper`}
          onContextMenu={this.__openContextMenuHandler}>
        </div>
      </React.Fragment>;
    }
  }
  __contextMenuClickHandler(event) {
    const data = new FormData();
    const id = this.props.data._id;
    const light = event.target.textContent;
    data.append(`id`, id);
    let fieldName = null;
    if (this.costLights.current.contains(event.target)) {
      data.append(`payment`, light);
      fieldName = `payment`;
    }
    if (this.dateLights.current.contains(event.target)) {
      data.append(`dateColor`, light);
      fieldName = `dateColor`;
    }
    axios.put(`data`, data, options).then(() => {
      this.props.setCostLight(id, fieldName, light);
      this.forceUpdate();
    }).catch((error) => console.log(error));
    this.__closeContextMenuHandler();
  }
  __closeContextMenuHandler() {
    this.setState({lights: false});
  }
  __openContextMenuHandler(event) {
    event.preventDefault();
    this.setState({lights: event.target});
  }
  __addContactsPopUp() {
    if (this.props.data.contacts.length > 0) {
      return <React.Fragment>
        <p className={`dependence__contacts-image`}></p>
        <div className={`dependence__contacts-container`}>
          <table className={`item__value open-item__table`}>
            <tbody>
              <tr className={`table__title`}>
                <th className={`contacts-table__name`}>Имя</th>
                <th className={`contacts-table__position`}>Должность</th>
                <th className={`contacts-table__tel`}>Телефон</th>
              </tr>
              {this.props.data.contacts.map((contact, i) => {
                return <tr className={`table__stroke`}
                  key={`contact-` + i}>
                  <td className={`contacts-table__item contacts-table__name`}>{contact.name}</td>
                  <td className={`contacts-table__item contacts-table__position`}>{contact.position}</td>
                  <td className={`contacts-table__item contacts-table__tel`}>{contact.tel}</td>
                </tr>;
              })}
            </tbody>
          </table>
        </div>
      </React.Fragment>;
    } else {
      return null;
    }
  }
  __addCommentsPopUp() {
    if (this.props.data.comments.length > 0) {
      return <React.Fragment>
        <p className={`dependence__comments-image`}></p>
        <div className={`dependence__comments-container`}>
          <ul className={`comments__list`}>
            {this.props.data.comments.map((comment, i) => {
              return <li className={`comments__item--popup`}
                key={`comment-` + i}>{comment}</li>;
            })}
          </ul>
        </div>
      </React.Fragment>;
    } else {
      return null;
    }
  }
  __addCommentClickHandler(event) {
    const data = new FormData();
    const id = this.props.data._id;
    const fieldName = `comments[]`;
    const nameState = `comments`;
    let valueState = this.props.data.comments.concat();
    valueState.push(``);
    data.append(`id`, id);
    for (let i = 0; i < this.props.data.comments.length; i++) {
      const value = this.props.data.comments[i];
      data.append(fieldName, value);
    }
    data.append(fieldName, ``);
    axios.put(`data`, data, options).then(() => {
      this.props.setCostLight(id, nameState, valueState);
    }).catch((error) => {
      console.log(error.response);
    });
  }
  render() {
    let {_id, inn, name, date, rtp, tenzor, tax, contacts, licenses, comments, chief, payment, dateColor} = this.props.data;
    const {clickHandler, doubleClickHandler, activeElement, openElement, closeHandler, number} = this.props;
    let chiefValue = `нет`;
    if (chief === `true`) {
      chiefValue = `да`;
    }
    let license = ``;
    let licensePrice = 0;
    for (let val of this.props.data.licenses) {
      license = license + val.reduction + `, `;
      licensePrice = licensePrice + parseInt(val.sum);
    }
    license = license.slice(0, -2);
    const income = licensePrice - licensePrice * rtp / 100 - licensePrice * tenzor / 100 - licensePrice * tax / 100;
    // this.props.setIncome(income);
    let status = `close`;
    if (openElement === this.containerClose.current || openElement === this.containerOpen.current) {
      status = `open`;
    }
    if (activeElement === this.containerClose.current) {
      this.containerClose.current.classList.add(`dependence__list--active`);
    } else if (this.containerClose.current) {
      this.containerClose.current.classList.remove(`dependence__list--active`);
    }
    switch (status) {
      case `close`: return <React.Fragment>
        <section className={`dependence__list`}
          onClick={clickHandler}
          onDoubleClick={doubleClickHandler}
          ref={this.containerClose}>
          <li className={`dependence__item item__number`}>
            {number}
            {this.__addContactsPopUp()}
            {this.__addCommentsPopUp()}
          </li>
          <li className={`dependence__item item__inn`}>{inn}</li>
          <li className={`dependence__item item__name`}>{name}</li>
          <li className={`dependence__item item__date`}
            ref={this.dateLights}>
            {date}
            {this.__contextMenu(dateColor, this.dateLights)}
          </li>
          <li className={`dependence__item item__license`}>{license}</li>
          <li className={`dependence__item item__cost`}
            ref={this.costLights}>
            {licensePrice}
            {this.__contextMenu(payment, this.costLights)}
          </li>
          <li className={`dependence__item item__rtp`}>{licensePrice * parseInt(rtp) / 100}</li>
          <li className={`dependence__item item__tenzor`}>{licensePrice * parseInt(tenzor) / 100}</li>
          <li className={`dependence__item item__tax`}>{licensePrice * parseInt(tax) / 100}</li>
          <li className={`dependence__item item__income`}>{income}</li>
        </section>
      </React.Fragment>;
      case `open`: return <React.Fragment>
        <section className={`dependence__list--open`}
          ref={this.containerOpen}>
          <TransferPopup
            activate = {this.state.popup}
            name = {`Выберите группу`}
            button = {`Перенести`}
            callback = {this.__connectCloseCallback}/>
          <p className={`error-msg`}>
            {this.state.errorMsg}
          </p>
          <ul className={`item__wrapper`}>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>ИНН:</p>
              <RedactInput
                value = {inn}
                id = {_id}
                name = {`inn`}
                callback = {this.__updateComponent}/>
            </li>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>Имя:</p>
              <RedactInput
                value = {name}
                id = {_id}
                name = {`name`}
                callback = {this.__updateComponent}/>
            </li>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>Контакты:</p>
              <div className={`contacts-table__wrapper`}>
                <table className={`item__value open-item__table`}>
                  <tbody>
                    <tr className={`table__title`}>
                      <th className={`contacts-table__name`}>Имя</th>
                      <th className={`contacts-table__position`}>Должность</th>
                      <th className={`contacts-table__tel`}>Телефон</th>
                      <th className={`button__add contacts__add-button`}
                        onClick = {this.__addContactClickHandler}>
                      </th>
                    </tr>
                    {contacts.map((contact, i) => {
                      return <tr className={`table__stroke`}
                        key={`contact-` + i}>
                        <RedactInputContacts
                          id = {_id}
                          name ={`contacts`}
                          i = {i}
                          contacts = {contacts}
                          contact = {contact}
                          callback = {this.__updateComponent}/>
                      </tr>;
                    })}
                  </tbody>
                </table>
              </div>
            </li>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>РТП:</p>
              <RedactInput
                object = {this.props.data}
                value = {rtp}
                id = {_id}
                simbol = {`%`}
                name = {`rtp`}
                callback = {this.__updateComponent}/>
            </li>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>Тензор:</p>
              <RedactInput
                object = {this.props.data}
                value = {tenzor}
                id = {_id}
                simbol = {`%`}
                name = {`tenzor`}
                callback = {this.__updateComponent}/>
            </li>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>Налог:</p>
              <RedactInput
                object = {this.props.data}
                value = {tax}
                id = {_id}
                simbol = {`%`}
                name = {`tax`}
                callback = {this.__updateComponent}/>
            </li>
          </ul>
          <ul className={`item__wrapper`}>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>Дата:</p>
              <RedactInput
                value = {date}
                id = {_id}
                name = {`date`}
                callback = {this.__updateComponent}/>
            </li>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>Гл. группы:</p>
              <p className={`item__value`}>{chiefValue}</p>
            </li>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>Лицензии:</p>
              <LicensesTable
                object = {this.props.data}
                id = {_id}
                clientLicenses = {licenses}
                callback = {this.__updateComponent}/>
            </li>
            <li className={`dependence__item--open`}>
              <p className={`item__title`}>Комментарии:</p>
              <div className={`comments-wrapper`}>
                <ul className={`comments__list`}
                  ref={this.commentsList}>
                  {comments.map((comment, i) => {
                    return <RedactInputComments
                      i = {i}
                      key = {`comment` + i}
                      commentsList = {this.commentsList}
                      comments = {comments}
                      comment={comment}
                      id={_id}
                      name={`comments`}
                      callback={this.__updateComponent}/>;
                  })}
                </ul>
                <div className={`button__add button__add-comment`}
                  onClick={this.__addCommentClickHandler}>
                </div>
              </div>
            </li>
          </ul>
          <div className="buttons__wrapper">
            <button className={`buttons__close button`}
              onClick={this.__closeSectionHandler}
              ref={this.closeButton}>
              <p className={`buttons__close--paint`}></p>
            </button>
            {this.__addToggleCrown()}
            {this.__addToggleButtons()}
          </div>
        </section>
      </React.Fragment>;
      default: return null;
    }
  }
}
export default connect(
    (mapStateToProps) => ({stateData: mapStateToProps.data.serverData}),
    (mapDispatchToProps) => ({
      setCostLight: (id, name, value) => {
        mapDispatchToProps({type: `SET_COST_LIGHT`, payload: {id, name, value}});
      },
      addObject: (client) => {
        mapDispatchToProps({type: `ADD_OBJECT`, payload: client});
      },
      removeObject: (client) => {
        mapDispatchToProps({type: `REMOVE_OBJECT`, payload: client});
      }
    })
)(Client);