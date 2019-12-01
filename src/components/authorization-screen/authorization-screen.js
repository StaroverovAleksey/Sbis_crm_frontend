import * as React from "react";
import AuthForm from "../authorization-form/authorization-form.js";
import {RegForm} from "../registration-form/registration-form.js";
import "./authorization-screen.css";

class AuthScreen extends React.Component {
  constructor(props) {
    super(props);
    this.toggleForm = this.toggleForm.bind(this);
    this.state = {
      activeForm: `AuthForm`
    };
  }
  toggleForm(buttonId) {
    if (buttonId === `AuthForm`) {
      this.setState({activeForm: `RegForm`});
    } else {
      this.setState({activeForm: `AuthForm`});
    }
  }
  render() {
    const activeForm = this.state.activeForm;
    if (activeForm === `AuthForm`) {
      return <section className={`lobby`}>
        <h1 className={`lobby__title`}>Авторизация</h1>
        <AuthForm
          clickHandler = {this.toggleForm} />
      </section>;
    } else {
      return <section className={`lobby`}>
        <h1 className={`lobby__title`}>Регистрация</h1>
        <RegForm
          clickHandler = {this.toggleForm} />
      </section>;
    }
  }
}
export {AuthScreen};
