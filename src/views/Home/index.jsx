import { useLocation, useHistory, Link } from "react-router-dom";
import {
  BarChartOutlined,
  UserOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import styles from "./index.module.css";
// import { Modal, message, notification } from "antd";
import { Modal, notification, Toast } from "antd-mobile";
import { useState, useEffect } from "react";
import axios from "axios";
import downloadSvg from "./svg/download.svg";
import scanSvg from "./svg/scan.svg";
import uploadSvg from "./svg/upload.svg";
const imgStyle = {
  width: 90,
};
const CLogin = (props) => {
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const handleDownLoad = () => {
    Modal.confirm({
      content: "是否下载所有单据",
      onConfirm: async () => {
        getData();
      },
    });
  };
  const handleScan = () => {
    history.push("/scan");
  };

  const handleUpload = () => {
    history.push("/upload");
  };

  const getData = async () => {
    const res = await axios.post(
      "http://47.94.5.22:6302/supoin/api/archive/inventory/getCheckList"
    );
    if (res.status === 200) {
      sessionStorage.setItem("downloadData", JSON.stringify(res.data.data));
      Toast.show({
        icon: "success",
        content: "下载成功",
      });
      setOpen(false);
    } else {
      Toast.show({
        icon: "fail",
        content: "下载失败",
      });
    }
  };

  const handleOk = () => {
    getData();
  };
  return (
    <>
      <div>
        <div className={styles.inventory}>主菜单</div>
        <div className={styles.content}>
          <div className={styles.main}>
            <div className={styles.download} onClick={handleDownLoad}>
              <div>
                <img src={downloadSvg} alt="" style={imgStyle} />
              </div>
              <div className={styles.text}>单据下载</div>
            </div>
            <div className={styles.scan} onClick={handleScan}>
              <div>
                <img src={scanSvg} alt="" style={imgStyle} />
              </div>
              <div className={styles.text}>盘点扫描</div>
            </div>
            <div className={styles.upload} onClick={handleUpload}>
              <div>
                <img src={uploadSvg} alt="" style={imgStyle} />
              </div>
              <div className={styles.text}> 单据上传</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CLogin;
