const { PublicKey, PrivateKey } = require('babyjubjub');
const { ZKPGenerator } = require('./zkpGenerator.js');
const Circomlib = require('circomlibjs');

Circomlib.buildPoseidon

const fs = require('fs');
 
//get PrivateKey object(field, hexstring)
let sk = PrivateKey.getRandObj().field;
//get PrivateKey object from field(or hexstring)
let privKey = new PrivateKey(sk);
//get PublicKey object from privateKey object
let pubKey = PublicKey.fromPrivate(privKey);
 
console.log(BigInt(sk.n.toFixed()).toString());

const witness = {
    x: BigInt(pubKey.p.x.n.toFixed()).toString(),
    y: BigInt(pubKey.p.y.n.toFixed()).toString(),
}

const zkpGenerator = new ZKPGenerator("poseidonPK.circom", "poseidonPK");

async function ejecutarZKP() {
    const proofGenerated = await zkpGenerator.proofGenerator([["x", witness.x], ["y", witness.y]]);
    const result = await zkpGenerator.proofVerifier(proofGenerated.publicSignals, proofGenerated.proof);

    const poseidon = await Circomlib.buildPoseidon();
    let poseidonHash = poseidon.F.toString(poseidon([witness.x, witness.y]));
  
    if(result){
        console.log("Generated poseidon hash: ", poseidonHash);
        console.log("★ The proof is valid ~R: ", proofGenerated.publicSignals.toString());
    }
  }
  
  ejecutarZKP();