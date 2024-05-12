# currency API
currency rate vs RUB API and frontend using React
It is necessary to implement a service with the following functionality in NODE JS using the REACT framework.
The MySQL database must have a currency table with the following columns:
id - primary key
name — name of the currency
rate — exchange rate to ruble
There should be a console command to update the data in the currency table. Data on exchange rates can be taken from here: http://www.cbr.ru/scripts/XML_daily.asp
Implement 2 REST API methods:
GET /currencies - should return a list of currency rates with the ability to paginate
GET /currency/ - should return the currency rate for the passed id
The API must be closed with bearer authorization.
Additional requirement:
1. The history of exchange rates must be for every day, without omissions.
2. need to be added or changed so that the service can withstand 1500 requests per second

# setup
npm init
npm install express
npm install mysql2
npm install express-rate-limit
npm install monitor
npm install node-cache
npm install nodemon
npm install queue
npm install jsonwebtoken
npm install dotenv
npm install axios
npm install xml2js
npm install iconv-lite
npm install cors
npm install node-cron
npm install pm2 -g
npm install --save-dev mocha
npm install --save-dev supertest
npm install --save-dev chai

# test
npm test

# run
node ./service/fetch_cron.js
npm start