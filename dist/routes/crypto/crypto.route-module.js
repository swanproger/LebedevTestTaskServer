"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptoRoute = void 0;
const common_1 = require("../../common");
const tronweb_1 = require("tronweb");
const utils_1 = require("tronweb/utils");
const contractAddress = {
    usdt: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
};
const wallet1 = "TD3FP2dPhWzF71RqYURuKxPY86QKYdN1tR";
const wallet2 = "TFtAPFEyCK6Bjn6NfLzoyjfm1RrXH86t8e";
const wallet1Secret = "3f1aa623e2458421a6604b20cdb50820ce9e796c633b3a2164ccdcdf89f62d95a";
const wallet2Secret = "64eeae9f184726c4c18e3a1f6ff80c774ae4f9f0ac6fa5da80f106667f4f4ea6";
const testNetwork = "https://api.shasta.trongrid.io";
const tronNetwork = "https://api.trongrid.io";
const useTestNetwork = false;
const tronWeb = new tronweb_1.TronWeb({
    fullHost: useTestNetwork ? testNetwork : tronNetwork,
    solidityNode: useTestNetwork ? testNetwork : tronNetwork,
    eventServer: useTestNetwork ? testNetwork : tronNetwork,
    privateKey: wallet1Secret,
});
function send500Error(error, res) {
    console.log(error);
    res.status(500).send({ result: null, error: "Server Error" });
}
const cryptoRoute = (app) => {
    const domain = `/api/${common_1.API_V1}/crypto`;
    app.get(`${domain}/balance`, common_1.authenticateToken, (req, res) => {
        const { wallet } = req.query;
        if (!wallet) {
            res.status(400).send({
                result: null,
                error: "Укажите адрес кошелька",
            });
        }
        if ((0, utils_1.isString)(wallet)) {
            tronWeb.trx
                .getContract(contractAddress.usdt)
                .then((result) => tronWeb.contract(result.abi.entrys, contractAddress.usdt))
                //@ts-ignore
                .then(contract => contract.balanceOf(wallet).call())
                .then((result) => tronWeb.trx.getBalance(wallet).then(balance => {
                res.status(200).send({
                    result: {
                        balance: {
                            usdt: tronWeb.fromSun(tronWeb.toDecimal(result)),
                            trx: tronWeb.fromSun(tronWeb.toDecimal(balance)),
                        },
                    },
                    error: null,
                });
            }))
                .catch(e => {
                send500Error(e, res);
            });
        }
    });
    app.get(`${domain}/energy`, common_1.authenticateToken, (req, res) => {
        const functionSelector = "transfer(address,uint256)";
        const parameter = [
            { type: "address", value: wallet2 },
            { type: "uint256", value: 1 },
        ];
        tronWeb.transactionBuilder
            .triggerConstantContract(contractAddress.usdt, functionSelector, {}, parameter, wallet1)
            /* .then(tx => {
                return tronWeb.trx.sign(tx.transaction);
            }) */
            /* .then(signedTx => {
                return tronWeb.trx.sendRawTransaction(signedTx);
            }) */
            .then(result => {
            tronWeb.trx.getEnergyPrices().then(prices => {
                res.status(200).send({ prices, result });
            });
        })
            .catch(e => {
            send500Error(e, res);
        });
    });
    app.get(`${domain}/account`, common_1.authenticateToken, (req, res) => {
        // TC6uxzYAQUEzr4xp2uWTesiRCeuiUtnx8F
        // private 3FBE222DF88CDDC9D156D8EE29AB8DE7D6D0DA98CECB2CAE7F91915822AAE98B
        // public 04C4879721FB01C4F38A96AE8B624D3AE72C829E8288CD9A5D081A62A5EC49C5DB65454DEC0A855D1C59359641EAD1BE652D6814A4CEAB5ADA440B29723D93E6AA
        tronWeb.createAccount()
            .then(result => {
            res.status(200).send(result);
        })
            .catch(e => {
            console.log(e);
        });
        /* tronWeb.trx
            .getAccount("TD3FP2dPhWzF71RqYURuKxPY86QKYdN1tR")
            .then(result => {
                res.status(200).send(result);
            })
            .catch(e => {
                console.log(e);
            }); */
    });
    app.get(`${domain}/send`, (req, res) => {
        //tronWeb.transactionBuilder();
    });
};
exports.cryptoRoute = cryptoRoute;
