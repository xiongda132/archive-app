import { useState, useEffect, useRef, useCallback } from "react";
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
import { pdaConfig, pdaStart, padStop, queryPdaData } from "api/pda";
import dayjs from "dayjs";
const { Group } = Radio;

// const myData = [
//   {
//     status: 0,
//     archiveId: "FL9414100001",
//     epc: "010003202210140000004424",
//     className: "生产线档案",
//     orgName: "研发中心",
//     placeName: "A库房01区02列01节01层左侧",
//   },
//   {
//     status: 1,
//     archiveId: "FL9414100002",
//     epc: "010003202210140000004425",
//     className: "生产线档案",
//     orgName: "研发中心",
//     placeName: "A库房01区02列01节01层左侧",
//   },
//   {
//     status: 0,
//     archiveId: "FL9414100003",
//     epc: "010003202210140000004424",
//     className: "生产线档案",
//     orgName: "研发中心",
//     placeName: "A库房01区02列01节01层左侧",
//   },
//   {
//     status: 1,
//     archiveId: "FL9414100004    ",
//     epc: "010003202210140000004425",
//     className: "生产线档案",
//     orgName: "研发中心",
//     placeName: "A库房01区02列01节01层左侧",
//   },
// ];

const keyStyle = {
  color: "#f60",
  fontWeight: 900,
  fontSize: 12,
};

const textStyle = {
  color: "black",
  fontWeight: 400,
  fontSize: 12,
};

const BillModal = ({ allData, setRadioValue }) => {
  const [value, setValue] = useState(allData[0].billId);
  // console.log(value);
  const handleChange = (value) => {
    // console.log(value);
    setValue(value);
    // setRadioValue(value);
  };
  // console.log(allData[0].billId);

  useEffect(() => {
    // console.log(value);
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

// const ScanModal = ({ setTextValue }) => {
//   const [value, setValue] = useState("");
//   // console.log(value.split("\n"));
//   // console.log(value);
//   const handleChange = (value) => {
//     // value += "\n";
//     setValue(value);
//     setTextValue(value);
//   };

//   useEffect(() => {
//     const area = document.querySelector("#textArea");
//     area.focus();
//   }, []);
//   return (
//     <div>
//       <TextArea
//         id="textArea"
//         placeholder="请开始扫描"
//         value={value}
//         autoSize={{ minRows: 5, maxRows: 10 }}
//         onChange={handleChange}
//       ></TextArea>
//     </div>
//   );
// };

export default () => {
  const history = useHistory();
  const auth = useAuth();
  const [radioValue, setRadioValue] = useState("");
  const [storageValue, setStorageValue] = useState("");
  const radioRef = useRef("");
  const [textValue, setTextValue] = useState("");
  const textRef = useRef("");
  const [allData, setAllData] = useState([]);
  const [archiveData, setArchiveData] = useState([]);
  const archiveRef = useRef([]);
  const diifDataRef = useRef();
  const configTime = useRef(dayjs().format("YYYY-MM-DD HH:mm:ss"));
  const [pdaReady, setPdaReady] = useState(false);
  const [isInventory, setIsInventory] = useState([]);
  const hasInventory = () => {
    return archiveData.filter((item) => item.status === 1).length;
  };

  const handleBack = () => {
    // if (storageValue || archiveData.length) {
    //   const storageData = {
    //     key: storageValue || "",
    //     data: archiveData || [],
    //     dataRef: archiveRef.current || [],
    //   };
    //   sessionStorage.setItem("storageKey", JSON.stringify(storageData));
    // }
    history.goBack();
  };

  const handleBill = () => {
    if (!allData?.length) {
      return Toast.show({
        content: "请先下载单据",
      });
    }
    Modal.confirm({
      title: "请选择单据",
      content: <BillModal allData={allData} setRadioValue={setRadioValue} />,
      onConfirm: async () => {
        // radioRef.current = radioValue;
        setStorageValue(radioRef.current);
        /* await  */ handleOk();
      },
      // onCancel: async () => {
      //   setRadioValue("");
      // },
    });
  };

  // const hanldeCancel = () => {
  //   setOpen(false);
  // };

  const handleOk = async () => {
    const res = await axios.post(
      "http://47.94.5.22:6302/supoin/api/archive/inventory/getCheckListDetail",
      { billId: radioRef.current }
    );
    if (res.data.code === 1) {
      const resMap = res.data.data
        /* .slice(0, 50) */
        .map((item) => ({ ...item, status: 0 }));
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

  const getData = () => {
    const data = JSON.parse(sessionStorage.getItem("downloadData"));
    setAllData(data);
  };

  const getStorageData = () => {
    const storageData = JSON.parse(sessionStorage.getItem("storageKey"));
    if (storageData) {
      setStorageValue(storageData.key);
      setArchiveData(storageData.data);
      archiveRef.current = storageData.dataRef;
    }
  };

  const handleReset = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setArchiveData(archiveRef.current);
  };

  const handleScan = () => {
    setPdaReady(true);
    Toast.show({
      content: "请使用RFID设备进行扫描",
    });
    // Modal.confirm({
    //   title: "扫描详情",
    //   content: <ScanModal setTextValue={setTextValue}></ScanModal>,
    //   onConfirm: async () => {
    //     await getDiff();
    //   },
    // });
  };

  const getDiff = () => {
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
        billId: storageValue,
        userId: sessionStorage.getItem("userId"),
        archiveList: archiveData,
        type: "盘点单",
        quantity: archiveData.length || 0,
      };
      sessionStorage.setItem("uploadData", JSON.stringify(inventoryData));
      setArchiveData(diffData);
      diifDataRef.current = diffData;
      Toast.show({
        content: `完成盘点， 已盘${hasData.length}条`,
      });
    } else {
      Toast.show({
        content: `完成盘点， 已盘${hasData.length}条`,
      });
    }
  };

  const initPda = useCallback(async () => {
    const pdaConfigRes = await pdaConfig({
      scanType: 0,
      rfidReadpower: 30,
    });
    if (pdaConfigRes.code === 1) {
      const pdaStartRes = await pdaStart({
        startTime: configTime.current,
      });
      if (pdaStartRes.code === 1) {
        // setPdaReady(true);
        console.log("初始化PDA成功");
      } else {
        Toast.show({
          icon: "fail",
          content: "启动失败, " + pdaStartRes.msg,
        });
      }
    } else {
      Toast.show({
        icon: "fail",
        content: "参数配置失败, " + pdaConfigRes.msg,
      });
    }
  }, []);

  const back = useCallback(() => {
    const plus = window.plus || {};
    console.log("返回主页");
    history.push("/");
    plus?.key.removeEventListener("backbutton", back);
  }, []);

  const plusReady = useCallback(() => {
    const plus = window.plus || {};
    function back() {
      console.log("返回主页");
      history.push("/");
      plus?.key.removeEventListener("backbutton", back);
    }
    plus?.key.addEventListener("backbutton", back);
  }, [history]);

  const initDevicePlus = useCallback(() => {
    if (window.plus) {
      plusReady();
    } else {
      document.addEventListener("plusready", plusReady, false);
    }
  }, [plusReady]);

  useEffect(() => {
    initPda();
    initDevicePlus();
    return () => {
      const plus = window.plus || {};
      padStop({
        endTime: configTime.current,
      });
      document.removeEventListener("plusReady", plusReady);
      plus?.key.removeEventListener("backbutton", back);
    };
  }, [initPda, initDevicePlus]);

  const timer = useRef(null);
  // const [loading, setLoading] = useState(true);
  // const [epcList, setEpcList] = useState([]);
  const refreshData = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    const res = await queryPdaData({
      startTime: configTime.current,
    });
    console.log("res", res);
    if (res.code === 1) {
      const curArchiveList = res.data.map(({ epc }) => epc);
      setArchiveData((preArichiveList) => {
        const newArchiveList = [...preArichiveList];
        const hasData = [];
        const ArchiveList = newArchiveList.map((localItem) => {
          let data = [];
          curArchiveList.forEach((epc) => {
            if (localItem.epc === epc) {
              data.push(epc);
              hasData.push(epc);
            }
          });
          if (data.length) {
            return { ...localItem, status: 1 };
          } else {
            return { ...localItem };
          }
        });
        console.log(hasData);
        if (hasData.length) {
          setIsInventory(hasData);
        }
        console.log(ArchiveList);
        return ArchiveList;
      });
      // setLoading(false);
      if (timer.current !== null) {
        timer.current = setTimeout(refreshData, 200);
      }
    } else {
      // console.log("res", res);
      if (timer.current !== null) {
        timer.current = setTimeout(refreshData, 200);
      }
    }
  }, []);

  const setLocalStorage = useCallback(() => {
    if (isInventory.length) {
      const diffData = archiveData
        .filter((item) => item.status === 1)
        .map((item) => item.epc);
      const inventoryData = {
        billId: storageValue,
        userId: sessionStorage.getItem("userId"),
        archiveList: diffData,
        type: "盘点单",
        quantity: diffData.length || 0,
      };
      sessionStorage.setItem("uploadData", JSON.stringify(inventoryData));
      // setArchiveData(diffData);
      // diifDataRef.current = diffData;
      // Toast.show({
      //   content: `完成盘点， 已盘${isInventory.length}条`,
      // });
    }
  }, [isInventory]);

  // const stopScan = () => {
  //   if (timer.current) {
  //     clearTimeout(timer.current);
  //     // timer.current = null;
  //   }
  // };

  useEffect(() => {
    if (pdaReady) {
      timer.current = 0;
      refreshData();
    }
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [pdaReady, refreshData]);

  useEffect(() => {
    getData();
    reduceMotion();
    getStorageData();
    return () => {
      setLocalStorage();
    };
  }, [setLocalStorage]);

  useEffect(() => {
    radioRef.current = radioValue;
  }, [radioValue]);

  useEffect(() => {
    textRef.current = textValue;
  }, [textValue]);

  return (
    <>
      <div className={styles.wrapper}>
        <NavBar back="返回" onBack={handleBack}>
          盘点扫描
        </NavBar>
        <Card>
          <div className={styles.top}>
            <div
              style={{
                color: "#f60",
                fontWeight: 900,
                fontSize: 12,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <span>盘点单号:</span>
              <span style={{ color: "#000", fonstSize: 12, fontWeight: 400 }}>
                {storageValue}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                size="mini"
                onClick={handleScan}
                color="danger"
                style={{ marginRight: 10 }}
                disabled={!archiveData.length}
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
                    <div style={{ color: "red", fontSize: 12 }}>未盘</div>
                  ) : (
                    <div style={{ color: "green", fontSize: 12 }}>已盘</div>
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
        <div
          style={{
            display: "flex",
            marginTop: 10,
            fontSize: 12,
            justifyContent: "space-around",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginLeft: 20 }}>
              共{archiveRef.current.length}条
            </span>
            ，<span>已盘数量: {hasInventory()}</span>
          </div>
          <div>
            {/* <Button
              size="mini"
              onClick={stopScan}
              color="warning"
              disabled={!archiveData.length}
            >
              保存扫描结果
            </Button> */}
          </div>
        </div>
      </div>
    </>
  );
};
