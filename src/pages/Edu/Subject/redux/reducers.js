import { GET_SUBJECT_LIST, GET_SUB_SUBJECT_LIST } from "./constants";

const initSubjectList = {
  total: 0, // 总数
  items: [], // 课程分类列表数据
};

export default function subjectList(prevState = initSubjectList, action) {
  switch (action.type) {
    case GET_SUBJECT_LIST:
      return {
        total: action.data.total,
        items: action.data.items.map((subject) => {
          return {
            ...subject,
            children: [],
          };
        }),
      };
    case GET_SUB_SUBJECT_LIST:
      const { parentId, subSubjectList } = action.data;
      return {
        total: prevState.total,
        items: prevState.items.map((subject) => {
          if (subject._id === parentId) {
            subject.children = subSubjectList;
          }
          return subject;
        }),
      };
    default:
      return prevState;
  }
}
