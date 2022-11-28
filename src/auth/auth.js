import { setAuthentication /* cacheAppConfigData */ } from "../utils/auth";
// import { notification, message } from "antd";
import { Toast } from "antd-mobile";
// import clientService from "api/clientService";
import axios from "axios";

let downloadData = [];

const authActions = {
  // data: {},
  async login(params, cb) {
    try {
      const { tenantId, userId, pwd } = params;
      const res = await axios.post(
        "http://47.94.5.22:6302/supoin/api/archive/logIn",
        { userId, password: pwd }
      );
      console.log(res);
      if (res.data.code === 1) {
        setAuthentication("1");
        sessionStorage.setItem("userId", userId);
        // message.success("登录成功");
        Toast.show({
          content: "登录成功",
          position: "top",
        });
        cb();
      } else {
        // notification.error({
        //   message: "登录失败",
        //   description: res.message,
        // });
        Toast.show({
          content: "登录失败",
          // position: "top",
        });
      }
    } catch (e) {
      // notification.error({
      //   message: "登录失败",
      //   description: e.message,
      // });
      Toast.show({
        content: "登录失败",
        // position: "top",
      });
    }
  },
  logout(cb) {
    setAuthentication("0");
    cb();
  },
  getData() {
    const returnData = () => {
      return downloadData;
    };
    const setData = (newData) => {
      downloadData = newData;
    };
    return {
      returnData,
      setData,
    };
  },
};

export default authActions;
