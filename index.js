import readline from 'readline';
import Binance from 'node-binance-api';
import dotenv from 'dotenv';
dotenv.config();


const apikey= process.env.API_KEY;

const binance = new Binance().options({
APIKEY: '<key>',
APISECRET: '<secret>'
});

let ticker = await binance.prices();

const bi_btcusd = ticker.BTCUSDT

const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

readInterface.question("Input Currency > ", async function (currency) {

    currency = currency.toUpperCase();

    try {
        const exchangerateResult = await exchangerate(currency); // Call exchangerate function

        async function exchangerate(currency) {
            const myHeaders = new Headers();
            myHeaders.append("apikey", apikey);
        
            const requestOptions = {
                method: 'GET',
                redirect: 'follow',
                headers: myHeaders
            };
        
            const information = await fetch("https://api.apilayer.com/fixer/convert?to=" + currency + "&from=USD&amount=1", requestOptions);
        
            const response = await information.json();
            return response.result;
        }
        
        console.log(`1 USD = ${exchangerateResult} ${currency}`);

        async function get_luno() {
            const res = await fetch("https://api.luno.com/api/1/ticker?pair=XBT" + currency );
            // fetch can　get API from Luno
            // console.log(res); // => Response
    
            const b = await res.json();
            // console.log(b.last_trade); // Response => json and only get last_trade data
            return b.last_trade; //then, return last trade
        }
        const getLuno = await get_luno();

        // Calculate using 1 USD = ○ MYR to luno MYR * ○ MYR = luno USD
        const luno_btcusd = getLuno / exchangerateResult;

        // Calculate price difference
        const difference = luno_btcusd - bi_btcusd;

        // Calculate luno premium   
        const luno_pre = (difference / bi_btcusd) * 100;


        // Display results
        if(getLuno){
            console.log("BTC-" + currency + " price on Luno:       " + currency +" "+ getLuno );
        }

        if(bi_btcusd){
            console.log("BTC-USD price on Binance:    USD " + bi_btcusd );
        }


        if(luno_btcusd){
        console.log("BTC-USD price on Luno:       USD " + luno_btcusd );
        }

        if(getLuno){
            console.log("Price Difference:            USD " + difference.toFixed(2) );
            console.log("Luno Premium:                " + luno_pre.toFixed(2)  + "%");
        }


    } catch (error) {
        console.error("Cannot catch currency information", error);
    }

    readInterface.close();
});

