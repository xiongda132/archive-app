import { useState } from "react";
import { Button } from "antd";

const StateBtn = ({ children, onClick = () => {}, ...restProps }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div
      onClick={async () => {
        setLoading(true);
        await onClick();
        setLoading(false);
      }}
    >
      <Button {...restProps} loading={loading}>
        {children}
      </Button>
    </div>
  );
};

export default StateBtn;
