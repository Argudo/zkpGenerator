import * as snarkjs from 'snarkjs';
import { exec, execSync } from 'child_process';
import * as fs from 'fs';

class ZKPGenerator{
    urlCircuit: string;
    nameCircuit: string;

    constructor(urlCircuit: string, nameCircuit: string){
        this.urlCircuit = urlCircuit;
        this.circuitCompiler(urlCircuit);
        this.nameCircuit = nameCircuit;
    }

    private circuitCompiler(urlCircuit:string){
        execSync(`mkdir compiledCircuit && cd compiledCircuit && circom ../${urlCircuit} --r1cs --wasm --sym --c`);
    }

    private tauGenerator(){
        execSync(`copy powersOfTau28_hez_final_12.ptau compiledCircuit\\powersOfTau28_hez_final_12.ptau`);
    }

    private keyGenerator(){
        execSync(`cd compiledCircuit && npx snarkjs groth16 setup circuit.r1cs powersOfTau28_hez_final_12.ptau circuit_0000.zkey`)
        execSync(`cd compiledCircuit && npx snarkjs zkey export verificationkey circuit_0000.zkey verification_key.json`)
    }

    public async proofGenerator(inputs : Array<[string, any]>){
        await this.tauGenerator();
        await this.keyGenerator();
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            this.buildObject(inputs), 
            "compiledCircuit/circuit_js/" + this.nameCircuit + ".wasm", 
            "compiledCircuit/circuit_0000.zkey");
          console.log(publicSignals);
          console.log(proof);
          return { proof, publicSignals };
    }

    public async proofVerifier(publicInputs : snarkjs.PublicSignals, proof : any){
        const vKeyBuffer = fs.readFileSync("compiledCircuit/verification_key.json");
        const vKeyString = vKeyBuffer.toString();
        const vKey = JSON.parse(vKeyString);

        const res = await snarkjs.groth16.verify(vKey, publicInputs, proof);
        return res;
    }

    private buildObject(inputs: Array<[string, any]>): Record<string, any> {
        const objetoConstruido: Record<string, any> = {};
      
        for (const [clave, valor] of inputs) {
          objetoConstruido[clave] = valor;
        }
      
        return objetoConstruido;
      }
}   

export default ZKPGenerator;