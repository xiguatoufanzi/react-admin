import { reqLogin, reqLogout } from "@api/acl/login";
import { reqMobileLogin } from "@api/acl/oauth";

import { LOGIN, REMOVE_TOKEN } from "../constants/login";

/**
 * 账号密码登陆
 */
const loginSync = (token) => ({
  type: LOGIN,
  data: token,
});

export const login = (username, password) => {
  return (dispatch) => {
    return reqLogin(username, password).then(({ token }) => {
      dispatch(loginSync(token));
      return token;
    });
  };
};

// 手机号验证码登陆
export const mobileLogin = (mobile, code) => {
  return (dispatch) => {
    // 执行异步代码~
    return reqMobileLogin(mobile, code).then(({ token }) => {
      dispatch(loginSync(token));
      return token;
    });
  };
};

/**
 * 删除token
 */
export const removeToken = () => ({
  type: REMOVE_TOKEN,
});

/**
 * 登出
 */
export const logout = () => {
  return (dispatch) => {
    return reqLogout().then(() => {
      dispatch(removeToken());
    });
  };
};
