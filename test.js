// const options = {
//   method: 'POST',
//   headers: { accept: 'application/json', 'content-type': 'application/json' },
//   body: JSON.stringify({ id: 1, jsonrpc: '2.0', method: 'eth_estimateGas' }),
// };

// fetch(
//   'https://bsc-testnet.nodereal.io/v1/77e0f7b90d2f499196289fb0021242e3',
//   options
// )
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

// const options = {
//   method: 'POST',
//   headers: { accept: 'application/json', 'content-type': 'application/json' },
//   body: JSON.stringify({
//     id: 1,
//     jsonrpc: '2.0',
//     method: 'eth_estimateGas',
//     params: [{ to: '0xd46e8dd67c5d32be8058bb8eb970870f07244567' }],
//   }),
// };

// fetch(
//   'https://bsc-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3',
//   options
// )
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));

// const gasPrice = await this.getGasPrice();
// // BSC Testnet only, using maxPriorityFeePerGas field to store gasEstimate

// console.log(gasPrice.maxPriorityFeePerGas);
