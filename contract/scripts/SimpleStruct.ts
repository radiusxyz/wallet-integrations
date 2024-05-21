import {
  typedData,
  RpcProvider,
  Account,
  WeierstrassSignatureType,
} from "starknet";

const types = {
  StarkNetDomain: [
    { name: "name", type: "felt" },
    { name: "version", type: "felt" },
    { name: "chainId", type: "felt" },
  ],
  SimpleStruct: [
    { name: "hello", type: "felt" },
    { name: "some_u128", type: "u128" },
  ],
};

interface SimpleStruct {
  hello: string;
  some_u128: string;
}

function getDomain(chainId: string): typedData.StarkNetDomain {
  return {
    name: "dappName",
    version: "1",
    chainId: "KATANA",
  };
}

function getTypedDataHash(
  myStruct: SimpleStruct,
  chainId: string,
  owner: bigint
): string {
  return typedData.getMessageHash(getTypedData(myStruct, chainId), owner);
}

// Needed to reproduce the same structure as:
// https://github.com/0xs34n/starknet.js/blob/1a63522ef71eed2ff70f82a886e503adc32d4df9/__mocks__/typedDataStructArrayExample.json
function getTypedData(
  myStruct: SimpleStruct,
  chainId: string
): typedData.TypedData {
  return {
    types,
    primaryType: "SimpleStruct",
    domain: getDomain(chainId),
    message: { ...myStruct },
  };
}

const simpleStruct: SimpleStruct = {
  hello: "712",
  some_u128: "42",
};

console.log(
  `test test_valid_hash ${getTypedDataHash(
    simpleStruct,
    "0",
    318027405971194400117186968443431282813445578359155272415686954645506762954n
  )};`
);

async function test() {
  const provider = new RpcProvider({ nodeUrl: "http://0.0.0.0:5050" });

  const privateKey =
    "0x2bbf4f9fd0bbb2e60b0316c1fe0b76cf7a4d0198bd493ced9b8df2a3a24d68a";
  const accountAddress =
    "0xb3ff441a68610b30fd5e2abbf3a1548eb6ba6f3559f2862bf2dc757e5828ca";
  const account = new Account(provider, accountAddress, privateKey);

  const signature = (await account.signMessage(
    getTypedData(simpleStruct, "KATANA")
  )) as WeierstrassSignatureType;

  console.log(signature);
}
test();
