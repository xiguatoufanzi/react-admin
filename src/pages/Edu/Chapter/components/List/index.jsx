import React, { Component } from "react";
import { Button, Tooltip, Alert, Table, Modal, message } from "antd";
import {
  PlusOutlined,
  FullscreenOutlined,
  ReloadOutlined,
  SettingOutlined,
  FormOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Player from "griffith";
import screenfull from "screenfull";

import {
  getLessonList,
  batchRemoveLessonList,
  batchRemoveChapterList,
  getChapterList,
} from "../../redux";
import "./index.less";

@withRouter
@connect(
  (state) => ({
    chapters: state.chapter.chapters,
    courseId: state.chapter.courseId,
  }),
  {
    getLessonList,
    batchRemoveLessonList,
    getChapterList,
    batchRemoveChapterList,
  }
)
class List extends Component {
  state = {
    expandedRowKeys: [],
    selectedRowKeys: [],
    isShowVideoModal: false, // Modal显示&隐藏
    lesson: {}, // 显示的数据
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

  // 选中改变的回调
  onSelectChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  };

  // 显示增加课时页面
  //为什么传chapter
  showAddLesson = (chapter) => {
    return () => {
      this.props.history.push("/edu/chapter/addlesson", chapter);
    };
  };

  // 显示modal
  showVideoModal = (lesson) => {
    return () => {
      this.setState({
        isShowVideoModal: true,
        lesson,
      });
    };
  };

  // 关闭modal
  hidden = () => {
    this.setState({
      isShowVideoModal: false,
      lesson: {},
    });
  };

  // 批量删除
  batchRemove = () => {
    Modal.confirm({
      title: "确定要删除所有选中吗？",
      icon: <ExclamationCircleOutlined />,
      okText: "是",
      okType: "danger",
      cancelText: "否",
      onOk: async () => {
        const { selectedRowKeys } = this.state;
        const {
          chapters: { items: chapters }, // 对chapters解构赋值
          batchRemoveLessonList,
          batchRemoveChapterList,
        } = this.props;

        // 将id列表分成章节id列表和课时id列表
        const ids = Array.from(selectedRowKeys);
        // 章节id列表
        const chapterIds = [];
        chapters.forEach((chapter) => {
          const index = ids.indexOf(chapter._id);
          if (index > -1) {
            const [id] = ids.splice(index, 1);
            chapterIds.push(id);
          }
        });

        await batchRemoveLessonList(ids);
        await batchRemoveChapterList(chapterIds);
        message.success("批量删除数据成功");
      },
    });
  };

  // 全屏显示
  screenfull = () => {
    const dom = this.props.screenfullRef.current;
    screenfull.toggle(dom);
  };

  // 刷新功能
  againGetChapters = () => {
    const { getChapterList, courseId } = this.props;
    getChapterList({ page: 1, limit: 10, courseId });
  };

  render() {
    const { chapters } = this.props;
    const {
      expandedRowKeys,
      isShowVideoModal,
      lesson,
      selectedRowKeys,
    } = this.state;

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
        title: "视频",
        key: "video",
        render: (lesson) => {
          return (
            "video" in lesson && (
              <Tooltip title="预览视频">
                <Button onClick={this.showVideoModal(lesson)}>
                  <EyeOutlined />
                </Button>
              </Tooltip>
            )
          );
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
                    onClick={this.showAddLesson(data)}
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
              新增章节
            </Button>
            <Button type="danger" onClick={this.batchRemove}>
              批量删除
            </Button>
            <Tooltip title="全屏" onClick={this.screenfull}>
              <FullscreenOutlined />
            </Tooltip>
            <Tooltip title="刷新" onClick={this.againGetChapters}>
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
          rowSelection={{ selectedRowKeys, onChange: this.onSelectChange }}
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

        <Modal
          title={lesson.title}
          visible={isShowVideoModal}
          onCancel={this.hidden}
          footer={null}
          centered // 垂直居中
          destroyOnClose={true} // 关闭时销毁子元素
        >
          <Player
            id="video"
            duration={128}
            cover="http://localhost:3000/static/media/logo.ba1f87ec.png" // 封面图
            sources={{
              hd: {
                play_url: lesson.video,
              },
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default List;
