import * as React from "react";
import "./selector-menu.css";
import {connect} from "react-redux";
import * as axios from "axios";
import {options} from "../../redux/api";
import TransferPopup from "../atom/transfer-popup/transfer-popup";
import license from "../license/license";

class SelectorMenu extends React.Component {
  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
    this.searchCheckbox = React.createRef();
    this.licensesFilterCheckbox = React.createRef();
    this.monthFilterCheckbox = React.createRef();
    this.licensesSelectValue = React.createRef();
    this.monthsSelectValue = React.createRef();
    this.state = {
      openLicensesPopup: false,
      openMonthsPopup: false,
      licensesFilterValue: ``,
      monthFilterValue: ``,
      searchValue: ``,
      licensesFilterCheckbox: false,
      monthFilterCheckbox: false,
      searchCheckbox: false
    };
    this.__getAddItemButton = this.__getAddItemButton.bind(this);
    this.__addLicenseHandler = this.__addLicenseHandler.bind(this);
    this.__closeSectionHandler = this.__closeSectionHandler.bind(this);
    this.__searchCheckboxHandler = this.__searchCheckboxHandler.bind(this);
    this.__searchChangeHandler = this.__searchChangeHandler.bind(this);
    this.__searchRemoveHandler = this.__searchRemoveHandler.bind(this);
    this.__licensesOpenHandler = this.__licensesOpenHandler.bind(this);
    this.__licensesCloseCallback = this.__licensesCloseCallback.bind(this);
    this.__monthsOpenHandler = this.__monthsOpenHandler.bind(this);
    this.__monthsCloseCallback = this.__monthsCloseCallback.bind(this);
    this.__licensesFilterCheckboxHandler = this.__licensesFilterCheckboxHandler.bind(this);
    this.__monthFilterCheckboxHandler = this.__monthFilterCheckboxHandler.bind(this);
    this.__licensesFilterClearHandler = this.__licensesFilterClearHandler.bind(this);
    this.__monthFilterClearHandler = this.__monthFilterClearHandler.bind(this);
    this.__request = this.__request.bind(this);
  }
  __request() {
    const requestArray = [];
    if (this.state.searchCheckbox && this.state.searchValue) {
      requestArray.push({name: `search`, value: this.state.searchValue});
    }
    if (this.state.licensesFilterCheckbox && this.state.licensesFilterValue) {
      requestArray.push({name: `licenses`, value: this.state.licensesFilterValue});
    }
    if (this.state.monthFilterCheckbox && this.state.monthFilterValue) {
      requestArray.push({name: `months`, value: this.state.monthFilterValue});
    }
    this.props.search(requestArray);
  }
  __licensesFilterClearHandler() {
    if (this.state.licensesFilterCheckbox === true) {
      this.licensesFilterCheckbox.current.click();
    }
    this.setState({licensesFilterValue: ``});
    this.licensesSelectValue.current.textContent = ``;
  }
  __monthFilterClearHandler() {
    if (this.state.monthFilterCheckbox === true) {
      this.monthFilterCheckbox.current.click();
    }
    this.setState({monthFilterValue: ``});
    this.monthsSelectValue.current.textContent = ``;
  }
  __monthFilterCheckboxHandler() {
    if (this.state.monthFilterCheckbox === false) {
      this.setState({monthFilterCheckbox: true}, () => {
        this.__request();
      });
    } else {
      this.setState({monthFilterCheckbox: false}, () => {
        this.__request();
      });
    }
  }
  __licensesFilterCheckboxHandler() {
    if (this.state.licensesFilterCheckbox === false) {
      this.setState({licensesFilterCheckbox: true}, () => {
        this.__request();
      });
    } else {
      this.setState({licensesFilterCheckbox: false}, () => {
        this.__request();
      });
    }
  }
  __monthsCloseCallback(event, value) {
    if (value) {
      let textValue = ``;
      for (let i of value) {
        textValue = textValue + i + `, `;
      }
      textValue = textValue.substring(0, textValue.length - 2);
      this.monthsSelectValue.current.textContent = textValue;
      if (this.state.monthFilterCheckbox === false) {
        this.setState({monthFilterValue: value});
        this.monthFilterCheckbox.current.click();
      } else {
        this.setState({monthFilterValue: value}, () => {
          this.__request();
        });
      }
    } else {
      this.monthsSelectValue.current.textContent = null;
      this.setState({monthFilterValue: ``});
      if (this.state.monthFilterCheckbox === true) {
        this.monthFilterCheckbox.current.click();
      }
    }
    this.setState({openMonthsPopup: false});
  }
  __monthsOpenHandler() {
    this.setState({openMonthsPopup: true});
  }
  __licensesCloseCallback(event, value) {
    if (value) {
      let textValue = ``;
      for (let i of value) {
        for (let j of this.props.licenses) {
          if (j._id === i) {
            textValue = textValue + j.reduction + `, `;
          }
        }
      }
      textValue = textValue.substring(0, textValue.length - 2);
      this.licensesSelectValue.current.textContent = textValue;
      if (this.state.licensesFilterCheckbox === false) {
        this.setState({licensesFilterValue: value});
        this.licensesFilterCheckbox.current.click();
      } else {
        this.setState({licensesFilterValue: value}, () => {
          this.__request();
        });
      }
    } else {
      this.licensesSelectValue.current.textContent = null;
      this.setState({licensesFilterValue: ``});
      if (this.state.licensesFilterCheckbox === true) {
        this.licensesFilterCheckbox.current.click();
      }
    }
    this.setState({openLicensesPopup: false});
  }
  __licensesOpenHandler() {
    this.setState({openLicensesPopup: true});
  }
  __searchRemoveHandler() {
    this.searchInput.current.value = ``;
    this.setState({searchValue: ``});
    if (this.state.searchCheckbox === true) {
      this.searchCheckbox.current.click();
    }
  }
  __searchCheckboxHandler() {
    if (this.searchInput.current.value.length < 5) {
      this.searchCheckbox.current.checked = false;
      this.setState({searchCheckbox: false}, () => {
        this.__request();
      });
      return;
    }
    if (this.state.searchCheckbox === true) {
      this.setState({searchCheckbox: false}, () => {
        this.__request();
      });
    } else {
      this.setState({searchCheckbox: true}, () => {
        this.__request();
      });
    }
  }
  __searchChangeHandler(event) {
    if (event.target.value.length > 4) {
      if (this.state.searchCheckbox === false) {
        this.setState({searchValue: event.target.value});
        this.searchCheckbox.current.click();
      } else {
        this.setState({searchValue: event.target.value}, () => {
          this.__request();
        });
      }
    } else {
      if (this.state.searchCheckbox === true) {
        this.searchCheckbox.current.click();
      }
    }
  }
  __closeSectionHandler() {
    axios.post(`data`, undefined, options).then((response) => {
      this.props.addClient(response.data);
    }).catch((error) => {
      console.log(error.response);
    });
  }
  __addLicenseHandler() {
    const data = new FormData();
    data.append(`name`, ``);
    data.append(`reduction`, ``);
    data.append(`sum`, ``);
    data.append(`description`, ``);
    axios.post(`licenses`, data, options).then((response) => {
      this.props.addLicense(response.data);
    }).catch((error) => {
      console.log(error.response);
    });
  }
  __getAddItemButton() {
    const {routing} = this.props;
    switch (routing) {
      case `connecting`:
        return <div className={`add-item-button__wrapper`}>
          <button className={`add-item-button button`}
            onClick={this.__closeSectionHandler}>
            <p className={`add-item-button--paint`}>
            </p>
          </button>
        </div>;
      case `licenses`:
        return <div className={`add-item-button__wrapper`}>
          <button className={`add-item-button button`}
            onClick={this.__addLicenseHandler}>
            <p className={`add-item-button--paint`}>
            </p>
          </button>
        </div>;
      default: return null;
    }
  }
  render() {
    return <React.Fragment>
      <div className={`selector-menu__wrapper`}>
        <div className={`filter-licenses__wrapper`}>
          <TransferPopup
            activate = {this.state.openLicensesPopup}
            type = {`licenses`}
            name = {`Выберите лицензии`}
            button = {`Применить`}
            callback = {this.__licensesCloseCallback}/>
          <input className={`filter-licenses__select select`}
            onClick={this.__licensesFilterCheckboxHandler}
            ref={this.licensesFilterCheckbox}
            type={`checkbox`}/>
          <button className={`button selector-button`}
            onClick={this.__licensesOpenHandler}>Лицензии</button>
          <p className={`button__remove button__remove--select`}
            onClick={this.__licensesFilterClearHandler}>
          </p>
          <p className={`filter-licenses__select-value`}
            ref={this.licensesSelectValue}>
          </p>
        </div>
        <div className={`filter-months__wrapper`}>
          <TransferPopup
            activate = {this.state.openMonthsPopup}
            type = {`months`}
            name = {`Выберите месяца`}
            button = {`Применить`}
            callback = {this.__monthsCloseCallback}/>
          <input className={`filter-months__select select`}
            onClick={this.__monthFilterCheckboxHandler}
            ref={this.monthFilterCheckbox}
            type={`checkbox`}/>
          <button className={`button selector-button`}
            onClick={this.__monthsOpenHandler}>Месяцы</button>
          <p className={`button__remove button__remove--select`}
            onClick={this.__monthFilterClearHandler}>
          </p>
          <p className={`filter-months__select-value`}
            ref={this.monthsSelectValue}>
          </p>
        </div>
        <div className={`search__wrapper`}>
          <input className={`search-select select`}
            ref={this.searchCheckbox}
            type={`checkbox`}
            onClick={this.__searchCheckboxHandler}/>
          <input className={`search__input`}
            ref={this.searchInput}
            placeholder={`Поиск`}
            onChange={this.__searchChangeHandler}/>
          <p className={`button__remove button__remove--search`}
            onClick={this.__searchRemoveHandler}>
          </p>
        </div>
        <div className={`income`}>
          <p className={`income__title`}>Всего: </p>
          <p className={`income__number`}>{` ` + this.props.data.income}</p>
        </div>
        {this.__getAddItemButton()}
      </div>
    </React.Fragment>;
  }
}
export default connect(
    (mapStateToProps) => ({routing: mapStateToProps.user.routing, data: mapStateToProps.data, licenses: mapStateToProps.licenses.licenses}),
    (mapDispatchToProps) => ({
      addClient: (id) => {
        mapDispatchToProps({type: `ADD_CLIENT`, payload: id});
      },
      addLicense: (id) => {
        mapDispatchToProps({type: `ADD_LICENSE`, payload: id});
      },
      search: (value) => {
        mapDispatchToProps({type: `SEARCH`, payload: value});
      },
      filter: (data) => {
        mapDispatchToProps({type: `FILTER`, payload: data});
      }
    })
)(SelectorMenu);
