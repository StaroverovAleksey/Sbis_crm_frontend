import * as React from "react";
import * as axios from "axios";
import {options} from "../../redux/api.js";

class RegForm extends React.Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    this.comparePassword = this.comparePassword.bind(this);
    this.state = {key: ``, name: ``, password: ``, passwordTwo: ``, reqStatus: ``, invalidField: []};
  }
  inputHandler(event) {
    if (event.target.id === `regFormName`) {
      this.setState({name: event.target.value});
    }
    if (event.target.id === `regFormPassword`) {
      this.setState({password: event.target.value});
    }
    if (event.target.id === `regFormPasswordTwo`) {
      this.setState({passwordTwo: event.target.value});
    }
  }
  /* Сравнение паролей */
  comparePassword() {
    if (this.state.password !== this.state.passwordTwo) {
      this.setState({reqStatus: `Пароли не совпадают.`});
      this.setState({invalidField: [...this.state.invalidField, `password`, `passwordTwo`]});
      return false;
    } else {
      return true;
    }
  }
  /* Отправка запроса на сервер и обработка ответа */
  submitForm(event) {
    event.preventDefault();
    this.setState({invalidField: []});
    if (!this.comparePassword()) {
      this.setState({key: Math.random()});
      return;
    }
    const data = new FormData();
    data.append(`name`, this.state.name);
    data.append(`password`, `${this.state.password}`);
    axios.post(`users`, data, options).
      then(() => {
        this.setState({reqStatus: `Регистрация выполнена успешно.`, name: ``, password: ``, passwordTwo: ``, invalidField: [], key: Math.random()});
      }).
      catch((error) => {
        if (error.response) {
          switch (error.response.status) {
            case 400: this.setState({reqStatus: `Имя занято.`});
              this.setState({invalidField: [...this.state.invalidField, `name`]});
              break;
            case 401:
              this.setState({reqStatus: `Допустимая длина от 5 до 20 символов.`});
              for (let value of error.response.data) {
                this.setState({invalidField: [...this.state.invalidField, value.param]});
                if (value.param === `password`) {
                  this.setState({invalidField: [...this.state.invalidField, `passwordTwo`]});
                }
              }
              break;
            default: this.setState({reqStatus: `Внутренняя ошибка сервера.`});
          }
        } else {
          this.setState({reqStatus: `Ответ от сервера не получен.`});
        }
        this.setState({key: Math.random()});
      });
  }
  /* Выделение невалидных полей */
  activateInvalidField() {
    const nameField = document.querySelector(`#regFormName`);
    const passwordField = document.querySelector(`#regFormPassword`);
    const passwordFieldTwo = document.querySelector(`#regFormPasswordTwo`);
    nameField.classList.remove(`text-input--invalid`);
    passwordField.classList.remove(`text-input--invalid`);
    passwordFieldTwo.classList.remove(`text-input--invalid`);
    for (let value of this.state.invalidField) {
      if (value === `name`) {
        nameField.classList.add(`text-input--invalid`);
      }
      if (value === `password`) {
        passwordField.classList.add(`text-input--invalid`);
      }
      if (value === `passwordTwo`) {
        passwordFieldTwo.classList.add(`text-input--invalid`);
      }
    }
  }
  render() {
    const {clickHandler} = this.props;
    return <React.Fragment>
      <form className={`lobby__form`} id={`RegForm`} encType={`multipart/form-data`}
        key={this.state.key}
        onSubmit={this.submitForm}>
        <p className={`form__status`}>{this.state.reqStatus}</p>
        <input className={`text-input form__input`} id={`regFormName`} type="text" name={`name`} value={this.state.name} placeholder={`Логин`}
          onChange={this.inputHandler}/>
        <input className={`text-input form__input`} id={`regFormPassword`} type="password" name={`password`} value={this.state.password} placeholder={`Пароль`}
          onChange={this.inputHandler}/>
        <input className={`text-input form__input`} id={`regFormPasswordTwo`} type="password" value={this.state.passwordTwo} placeholder={`Повторите пароль`}
          onChange={this.inputHandler}/>
        <input className={`button form__button`} type="submit"/>
      </form>
      <button className={`lobby__button`} onClick = {() => {
        clickHandler(`RegForm`);
      }}>Авторизация</button>
    </React.Fragment>;
  }
  componentDidUpdate() {
    this.activateInvalidField();
  }
}
export {RegForm};
