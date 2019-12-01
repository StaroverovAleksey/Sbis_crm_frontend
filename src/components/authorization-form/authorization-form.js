import * as React from "react";
import * as axios from "axios";
import {options} from "../../redux/api";
import {connect} from "react-redux";

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.submitForm = this.submitForm.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    this.state = {key: ``, name: ``, password: ``, reqStatus: ``, token: ``};
  }
  inputHandler(event) {
    if (event.target.id === `authFormName`) {
      this.setState({name: event.target.value});
    }
    if (event.target.id === `authFormPassword`) {
      this.setState({password: event.target.value});
    }
  }
  submitForm(event) {
    event.preventDefault();
    const data = new FormData();
    data.append(`name`, this.state.name);
    data.append(`password`, `${this.state.password}`);
    axios.post(`authorizations`, data, options).
    then((response) => {
      this.props.addToken(response.data);
    }).
    catch((error) => {
      this.activateInvalidField();
      if (error.response) {
        if (error.response.status === 400) {
          this.setState({reqStatus: `Логин или пароль неверны.`});
        } else {
          this.setState({reqStatus: `Внутренняя ошибка сервера.`});
        }
      } else {
        this.setState({reqStatus: `Ответ от сервера не получен.`});
      }
    });
  }
  activateInvalidField() {
    document.querySelector(`#authFormName`).classList.add(`text-input--invalid`);
    document.querySelector(`#authFormPassword`).classList.add(`text-input--invalid`);
  }
  render() {
    const {clickHandler} = this.props;
    return <React.Fragment>
      <form className={`lobby__form`} id={`RegForm`} encType={`multipart/form-data`}
        key={this.state.key}
        onSubmit={this.submitForm}>
        <p className={`form__status`}>{this.state.reqStatus}</p>
        <input className={`text-input form__input`} id={`authFormName`} type="text" value={this.state.name} placeholder={`Логин`}
          onChange={this.inputHandler}/>
        <input className={`text-input form__input`} id={`authFormPassword`} type="password" value={this.state.password} placeholder={`Пароль`}
          onChange={this.inputHandler}/>
        <input className={`button form__button`} type="submit"/>
      </form>
      <button className={`lobby__button`} onClick = {() => {
        clickHandler(`AuthForm`);
      }}>Регистрация</button>
    </React.Fragment>;
  }
}
export default connect(
    undefined,
    (mapDispatchToProps) => ({
      addToken: (token) => {
        mapDispatchToProps({type: `SET_TOKEN`, payload: token});
      }
    })
)(AuthForm);
