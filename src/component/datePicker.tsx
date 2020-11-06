import React, { useState, useEffect } from "react";
import "./index.less";
const moment = require("moment");
type valueChange = () => string;
interface iDateValue { }
interface iDatePickerProps {
  name: string;
  onChange: (value?: any) => void;
  onClose: () => void;
  className?: string;
  value?: string;
  disabled?: boolean;
  disableRange?: string[];
  optionalRange?: string[];
  placeholder?: string;
  type?: string;
}
interface iDay {
  date?: string;
}
const weekList = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
const dayList: iDay[] = new Array(42).fill({}).map((item) => {
  return {};
});
export const DatePicker: React.FC<iDatePickerProps> = (props) => {
  const {
    onChange,
    onClose,
    value = new Date(),
    disabled,
    disableRange,
    optionalRange,
  } = props;
  const [current, setcurrent] = useState(value);
  const [year, setyear] = useState(null);
  const [month, setmonth] = useState(null);
  useEffect(() => {
    document.addEventListener('click', clickOther);
    return () => document.removeEventListener('click', clickOther)
  })
  const clickOther = (event: any) => {
    onClose();
  }
  const yearSelect = () => {
    setyear(moment(current))
  }
  const monthSelect = () => {
    setmonth(moment(current))
  }
  const selectItem = (thisDate: any, type?: string) => {
    if (year) {
      setyear(null)
      setmonth(moment(current))
    } else {
      setmonth(null)
    }
    setcurrent(thisDate)
  }

  return (
    <div className="panel" role='dialog' onClick={e => e.stopPropagation()}>
      <div className="picker-header">
        {!month && <a aria-lable="click to last year" href="javascript:"
          onClick={(r) => setcurrent(moment(current).subtract(year ? 12 : 1, "years"))}
          className="iconfont iconleft"
        ></a>}
        {!year && !month && <a href="javascript:"
          aria-lable="click to last month"
          onClick={(r) => setcurrent(moment(current).subtract(1, "months"))}
          className="iconfont"
        >
          &#xe628;
        </a>}
        {!year && !month && <span className="dateTitle">
          <a aria-lable="click to select years" onClick={yearSelect} href="javascript:">{moment(current).format("YYYY")}年</a>
          <a aria-lable="click to select months" onClick={monthSelect} href="javascript:">{moment(current).format("MM")}月</a>
          <span>{moment(current).format("DD")}日</span>
        </span>}
        {(year || month) && <span className="dateTitle">
          {!month && <span aria-lable="select years ">{moment(current).subtract(12, "years").format("YYYY")}年~{moment(current).format("YYYY")}年</span>}
          {!year && <span aria-lable="select months">1月~12月</span>}

        </span>}
        {!year && !month && <a href="javascript:"
          aria-lable="click to next month"
          onClick={(r) => setcurrent(moment(current).add(1, "months"))}
          className="iconfont"
        >
          &#xe63a;
        </a>}
        {!month && <a href="javascript:"
          aria-lable="click to next year"
          onClick={(r) => setcurrent(moment(current).add(year ? 12 : 1, "years"))}
          className="iconfont"
        >
          &#xe62b;
        </a>}
      </div>
      <div className="picker-content">
        <ul>
          {!year && !month && weekList.map((item) => (
            <li>{item}</li>
          ))}
        </ul>
        <ul>
          {(year || month) &&
            new Array(12).fill({}).map((item, index) => {
              const thisDate = year ? moment(current).add(index - 12, "years") :
                moment(moment(current).startOf("year")).add(index - 12, "months");;
              const active =
                thisDate.diff(moment(current), year ? "years" : 'months') === 0 && "active";
              let isDisabled = false;
              if (optionalRange) {
                isDisabled =
                  (optionalRange[0] !== undefined && thisDate - moment(optionalRange[0]) < 0) ||
                  (optionalRange[1] !== undefined && moment(optionalRange[1]) - thisDate < 0);
              }
              return (
                <li
                  role="button"
                  className={`yearormounth ${active} ${isDisabled && 'day-disabled'}`}
                >
                  <button disabled={isDisabled} aria-lable={thisDate.format(year ? "YYYY" : "MM")} onClick={(r) => !isDisabled && selectItem(thisDate)}
                  >{year ? thisDate.format("YYYY") : thisDate.format("MM")}</button>
                </li>
              );
            })
          }
          {!year && !month && dayList.map((item, index) => {
            const startDay = moment(current).startOf("month");
            const thisWeek = startDay.format("E");
            const thisDate = moment(startDay).add(index - thisWeek, "days");
            const active =
              thisDate.diff(moment(current), "days") === 0 && "active";
            let isDisabled = false;
            if (optionalRange) {
              isDisabled =
                (optionalRange[0] !== undefined && thisDate - moment(optionalRange[0]) < 0) ||
                (optionalRange[1] !== undefined && moment(optionalRange[1]) - thisDate < 0);
            }
            return (
              <li
                key={index}
                role="button"
                className={`${active} ${isDisabled && 'day-disabled'}`}

              >
                <a aria-lable={thisDate.format("YYYY-MM-DD")} onClick={(r) => !isDisabled && onChange(thisDate.format("YYYY-MM-DD"))}
                  href="javascript:">{thisDate.format("DD")}</a>
              </li>
            );
          })}
        </ul>
      </div>
      <div  style={{padding:10,textAlign:"center"}}><button onClick={onClose} tabIndex={2} role="close" aria-label="close panel">close</button></div>
    </div>
  );
};
const DatePickerInput: React.FC<iDatePickerProps> = (props) => {
  const {
    type = "text",
    placeholder = "请选择时间",
    value = moment().format("YYYY-MM-DD"),
    onChange,
    onClose,
    disabled = false,
    ...otherProps
  } = props;
  const [showPanel, setPanel] = useState(false);
  const [values, setValue] = useState(value);

  const onChanges = (event: any) => {
    debugger;
    console.log(event);
  };
  const dateChange = (date: any) => {
    setPanel(false);
    setValue(date);
  };
  return (
    <>
      <div className="picker-box">
        <input
        tabIndex={3}
          type={'button'}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChanges}
          value={values}
          onClick={(r) => setPanel(!showPanel)}
        />
        {showPanel && (
          <DatePicker
            value={values}
            onClose={() => setPanel(false)}
            onChange={(r) => dateChange(r)}
            {...otherProps}
          />
        )}
      </div>
    </>
  );
};
export default DatePickerInput;
