import React, { Component } from "react";
import { Card, DatePicker, Button } from "antd";
import moment from "moment";

const { RangePicker } = DatePicker;

// Tab左侧
const tabList = [
  {
    key: "sales",
    tab: "销售量",
  },
  {
    key: "visits",
    tab: "访问量",
  },
];

// content
const contentList = {
  sales: <p>sales content</p>,
  visits: <p>visits content</p>,
};

// 定制日期格式化
const dateFormat = "YYYY-MM-DD";

export default class Sales extends Component {
  state = {
    tabKey: "sales",
    datePicker: "day",
    rangeTime: [moment(moment(), dateFormat), moment(moment(), dateFormat)],
  };

  // 自定义日期
  rangePickerChange = (dates, dateStrings) => {
    this.setState({
      rangeTime: dates,
    });
  };

  // 点击Tab触发的事件
  onTabChange = (tabKey) => {
    this.setState({ tabKey });
  };

  // 点击日期按钮
  changeDatePicker = (datePicker) => {
    return () => {
      const time = moment(moment(), dateFormat);
      let rangeTime = null;

      switch (datePicker) {
        case "year":
          rangeTime = [time, moment(moment().add(1, "y"), dateFormat)];
          break;
        case "mouth":
          rangeTime = [time, moment(moment().add(1, "M"), dateFormat)];
          break;
        case "week":
          rangeTime = [time, moment(moment().add(7, "d"), dateFormat)];
          break;
        default:
          rangeTime = [time, time];
          break;
      }

      this.setState({
        datePicker,
        rangeTime,
      });
    };
  };

  render() {
    const { tabKey, datePicker, rangeTime } = this.state;

    // Tab右侧
    const extra = (
      <div>
        <Button
          type={datePicker === "day" ? "link" : "text"}
          onClick={this.changeDatePicker("day")}
        >
          今日
        </Button>
        <Button
          type={datePicker === "week" ? "link" : "text"}
          onClick={this.changeDatePicker("week")}
        >
          本周
        </Button>
        <Button
          type={datePicker === "mouth" ? "link" : "text"}
          onClick={this.changeDatePicker("mouth")}
        >
          本月
        </Button>
        <Button
          type={datePicker === "year" ? "link" : "text"}
          onClick={this.changeDatePicker("year")}
        >
          本年
        </Button>
        <RangePicker value={rangeTime} onChange={this.rangePickerChange} />
      </div>
    );
    return (
      <Card
        style={{ width: "100%", marginBottom: 20 }}
        tabList={tabList}
        activeTabKey={tabKey}
        tabBarExtraContent={extra}
        onTabChange={this.onTabChange}
      >
        {contentList[tabKey]}
      </Card>
    );
  }
}
