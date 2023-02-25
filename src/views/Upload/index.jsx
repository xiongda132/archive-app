import { useLocation, useHistory } from "react-router-dom";
import { NavBar, CheckList, Button, Toast } from "antd-mobile";
import { useEffect, useState } from "react";
import axios from "axios";
const { Item } = CheckList;
// const inventoryData = JSON.parse(sessionStorage.getItem("uploadData"));
const commonStyle = { color: "#f60" };

// console.log(inventoryData);

export default () => {
  const history = useHistory();
  const [inventory, setInventory] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [checkValue, setCheckValue] = useState([]);
  const back = () => {
    history.go(-1);
  };

  const handleChange = (values) => {
    console.log(values);
    setCheckValue(values);
  };

  const handleClick = async () => {
    if (!checkValue.length) {
      return Toast.show({
        content: "请至少选择一条",
      });
    }
    const filterObj = inventory.find((item) => item.billId === checkValue[0]);
    const { type } = filterObj;
    let res = {};
    if (type === "盘点单") {
      res = await axios.post(
        "http://47.94.5.22:6302/supoin/api/archive/inventory/uploadCheckResult",
        filterObj
      );
    } else if (type === "借阅出库单") {
      res = await axios.post(
        "http://47.94.5.22:6302/supoin/api/archive/lend/uploadResult",
        filterObj
      );
    }
    if (res.data.code === 1) {
      setInventory((preData) => {
        const newData = [...preData];
        newData.map((item, index) => {
          if (item.billId === checkValue[0]) {
            newData.splice(index, 1);
          }
        });
        return newData;
      });
      if (type === "盘点单") {
        sessionStorage.removeItem("uploadData");
      } else if (type === "借阅出库单") {
        sessionStorage.removeItem("uploadLendData");
      }
      Toast.show({
        icon: "success",
        content: "上传成功",
      });
      setCheckValue([]);
    } else {
      Toast.show({
        icon: "error",
        content: "上传失败",
      });
    }
  };

  useEffect(() => {
    const listData = [];
    const inventoryData = JSON.parse(sessionStorage.getItem("uploadData"));
    const lendData = JSON.parse(sessionStorage.getItem("uploadLendData"));
    if (inventoryData !== null) {
      listData.push(inventoryData);
    }
    if (lendData !== null) {
      listData.push(lendData);
    }
    if (listData.length) {
      setInventory(listData);
      setIsShow(true);
    }
  }, []);
  return (
    <>
      <div style={{ height: "100vh" }}>
        <NavBar back="返回" onBack={back}>
          数据上传
        </NavBar>
        <div style={{ height: "70vh" }}>
          {
            <CheckList value={checkValue} onChange={handleChange}>
              {isShow &&
                inventory.map((item) => (
                  <Item
                    key={item?.billId || Math.random()}
                    value={item?.billId}
                  >
                    <span style={commonStyle}>单据类型: </span>
                    {item?.type},<span style={commonStyle}>单据编号:</span>
                    {item?.billId},<span style={commonStyle}>已扫数量: </span>
                    {item?.quantity}
                  </Item>
                ))}
            </CheckList>
          }
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button size="large" color="warning" onClick={handleClick}>
            上传数据
          </Button>
        </div>
      </div>
    </>
  );
};
