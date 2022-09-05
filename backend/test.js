
const EthCrypto = require('eth-crypto');
const { ethers, Wallet } = require('ethers');


async function main() {
    // let randomWallet = ethers.Wallet.createRandom();

    // console.log(randomWallet.mnemonic.phrase);
    // return;
    const wallet = new Wallet.fromMnemonic("symptom famous spring flip crack illness always front february arctic narrow twenty");
    const address = wallet.address;
    const bigPublicKey = EthCrypto.publicKeyByPrivateKey(
        wallet.privateKey
    );

    console.log(EthCrypto.createIdentity().publicKey)

    const privateKey = wallet.privateKey;

    
    console.log("address: ", wallet.address);
    console.log('mnemonic:', wallet.mnemonic.phrase);
    console.log('privateKey:', wallet.privateKey);
    console.log('bigPublicKey', bigPublicKey);

    console.log("----------------------------------------------------------");
    const shortPublicKey = EthCrypto.publicKey.compress(bigPublicKey);
    console.log("shortPublicKey: ", shortPublicKey);
    const publicKey = EthCrypto.publicKey.decompress(shortPublicKey);
    console.log('public key:',publicKey)
    console.log("address: ", address);

    const secretMessage = 'My name is Satoshi Buterin';
    console.log("Real Public Key", publicKey);


    const encrypted = await EthCrypto.encryptWithPublicKey(
        publicKey, // encrypt with alice's publicKey
        secretMessage
    );
    const decrypted = await EthCrypto.decryptWithPrivateKey(
        privateKey,
        encrypted
    );
    console.log("encrypted: ", encrypted)
    console.log("decrypted: ", decrypted)
    if (decrypted === secretMessage) console.log('success')

}

main().then(() => process.exit(0)).catch((err) => console.error(err));
