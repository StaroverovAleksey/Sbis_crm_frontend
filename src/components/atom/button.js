import * as React from "react";

import "./button.css";

function Button(props) {
  const {name} = props;
  const {id} = props;
  const {clickHandler} = props;
  const {size = 16} = props;
  const {active} = props;
  const {disabled = false} = props;
  let style = `button`;
  if (active) {
    style = style + ` button--active`;
  }
  if (disabled) {
    style = style + ` button--disabled`;
  }
  return <React.Fragment>
    <button
      id={id}
      className={style}
      style={{fontSize: size}}
      onClick={clickHandler}>{name}</button>
  </React.Fragment>;
}

export default Button;
