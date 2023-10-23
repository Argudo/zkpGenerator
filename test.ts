import ZKPGenerator from "./zkpGenerator";

const zkpGenerator = new ZKPGenerator("circuit.circom", "circuit");

async function ejecutarZKP() {
    const proofGenerated = await zkpGenerator.proofGenerator([["a", 3], ["b", 5]]);
    const result = await zkpGenerator.proofVerifier(proofGenerated.publicSignals, proofGenerated.proof);
  
    console.log(result);
  }
  
  ejecutarZKP();