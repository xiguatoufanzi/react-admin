import React, { useState, useEffect } from "react";
import { Form, Input, Select, Cascader, Button, message } from "antd";
import { connect } from "react-redux";
import { FormattedMessage, useIntl } from "react-intl";

import { reqGetAllTeacherList } from "@api/edu/teacher";
import { reqGetAllSubjectList, reqGetSubSubjectList } from "@api/edu/subject";
import { getCourseList } from "../../redux";

import "./index.less";

const { Option } = Select;

function SearchForm({ getCourseList, getSearchFormData }) {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [teachers, subjects] = await Promise.all([
        reqGetAllTeacherList(),
        reqGetAllSubjectList(),
      ]);
      setTeachers(teachers);
      //处理subjects数据
      const data = subjects.map((subject) => ({
        value: subject._id,
        label: subject.title,
        isLeaf: false,
      }));
      setSubjects(data);
    };
    fetchData();
  }, []);

  // 点击一级菜单调用函数
  // 加载二级菜单数据
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // 加载二级菜单数据
    const { items } = await reqGetSubSubjectList(targetOption.value);
    targetOption.loading = false;
    if (items.length) {
      targetOption.children = items.map((item) => ({
        label: item.title,
        value: item._id,
      }));
    } else {
      targetOption.isLeaf = true;
    }

    setSubjects([...subjects]);
  };

  // 重置数据
  const resetForm = () => {
    form.resetFields();
  };

  // 提交表单
  const onFinish = async (values) => {
    const { title, teacherId, subject = [] } = values;
    let subjectId, subjectParentId;
    // 值只有一个，代表是一级分类
    if (subject.length === 1) {
      subjectParentId = "0";
      subjectId = subject[0];
    } else if (subject.length === 2) {
      // 值有两个，代表是二级分类
      subjectParentId = subject[0];
      subjectId = subject[1];
    }

    await getCourseList({
      title,
      teacherId,
      page: 1,
      limit: 10,
      subjectId,
      subjectParentId,
    });

    // 调用父组件方法 给父组件传递数据
    getSearchFormData({ title, teacherId, subjectId, subjectParentId });
    message.success("查询课程分类数据成功~");
  };

  return (
    <Form layout="inline" form={form} onFinish={onFinish}>
      <Form.Item
        name="title"
        label={intl.formatMessage({
          id: "title",
        })}
      >
        <Input
          placeholder={intl.formatMessage({
            id: "title",
          })}
          style={{ width: 250, marginRight: 20 }}
        />
      </Form.Item>
      <Form.Item name="teacherId" label={<FormattedMessage id="teacher" />}>
        <Select
          allowClear
          placeholder={<FormattedMessage id="teacher" />}
          style={{ width: 250, marginRight: 20 }}
        >
          {teachers.map((teacher) => {
            return (
              <Option value={teacher._id} key={teacher._id}>
                {teacher.name}
              </Option>
            );
          })}
        </Select>
      </Form.Item>
      <Form.Item name="subject" label={<FormattedMessage id="subject" />}>
        <Cascader
          style={{ width: 250, marginRight: 20 }}
          options={subjects}
          loadData={loadData}
          // onChange={onChange}
          changeOnSelect
          placeholder={intl.formatMessage({
            id: "subject",
          })}
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ margin: "0 10px 0 30px" }}
        >
          <FormattedMessage id="searchBtn" />
        </Button>
        <Button onClick={resetForm}>
          <FormattedMessage id="resetBtn" />
        </Button>
      </Form.Item>
    </Form>
  );
}

export default connect(null, { getCourseList })(SearchForm);
