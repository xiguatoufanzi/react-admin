import request from "@utils/request";

// 模块请求公共前缀
const BASE_URL = "/admin/edu/chapter";

// 获取章节分页数据
export function reqGetChapterList({ page, limit, courseId }) {
  return request({
    url: `${BASE_URL}/${page}/${limit}`,
    method: "GET",
    params: {
      courseId,
    },
  });
}

// 批量删除章节列表
export function reqBatchRemoveChapterList(idList) {
  return request({
    url: `${BASE_URL}/batchRemove`,
    method: "DELETE",
    data: {
      idList,
    },
  });
}
