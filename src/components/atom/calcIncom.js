import * as React from "react";
import {connect} from "react-redux";

class CalcIncome extends React.Component {
  constructor(props) {
    super(props);
  }
  __calcIncome(object) {
    let licensesSum = 0;
    for (let license of object.licenses) {
      licensesSum = licensesSum + parseInt(license.sum);
    }
    const rtp = licensesSum * parseInt(object.rtp) / 100;
    const tenzor = licensesSum * parseInt(object.tenzor) / 100;
    const tax = licensesSum * parseInt(object.tax) / 100;
    return licensesSum - rtp - tenzor - tax;
  }
  __addIncome(prevProps) {
    let income = 0;
    if (!prevProps.data) {
      return;
    }
    for (let object of prevProps.data) {
      income = income + this.__calcIncome(object);
      for (let subject of object.links) {
        income = income + this.__calcIncome(subject);
      }
    }
    this.props.setIncome(income);
  }
  render() {
    return null;
  }
  componentDidMount() {
    this.__addIncome(this.props);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (JSON.stringify(this.props.data) !== JSON.stringify(prevProps.data)) {
      this.__addIncome(this.props);
    }
  }
}
export default connect(
    undefined,
    (mapDispatchToProps) => ({
      setIncome: (income) => {
        mapDispatchToProps({type: `SET_INCOME`, payload: income});
      }
    })
)(CalcIncome);
