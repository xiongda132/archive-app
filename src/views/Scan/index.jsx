import { useState, useEffect, useRef } from "react";
import styles from "./index.module.css";
// import { Card, Button, Modal, Radio, Pagination } from "antd";
import {
  Card,
  Button,
  Modal,
  Radio,
  Toast,
  List,
  TextArea,
  NavBar,
  reduceMotion,
} from "antd-mobile";
import { List as VirtualizedList, AutoSizer } from "react-virtualized";
import { useLocation, useHistory, Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import axios from "axios";
const { Group } = Radio;

const myData = [
  {
    status: 0,
    archiveId: "FL9414100001",
    epc: "010003202210140000004424",
    className: "生产线档案",
    orgName: "研发中心",
    placeName: "A库房01区02列01节01层左侧",
  },
  {
    status: 1,
    archiveId: "FL9414100002",
    epc: "010003202210140000004425",
    className: "生产线档案",
    orgName: "研发中心",
    placeName: "A库房01区02列01节01层左侧",
  },
  {
    status: 0,
    archiveId: "FL9414100003",
    epc: "010003202210140000004424",
    className: "生产线档案",
    orgName: "研发中心",
    placeName: "A库房01区02列01节01层左侧",
  },
  {
    status: 1,
    archiveId: "FL9414100004    ",
    epc: "010003202210140000004425",
    className: "生产线档案",
    orgName: "研发中心",
    placeName: "A库房01区02列01节01层左侧",
  },
];

const keyStyle = {
  color: "#f60",
  fontWeight: 900,
};

const textStyle = {
  color: "black",
  fontWeight: 400,
};

const BillModal = ({ allData, setRadioValue }) => {
  const [value, setValue] = useState(allData[0].billId);
  console.log(value);
  const handleChange = (value) => {
    console.log(value);
    setValue(value);
    // setRadioValue(value);
  };
  console.log(allData[0].billId);

  useEffect(() => {
    console.log(value);
    setRadioValue(value);
  }, [value]);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        height: "40vh",
        justifyContent: "center",
      }}
    >
      <Group value={value} onChange={handleChange}>
        {allData.map((item) => (
          <Radio value={item.billId} key={item.billId}>
            {item.billId}
          </Radio>
        ))}
      </Group>
    </div>
  );
};

const ScanModal = ({ setTextValue }) => {
  const [value, setValue] = useState("");
  console.log(value.split("\n"));
  console.log(value);
  const handleChange = (value) => {
    // value += "\n";
    setValue(value);
    setTextValue(value);
  };

  useEffect(() => {
    const area = document.querySelector("#textArea");
    area.focus();
  }, []);
  return (
    <div>
      <TextArea
        id="textArea"
        placeholder="请开始扫描"
        value={value}
        autoSize={{ minRows: 5, maxRows: 10 }}
        onChange={handleChange}
      ></TextArea>
    </div>
  );
};

export default () => {
  const history = useHistory();
  const auth = useAuth();
  const [radioValue, setRadioValue] = useState("");
  const [storageValue, setStorageValue] = useState("");
  console.log(radioValue);
  const radioRef = useRef("");
  const [textValue, setTextValue] = useState("");
  // console.log(textValue);
  const textRef = useRef("");
  const [open, setOpen] = useState(false);
  const [allData, setAllData] = useState([]);
  const [archiveData, setArchiveData] = useState([]);
  const archiveRef = useRef([]);
  // const valueRef = useRef("");

  const hasInventory = () => {
    return archiveData.filter((item) => item.status === 1).length;
  };

  const back = () => {
    history.goBack();
  };

  const handleBill = () => {
    setOpen(true);
    Modal.confirm({
      title: "请选择单据",
      content: <BillModal allData={allData} setRadioValue={setRadioValue} />,
      onConfirm: async () => {
        // radioRef.current = radioValue;
        setStorageValue(radioRef.current);
        await handleOk();
      },
      onCancel: async () => {
        setRadioValue("");
      },
    });
  };

  const hanldeCancel = () => {
    setOpen(false);
  };

  const handleOk = async () => {
    /*  if (!radioRef.current) {
      return Toast.show({
        content: "请选择一个单据",
      });
    } else { */
    const res = await axios.post(
      "http://47.94.5.22:6302/supoin/api/archive/inventory/getCheckListDetail",
      { billId: radioRef.current }
    );
    if (res.data.code === 1) {
      const resMap = res.data.data.map((item) => ({ ...item, status: 0 }));
      setArchiveData(resMap);
      archiveRef.current = resMap;
      Toast.show({
        icon: "success",
        content: "数据加载成功",
      });
    } else {
      Toast.show({
        icon: "error",
        content: "加载失败",
      });
    }
    // }
  };

  const refreshData = () => {
    const data = JSON.parse(sessionStorage.getItem("downloadData"));
    setAllData(data);
  };

  const handleReset = () => {
    setArchiveData(archiveRef.current);
  };

  const handleScan = () => {
    Modal.confirm({
      title: "扫描详情",
      content: <ScanModal setTextValue={setTextValue}></ScanModal>,
      onConfirm: async () => {
        await getDiff();
      },
    });
  };

  const getDiff = () => {
    // console.log(textRef.current.split("\n"));d
    let hasData = [];
    const diffData = archiveData.map((archiveItem) => {
      let data = [];
      textRef.current.split("\n").forEach((textItem) => {
        if (textItem === archiveItem.archiveId) {
          data.push(archiveItem);
          hasData.push(archiveItem);
        }
      });
      if (data.length) {
        return { ...archiveItem, status: 1 };
      } else {
        return { ...archiveItem };
      }
    });
    if (hasData.length) {
      const archiveData = diffData
        .filter((item) => item.status === 1)
        .map((item) => item.archiveId);
      const inventoryData = {
        billId: radioRef.current,
        userId: sessionStorage.getItem("userId"),
        archiveList: archiveData,
        type: "盘点单",
        quantity: archiveData.length || 0,
      };
      sessionStorage.setItem("uploadData", JSON.stringify(inventoryData));
      setArchiveData(diffData);
      Toast.show({
        content: `完成盘点， 已盘${hasData.length}条`,
      });
    } else {
      Toast.show({
        content: `完成盘点， 已盘${hasData.length}条`,
      });
    }
  };

  useEffect(() => {
    refreshData();
    reduceMotion();
  }, []);

  useEffect(() => {
    // if (!radioValue) return;
    radioRef.current = radioValue;
    // console.log(radioValue);
    // console.log(radioRef.current);
  }, [radioValue]);

  // console.log(radioRef.current);

  useEffect(() => {
    textRef.current = textValue;
  }, [textValue]);

  // console.log(textRef.current);

  return (
    <>
      <div className={styles.wrapper}>
        <NavBar back="返回" onBack={back}>
          盘点扫描
        </NavBar>
        <Card>
          <div className={styles.top}>
            <div style={keyStyle}>
              盘点单号: <span style={textStyle}>{storageValue}</span>
            </div>
            <div>
              <Button
                size="mini"
                onClick={handleScan}
                color="danger"
                style={{ marginRight: 10 }}
                disabled={archiveData.length <= 0}
              >
                开始扫描
              </Button>
              <Button
                type="primary"
                size="mini"
                onClick={handleBill}
                color="primary"
              >
                选择单据
              </Button>
            </div>
          </div>
        </Card>
        <div className={styles.main}>
          <List header="档案信息:">
            {archiveData.map((item) => (
              <List.Item key={item.name}>
                <div style={{ float: "right", fontWeight: 900 }}>
                  {item.status === 0 ? (
                    <div style={{ color: "red" }}>未盘</div>
                  ) : (
                    <div style={{ color: "green" }}>已盘</div>
                  )}
                </div>
                <div style={keyStyle}>
                  档案编号: <span style={textStyle}>{item.archiveId}</span>
                </div>
                <div style={keyStyle}>
                  分类名称: <span style={textStyle}>{item.className}</span>
                </div>
                <div style={keyStyle}>
                  epc: <span style={textStyle}>{item.epc}</span>
                </div>
                <div style={keyStyle}>
                  部门名称: <span style={textStyle}>{item.orgName}</span>
                </div>
                <div style={keyStyle}>
                  位置名称: <span style={textStyle}>{item.placeName}</span>
                </div>
              </List.Item>
            ))}
          </List>
        </div>
        <div style={{ display: "flex", marginTop: 10, fontSize: 20 }}>
          <div style={{ marginLeft: 20 }}>共{archiveRef.current.length}条</div>
          ，<div>已盘数量: {hasInventory()}</div>
        </div>
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Button
            size="large"
            onClick={handleReset}
            color="warning"
            disabled={archiveData.length <= 0}
          >
            重新盘点
          </Button>
        </div>
      </div>
    </>
  );
};
