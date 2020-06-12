import React, { Component } from "react";
import { Button, Tooltip, Alert, Table } from "antd";
import {
  PlusOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SettingOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { getLessonList } from "../../redux";

import "./index.less";

@connect(
  (state) => ({
    chapters: state.chapter.chapters,
  }),
  { getLessonList }
)
class List extends Component {
  state = {
    expandedRowKeys: [],
  };

  // 点击展开一级菜单
  handleExpandedRowsChange = (expandedRowKeys) => {
    const length = expandedRowKeys.length;
    if (length > this.state.expandedRowKeys.length) {
      const lastKey = expandedRowKeys[length - 1];
      this.props.getLessonList(lastKey);
    }

    this.setState({
      expandedRowKeys,
    });
  };

  render() {
    const { chapters } = this.props;
    const { expandedRowKeys } = this.state;

    const columns = [
      {
        title: "名称",
        dataIndex: "title",
        key: "title",
      },
      {
        title: "是否免费",
        dataIndex: "free",
        key: "free",
        render: (free) => {
          return free === undefined ? "" : free ? "是" : "否";
        },
      },
      {
        title: "操作",
        key: "action",
        width: 250,
        render: (data) => {
          return (
            <>
              {"free" in data ? null : (
                <Tooltip title="新增课时">
                  <Button
                    type="primary"
                    className="chapter-btn"
                    // onClick={this.showUpdateSubject(subject)}
                  >
                    <PlusOutlined />
                  </Button>
                </Tooltip>
              )}

              <Tooltip title="更新">
                <Button
                  type="primary"
                  // onClick={this.showUpdateSubject(subject)}
                >
                  <FormOutlined />
                </Button>
              </Tooltip>

              <Tooltip title="删除">
                <Button
                  type="danger"
                  className="subject-btn"
                  // onClick={this.delSubject(subject)}
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
      <div className="chapter-list">
        <div className="chapter-list-header">
          <h5>课程章节列表</h5>
          <div>
            <Button type="primary">
              <PlusOutlined />
              新增
            </Button>
            <Button type="danger">批量删除</Button>
            <Tooltip title="全屏">
              <FullscreenOutlined />
            </Tooltip>
            <Tooltip title="刷新">
              <ReloadOutlined />
            </Tooltip>
            <Tooltip title="设置">
              <SettingOutlined />
            </Tooltip>
          </div>
        </div>
        <Alert message="已选择 0 项" type="info" showIcon />

        <Table
          className="chapter-list-table"
          columns={columns}
          expandable={{
            expandedRowKeys,
            onExpandedRowsChange: this.handleExpandedRowsChange,
          }}
          dataSource={chapters.items} // 决定每一行显示的数据
          rowKey="_id"
          pagination={{
            total: chapters.total,
            showQuickJumper: true, // 是否显示快速跳转
            showSizeChanger: true, // 是否显示修改每页显示数量
            pageSizeOptions: ["5", "10", "15", "20"],
            defaultPageSize: 10,
            // onChange: this.getSubjectList,
            // onShowSizeChange: this.getFirstPageSubjectList,
            // current,
            // pageSize,
          }}
        />
      </div>
    );
  }
}

export default List;
