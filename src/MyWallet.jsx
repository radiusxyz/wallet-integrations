import React from "react";
import styled from "styled-components";
import { useConnect } from "@starknet-react/core";

const A = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 20;
`;

const B = styled.button`
  background: darkgreen;
  padding: 20px 80px;
  border-radius: 10px;
  color: white;
  font-weight: 700;
  border: none;
  font-size: 30;
  cursor: pointer;
`;

const C = styled(B)`
  background: darkred;
`;

const MyWallet = () => {
  const { connect, disconnect } = useConnect();

  return (
    <A>
      <B onClick={connect}>Connect</B>
      <C onClick={disconnect}>Disconnect</C>
    </A>
  );
};

export default MyWallet;
