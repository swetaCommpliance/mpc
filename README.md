### example
```
const mpc = require('mpc-test-crypto')
const dataKey = mpc.generate();
console.log("Generate shard and recover key");
console.log(dataKey);

const shards = [{
    "x": "1",
    "y": "<y-component>"
},
{
    "x": "2",
    "y": "<y-component>"
},
{
    "x": "3",
    "y": "<y-component>"
}
];
const recoveryKey = "recovery-key";
const data = "sweta here";

const signedData = mpc.sign(data, shards, recoveryKey);
console.log("Sign transaction");
console.log(signedData);
```