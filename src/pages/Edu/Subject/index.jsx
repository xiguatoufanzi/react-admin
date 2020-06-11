import React, { Component } from "react";
import { Button, Table, Tooltip, Input, message, Modal } from "antd";
import {
  PlusOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";

import { getSubjectList, getSubSubjectList, updateSubject } from "./redux";
import { reqDelSubject } from "@api/edu/subject";
import "./index.less";

@connect(
  (state) => ({
    subjectList: state.subjectList,
  }),
  { getSubjectList, getSubSubjectList, updateSubject }
)
class Subject extends Component {
  state = {
    expandedRowKeys: [],
    subjectId: "", // 要更新商品分类id
    subjectTitle: "", // 要更新商品分类标题
    updateSubjectTitle: "", // 正在更新分类的标题
    current: 1, // 当前页数
    pageSize: 10, // 每页条数
  };

  componentDidMount() {
    this.getSubjectList(1, 10);
  }

  // 点击展开一级菜单
  handleExpandedRowsChange = (expandedRowKeys) => {
    const length = expandedRowKeys.length;
    if (length > this.state.expandedRowKeys.length) {
      const lastKey = expandedRowKeys[length - 1];
      this.props.getSubSubjectList(lastKey);
    }

    this.setState({
      expandedRowKeys,
    });
  };

  // 显示添加页面
  showAddSubject = () => {
    this.props.history.push("/edu/subject/add");
  };

  // 解决在第二页切换每页数量时显示数据不正确问题~
  getFirstPageSubjectList = (page, limit) => {
    this.getSubjectList(1, limit);
  };

  // 显示更新分类
  showUpdateSubject = (subject) => {
    return () => {
      this.setState({
        subjectId: subject._id,
        subjectTitle: subject.title,
      });
    };
  };

  // 收集更新分类标题数据
  handleInputChange = (e) => {
    this.setState({
      updateSubjectTitle: e.target.value,
    });
  };

  // 取消更新课程分类
  cancel = () => {
    this.setState({
      subjectId: "",
      updateSubjectTitle: "",
    });
  };

  // 更新课程分类
  updateSubject = async () => {
    const { subjectId, updateSubjectTitle, subjectTitle } = this.state;
    if (!updateSubjectTitle) {
      message.warn("请输入要更新课程分类标题~");
      return;
    }
    if (updateSubjectTitle === subjectTitle) {
      message.warn("输入更新课程分类标题不能与之前一样~");
      return;
    }

    await this.props.updateSubject(updateSubjectTitle, subjectId);
    message.success("更新分类数据成功");
    this.cancel();
  };

  // 删除课程分类
  delSubject = (subject) => {
    return () => {
      Modal.confirm({
        title: (
          <p>
            你确认要删除 <span className="subject-text">{subject.title}</span>{" "}
            课程分类吗?
          </p>
        ),
        icon: <ExclamationCircleOutlined />,

        okType: "danger",
        onOk: async () => {
          console.log("OK");
          await reqDelSubject(subject._id);
          message.success("删除课程分类数据成功");
          const { current, pageSize } = this.state;
          if (
            current > 1 &&
            this.props.subjectList.items.length === 1 &&
            subject.parentId === "0"
          ) {
            this.getSubjectList(current - 1, pageSize);
            return;
          }
          this.getSubjectList(current, pageSize);
        },
      });
    };
  };

  // 重写页面数据请求函数
  getSubjectList = (page, limit) => {
    this.setState({
      current: page,
      pageSize: limit,
    });
    return this.props.getSubjectList(page, limit);
  };

  render() {
    const { subjectList } = this.props;
    const { expandedRowKeys, current, pageSize } = this.state;

    const columns = [
      {
        title: "分类名称",
        dataIndex: "",
        key: "title",
        render: (subject) => {
          const { subjectId } = this.state;
          const id = subject._id;
          if (subjectId === id) {
            return (
              <Input
                onChange={this.handleInputChange}
                className="subject-input"
                defaultValue={subject.title}
              />
            );
          }

          return <span>{subject.title}</span>;
        },
      },
      {
        title: "操作",
        dataIndex: "",
        key: "action",
        width: 200,
        render: (subject) => {
          const { subjectId } = this.state;
          // 得到当前渲染的分类id
          const id = subject._id;
          if (subjectId === id) {
            return (
              <>
                <Button type="primary" onClick={this.updateSubject}>
                  确认
                </Button>
                <Button className="subject-btn" onClick={this.cancel}>
                  取消
                </Button>
              </>
            );
          }

          return (
            <>
              <Tooltip title="更新课程分类">
                <Button
                  type="primary"
                  onClick={this.showUpdateSubject(subject)}
                >
                  <FormOutlined />
                </Button>
              </Tooltip>

              <Tooltip title="删除课程分类">
                <Button
                  type="danger"
                  className="subject-btn"
                  onClick={this.delSubject(subject)}
                >
                  <DeleteOutlined />
                </Button>
              </Tooltip>
            </>
          );
        },
      },
    ];

    return (
      <div className="subject">
        <Button
          type="primary"
          className="subject-btn"
          onClick={this.showAddSubject}
        >
          <PlusOutlined />
          新建
        </Button>
        <Table
          columns={columns}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: this.handleExpandedRowsChange,
          }}
          dataSource={subjectList.items}
          rowKey="_id"
          pagination={{
            total: subjectList.total,
            showQuickJumper: true, // 是否显示快速跳转
            showSizeChanger: true, // 是否显示修改每页显示数量
            pageSizeOptions: ["5", "10", "15", "20"],
            defaultPageSize: 10,
            onChange: this.getSubjectList,
            onShowSizeChange: this.getFirstPageSubjectList,
            current,
            pageSize,
          }}
        />
      </div>
    );
  }
}

export default Subject;
