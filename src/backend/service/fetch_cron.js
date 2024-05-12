const axios = require('axios');
const xml2js = require('xml2js');
const iconv = require('iconv-lite');
const parser = new xml2js.Parser();
const cron = require('node-cron');
const pool = require('./../db/currency');
const util = require('util');

function convertDateFormat(dateString) {
    const parts = dateString.split('.');
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

function convertCommaToDot(numberString) {
    // Replace commas with dots
    return numberString.replace(/,/, '.');
}

// Promisify for Node.js async/await.
pool.getConnection = util.promisify(pool.getConnection);

// Function to fetch and update currency rates
async function fetchAndUpdateRates() {
    axios({
            method: 'get',
            url: 'http://www.cbr.ru/scripts/XML_daily.asp',
            responseType: 'arraybuffer'
        }).then(response => {
            const xmlData = iconv.decode(response.data, 'windows-1251');
            parser.parseString(xmlData, (err, result) => {
                if (err) {
                    console.error('Error parsing XML:', err);
                } else {
                    if (result.ValCurs && result.ValCurs.Valute){
                        const date = convertDateFormat(result.ValCurs['$']['Date']);
                        console.log(new Date(), date, result.ValCurs.Valute.length);

                        insertHistorySql = "INSERT INTO history_rate_vs_rub VALUES ";
                        insertCurSql = "INSERT INTO cur_rate_vs_rub VALUES ";
                        
                        isFirst = true;
                        result.ValCurs.Valute.forEach(element => {
                            const code = element['CharCode'][0];
                            const name = element['Name'][0];
                            const rate = convertCommaToDot(element['VunitRate'][0]);
                            if (isFirst)
                                isFirst = false;
                            else {
                                insertHistorySql += ",";
                                insertCurSql += ",";
                            }

                            insertHistorySql += `('${code}', '${date}', ${rate}) `;
                            insertCurSql += `('${code}', '${name}', ${rate}) `;
                        });
                        if (!isFirst){
                            pool.query(insertHistorySql);
                            pool.query("DELETE FROM cur_rate_vs_rub");
                            pool.query(insertCurSql);
                        }
                    }
                }
            });
        }).catch(error => {
            console.error('Error fetching XML:', error);
            setTimeout(fetchAndUpdateRates, 30 * 60 * 1000);
    });
    // const response = await axios.get('http://www.cbr.ru/scripts/XML_daily.asp');
    // const result = await parser.parseStringPromise(response.data);
    // // Process the result and update your database
    // if (result.ValCurs && result.ValCurs.Valute && result.ValCurs.Valute.length){
    //     console.log(result.ValCurs.Valute);
    //     return result.ValCurs.Valute.length;
    // }
}
  
function scheduleTask() {
    // Schedule the task for 00:01 every day
    cron.schedule('1 0 * * *', fetchAndUpdateRates, {
        scheduled: true,
        timezone: "Europe/Moscow"
    });
}
  
// Initial scheduling
scheduleTask();

// Start the script immediately if needed
// fetchAndUpdateRates();

module.exports = {
    fetchAndUpdateRates
};
