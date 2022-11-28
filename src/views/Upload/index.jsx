import { useLocation, useHistory } from "react-router-dom";
import { NavBar, CheckList, Button, Toast } from "antd-mobile";
import { useState } from "react";
import axios from "axios";
const { Item } = CheckList;
const inventoryData = JSON.parse(sessionStorage.getItem("uploadData"));
const commonStyle = { color: "#f60" };

export default () => {
  const history = useHistory();
  const [inventory, setInventory] = useState([inventoryData]);
  const [checkValue, setCheckValue] = useState([]);
  const back = () => {
    history.go(-1);
  };

  const handleChange = (values) => {
    setCheckValue(values);
  };

    const handleClick = async () => {
    const filterData = inventory.filter(
      (item) => item.billId === checkValue[0]
    );
    const res = await axios.post(
      "http://47.94.5.22:6302/supoin/api/archive/inventory/uploadCheckResult",
      filterData[0]
    );
    if (res.data.code === 1) {
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

  return (
    <>
      <div style={{ height: "100vh" }}>
        <NavBar back="返回" onBack={back}>
          数据上传
        </NavBar>
        <div style={{ minHeight: "80vh" }}>
          <CheckList value={checkValue} onChange={handleChange}>
            {inventory.map((item) => (
              <Item key={item.billId} value={item.billId}>
                <span style={commonStyle}>单据类型: </span>
                {item.type},<span style={commonStyle}>单据编号:</span>
                {item.billId},<span style={commonStyle}>已扫数量: </span>
                {item.quantity}
              </Item>
            ))}
          </CheckList>
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
