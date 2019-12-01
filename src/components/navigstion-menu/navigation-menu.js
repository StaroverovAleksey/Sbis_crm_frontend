import * as React from "react";
import "./navigation-menu.css";

import Button from "../atom/button.js";
import {connect} from "react-redux";

class NavigationMenu extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.state = {main: false, connecting: false, disconnecting: false, history: false, licenses: false, settings: false};
  }
  resetState() {
    const obj = {};
    for (let key in this.state) {
      if (this.props.user.routing === key) {
        obj[key] = true;
      } else {
        obj[key] = false;
      }
    }
    return obj;
  }
  async clickHandler(event) {
    await this.props.changeRout(event.target.id);
    this.setState(this.resetState());
  }
  render() {
    return <React.Fragment>
      <nav className={`main-navigation`}>
        <div className={`main-navigation__button-wrapper`}>
          <Button
            clickHandler = {this.clickHandler}
            name={`Основная`}
            id={`main`}
            active={this.state.main}/>
        </div>
        <div className={`main-navigation__button-wrapper`}>
          <Button
            clickHandler = {this.clickHandler}
            name={`Подключения`}
            id={`connecting`}
            active={this.state.connecting}/>
        </div>
        <div className={`main-navigation__button-wrapper`}>
          <Button
            clickHandler = {this.clickHandler}
            name={`Отключенные`}
            id={`disconnecting`}
            active={this.state.disconnecting}/>
        </div>
        <div className={`main-navigation__button-wrapper`}>
          <Button
            //clickHandler = {this.clickHandler}
            name={`История`}
            id={`history`}
            active={this.state.history}
            disabled = {true}/>
        </div>
        <div className={`main-navigation__button-wrapper`}>
          <Button
            //clickHandler = {this.clickHandler}
            name={`TO DO`}
            id={`todo`}
            active={this.state.settings}
            disabled = {true}/>
        </div>
        <div className={`main-navigation__button-wrapper`}>
          <Button
            clickHandler = {this.clickHandler}
            name={`Лицензии`}
            id={`licenses`}
            active={this.state.licenses}/>
        </div>
        <div className={`main-navigation__button-wrapper, main-navigation__user-settings`}>
          <Button
            //clickHandler = {this.clickHandler}
            name={`User`}
            id={`settings`}
            active={this.state.settings}
            disabled = {true}/>
        </div>
      </nav>
    </React.Fragment>;
  }
  componentDidMount() {
    this.setState(this.resetState());
  }
}

export default connect(
    (mapStateToProps) => ({user: mapStateToProps.user}),
    (mapDispatchToProps) => ({
      changeRout: (section) => {
        mapDispatchToProps({type: `CHANGE_ROUT`, payload: section});
      }
    })
)(NavigationMenu);
