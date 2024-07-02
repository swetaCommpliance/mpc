const mpc = require('mpc')
const dataKey = mpc.generate();
console.log("Generate shard and recover key");
console.log(dataKey);

const shards = [{
    "x": "1",
    "y": "235809344d6b3db5aaa6e2b241af30d91eb044e292c46989aa982d1e874e73a139acad34d687324d45f1db1e7fef05bae6dc0fcc952a81272663f7661ce41e6d"
},
{
    "x": "2",
    "y": "2b1982a00a5ce6e833af51c4d430afb2ce07cc0b6e0875c169de327bea42ba800859ca0bb5bd40c86ead5f72134366c0744a23d5574b8de39e7db33087f27084"
},
{
    "x": "3",
    "y": "17446c4336d4fb979b194d37b7847c8d0e06957a91cc24a73dd2101828dcd49cb139a8b625052d75408fe381a3faa878ce673ff6402ec84276d21ec4bc14380d"
}
];
const recoveryKey = "310756720086045193247648006154829256128884437790578890567126998512241573546916978024643384399541455987109763708185126385728270132062406241012282796309201";
const data = "sweta here";

const signedData = mpc.sign(data, shards, recoveryKey);
console.log("Sign transaction");
console.log(signedData);