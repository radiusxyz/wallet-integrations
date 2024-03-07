import styled from "styled-components";

export const A = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 20px;
`;

export const B = styled.button`
  background: darkgreen;
  padding: 20px 80px;
  border-radius: 10px;
  color: white;
  font-weight: 700;
  border: none;
  font-size: 30px;
  cursor: pointer;
  transition: 0.1s all ease-in;
  &:hover {
    transform: translateY(-10px) scale(1.01);
    background: black;
    color: white;
  }
  &:active {
    background: white;
    color: black;
  }
`;

export const C = styled(B)`
  background: darkred;
`;

export const D = styled(B)`
  background: darkblue;
`;

export const E = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  max-width: 500px;
  overflow-wrap: break-word;
  transform: translate(-50%, -50%);
  border-radius: 10px;
  padding: 10px;
  background: black;
  border: 10px solid white;
  color: white;
  font-weight: bold;
  font-size: 40px;
`;

export const F = styled(B)`
  background: cyan;
`;
