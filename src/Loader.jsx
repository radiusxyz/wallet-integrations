import styled, { keyframes } from "styled-components";

const FullPageBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.93); // Semi-transparent backdrop
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  z-index: 999; // High z-index to ensure it's on top
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const CircularLoader = styled.div`
  border: 5px solid #f3f3f3; // Light grey border
  border-top: 5px solid #3498db; // Blue color
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 2s linear infinite;
`;

const Loading = styled.span`
  font-family: "Source Code Pro", monospace;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;

const Loader = ({ message }) => {
  return (
    <FullPageBackdrop>
      <CircularLoader />
      <Loading>{message}</Loading>
    </FullPageBackdrop>
  );
};

export default Loader;
