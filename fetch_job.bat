@REM npm install pm2 -g
pm2 start ./service/fetch_cron.js --name currency-updater
pm2 save
