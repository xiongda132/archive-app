import styles from "./index.module.css";
import { CloudSyncOutlined } from "@ant-design/icons";
import LoginFormContent from "./components/LoginFormContent";
import dayjs from "dayjs";

export default () => {
  return (
    <div className={styles.container}>
      <div className={styles.containerT}>
        <div className={styles.centerForm}>
          <div className={styles.CenterTitle}>
            <CloudSyncOutlined className={styles.icon} />
            <div className={styles.title}>{"档案管理系统"}</div>
          </div>
          <LoginFormContent />
        </div>
        <span className={styles.containerB}>{`版权所有 © 2019-${dayjs().format(
          "YYYY"
        )} 销邦数据`}</span>
        {/* <CopyrightNotice /> */}
      </div>
    </div>
  );
};
