import React, { useEffect } from "react";
import { Form, Button, Select } from "antd";
import { connect } from "react-redux";
import { getAllCourseList } from "../../redux";

import "./index.less";

const { Option } = Select;

function Search({ allCourseList, getAllCourseList }) {
  const [form] = Form.useForm();

  const resetForm = () => {
    // form.resetFields();
    form.resetFields(["title"]);
  };

  const onFinish = (values) => {
    console.log(values);
  };

  useEffect(() => {
    getAllCourseList();
  }, [getAllCourseList]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="inline"
      className="chapter-search"
    >
      <Form.Item
        name="title"
        label="选择课程"
        rules={[{ required: true, message: "请选择课程！" }]}
      >
        <Select
          placeholder="请选择课程"
          allowClear
          className="chapter-search-select"
        >
          {allCourseList.map((course) => {
            return (
              <Option key={course._id} value={course._id}>
                {course.title}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          查询课程章节
        </Button>
        <Button className="subject-btn" onClick={resetForm}>
          重置
        </Button>
      </Form.Item>
    </Form>
  );
}

export default connect(
  (state) => ({
    allCourseList: state.chapter.allCourseList,
  }),
  { getAllCourseList }
)(Search);
