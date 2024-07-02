const bigInt = require('big-integer');
const crypto = require('crypto');
const ethCrypto = require('eth-crypto');

const numShares = 3;
const threshold = 3;

function generatePrime(bits) {
    let prime;
    do {
        prime = bigInt(crypto.randomBytes(bits).toString('hex'), 16);
    } while (!prime.isPrime());
    return prime;
}

// Function to generate random coefficients for the polynomial
function generateCoefficients(secret, numShares, prime) {
    const coefficients = [bigInt(secret, 16)];
    for (let i = 1; i < numShares; i++) {
        coefficients.push(bigInt.randBetween(1, prime));
    }
    return coefficients;
}

// Function to evaluate the polynomial at a given x
function evaluatePolynomial(coefficients, x, prime) {
    let result = bigInt(0);
    for (let i = 0; i < coefficients.length; i++) {
        result = result.add(coefficients[i].multiply(x.modPow(bigInt(i), prime)).mod(prime)).mod(prime);
    }
    return result;
}

// Function to reconstruct the secret from a subset of shares
function reconstructSecret(shards, recoveryKey) {
    let secret = bigInt(0);
    for (let i = 0; i < shards.length; i++) {
        let term = bigInt(shards[i].y, 16);
        for (let j = 0; j < shards.length; j++) {
            if (i !== j) {
                const xj = bigInt(shards[j].x, 10);
                const xi = bigInt(shards[i].x, 10);
                term = term.multiply(xj).multiply(xj.minus(xi).modInv(recoveryKey)).mod(recoveryKey);
            }
        }
        secret = secret.add(term).mod(recoveryKey);
    }
    return secret.toString(16);
}
const generate = () => {
        const mpcIdentity = ethCrypto.createIdentity();
        const address = mpcIdentity.address;
        const publickey = mpcIdentity.publicKey;
        const secretKeyWithPrefix = mpcIdentity.privateKey;
        const secretKey = secretKeyWithPrefix.startsWith('0x') ? secretKeyWithPrefix.slice(2) : secretKeyWithPrefix;
        if (!secretKey || !numShares || !threshold) {
            return 'Missing required parameters';
        }
        if (!/^([a-fA-F0-9]+)$/.test(secretKey)) {
            return 'Invalid secretKey. Ensure it is a valid hexadecimal string.';
        }

        const primeBits = 64;
        const prime = generatePrime(primeBits);
        const coefficients = generateCoefficients(secretKey, threshold, prime);
        const shares = [];

        for (let i = 1; i <= numShares; i++) {
            const x = bigInt(i);
            const y = evaluatePolynomial(coefficients, x, prime);
            shares.push({
                x: x.toString(10),
                y: y.toString(16)
            });
        }
        return {
            MPC: address,
            shards: shares,
            recoveryKey: prime.toString()
        };

    }

    const sign = (data, shards, recoveryKey) =>{
        if (!shards || !Array.isArray(shards) || shards.length < threshold) {
            throw new Error('Invalid or insufficient shares provided.');
        }
        if (!recoveryKey || typeof recoveryKey !== 'string') {
            throw new Error('Invalid prime value.');
        }
        const privateKey = `0x${reconstructSecret(shards, bigInt(recoveryKey))}`;
        const dataHash = ethCrypto.hash.keccak256(data);
        const signature = ethCrypto.sign(privateKey,
            dataHash
        );
        return {"signature":signature};
    }

module.exports = {generate, sign};