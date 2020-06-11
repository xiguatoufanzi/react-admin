import { reqGetAllCourseList } from "@api/edu/course";

import { GET_ALL_COURSE_LIST } from "./constants";

const getAllCourseListSync = (courseList) => ({
  type: GET_ALL_COURSE_LIST,
  data: courseList,
});
export const getAllCourseList = () => {
  return (dispatch) => {
    return reqGetAllCourseList().then((response) => {
      dispatch(getAllCourseListSync(response));
      return response;
    });
  };
};
