import {
  GET_ALL_COURSE_LIST,
  GET_CHAPTER_LIST,
  GET_LESSON_LIST,
  BATCH_REMOVE_LESSON_LIST,
  BATCH_REMOVE_CHAPTER_LIST,
} from "./constants";

const initChapter = {
  allCourseList: [],
  courseId: "",
  chapters: {
    total: 0,
    items: [],
  },
};

export default function chapter(prevState = initChapter, action) {
  switch (action.type) {
    case GET_ALL_COURSE_LIST:
      return {
        ...prevState,
        allCourseList: action.data,
      };
    case GET_CHAPTER_LIST:
      return {
        ...prevState,
        courseId: action.data.courseId,
        chapters: {
          total: action.data.chapters.total,
          items: action.data.chapters.items.map((chapter) => {
            return {
              ...chapter,
              children: [],
            };
          }),
        },
      };
    case GET_LESSON_LIST:
      return {
        ...prevState,
        chapters: {
          total: prevState.chapters.total,
          items: prevState.chapters.items.map((chapter) => {
            if (chapter._id === action.data.chapterId) {
              return {
                ...chapter,
                children: action.data.lessons,
              };
            }
            return chapter;
          }),
        },
      };
    case BATCH_REMOVE_LESSON_LIST:
      return {
        ...prevState,
        chapters: {
          total: prevState.chapters.total,
          items: prevState.chapters.items.map((chapter) => {
            let children = chapter.children;
            if (children && children.length) {
              children = children.filter(
                (item) => action.data.indexOf(item._id) === -1
              );
            }

            return {
              ...chapter,
              children,
            };
          }),
        },
      };
    case BATCH_REMOVE_CHAPTER_LIST:
      return;
    default:
      return prevState;
  }
}
