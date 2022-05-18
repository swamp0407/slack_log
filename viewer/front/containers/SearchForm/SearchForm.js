import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router";
import SlackActions from "../../actions/SlackActions";
import config from "../../config";
// import DatePicker, { registerLocale } from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import "./SearchForm.less";

// import ja from "date-fns/locale/ja";
// registerLocale("ja", ja);

// import DayPicker from "react-day-picker";
// import DayPickerInput from "react-day-picker/DayPickerInput";
// import "react-day-picker/lib/style.css";

import DayPickerInput from "react-day-picker/DayPickerInput";
import { DateUtils } from "react-day-picker";
import "react-day-picker/lib/style.css";

import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";

const SearchForm = (props) => {
  const dispatch = useDispatch();
  const [day, setDay] = useState(new Date());
  const updateSearchWord = (searchWord) => {
    dispatch(SlackActions.updateSearchWord(searchWord));
  };
  const updateTime = (time) => {
    dispatch(SlackActions.updateTime(time));
  };
  const getFormatDate = (date) => {
    return (
      date.getFullYear() +
      "年" +
      (date.getMonth() + 1) +
      "月" +
      date.getDate() +
      "日"
    );
  };
  const onSearch = (e) => {
    e.preventDefault();
    updateSearchWord(searchRef.current.value);
  };
  const searchRef = useRef(null);
  // const formatDate = (date) => {
  //   return new Date(date * 1000).toLocaleString();
  // };

  const onTimeChange = (e) => {
    e.preventDefault();
    const date = Date.parse(day);
    console.log(date);
    updateTime(date / 1000);
  };
  const searchWord = props.match ? props.match.params.searchWord : "";
  const handleDayClick = (day) => {
    setDay(day);
  };

  const parseDate = (str, format, locale) => {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    if (DateUtils.isDate(parsed)) {
      return parsed;
    }
    return undefined;
  };

  const formatDate = (date, format, locale) => {
    return dateFnsFormat(date, format, { locale });
  };
  const FORMAT = "yyyy年MM月dd日";

  return (
    <div className="search-form-wrapper">
      <form className="search-form" onSubmit={onSearch.bind(this)}>
        <input
          type="search"
          ref={searchRef}
          defaultValue={searchWord}
          placeholder="Search"
        />
      </form>
      {/* <DatePicker
        locale="ja"
        selected={day}
        endDate={new Date()}
        onChange={(date) => setDay(date)}
        customInput={<button>{getFormatDate(day)}</button>}
      /> */}
      <DayPickerInput
        onDayChange={handleDayClick}
        formatDate={formatDate}
        format={FORMAT}
        parseDate={parseDate}
        placeholder={`${dateFnsFormat(new Date(), FORMAT)}`}
      />
      {/* <DayPicker onDayClick={handleDayClick} /> */}
      <form onSubmit={onTimeChange.bind(this)}>
        <input type="submit" value="更新" />
      </form>
    </div>
  );
};

const SearchFormWithRouteParam = () => (
  <Switch>
    <Route
      path={config.subdir + "/search/:searchWord"}
      component={SearchForm}
    />
    <Route path={config.subdir + "/"} component={SearchForm} />
  </Switch>
);

export default SearchFormWithRouteParam;
