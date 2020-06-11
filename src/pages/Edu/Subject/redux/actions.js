import {
  GET_SUBJECT_LIST,
  GET_SUB_SUBJECT_LIST,
  UPDATE_SUBJECT,
} from "./constants";
import {
  reqGetSubjectList,
  reqGetSubSubjectList,
  reqUpdateSubject,
} from "@api/edu/subject";

const getSubjectListSync = (subjectList) => ({
  type: GET_SUBJECT_LIST,
  data: subjectList,
});

export const getSubjectList = (page, limit) => {
  return (dispatch) => {
    return reqGetSubjectList(page, limit).then((response) => {
      dispatch(getSubjectListSync(response));
      return response.items;
    });
  };
};

//获取二级课程分类数据
const getSubSubjectListSync = (data) => ({
  type: GET_SUB_SUBJECT_LIST,
  data,
});

export const getSubSubjectList = (parentId) => {
  return (dispatch) => {
    return reqGetSubSubjectList(parentId).then((response) => {
      dispatch(
        getSubSubjectListSync({ parentId, subSubjectList: response.items })
      );
      return response;
    });
  };
};

// 更新课程分类数据
const updateSubjectSync = (subject) => ({
  type: UPDATE_SUBJECT,
  data: subject,
});

export const updateSubject = (title, id) => {
  return (dispatch) => {
    return reqUpdateSubject(title, id).then((response) => {
      const subject = { title, _id: id };
      dispatch(updateSubjectSync(subject));
      return subject;
    });
  };
};
