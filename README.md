# KrakenProject
A commission project to scrape info from Kraken.com and display it to a Google Sheet in real time. 

Requiremens: 
Node,Git, Google Account, and a Kraken Account. 

Step 1: Set up authaurization credentials with Google
Follow Step 1 of this guide: https://developers.google.com/sheets/api/quickstart/nodejs

Step 2: Clone or fork this repo. 

Step 3: type npm init to install all required packages. 

Step 4: Set up a .env file 

It should look something like this:

API_KEY = put your kraken api key here
PRIVATE_KEY = put your kraken private key here
SHEET_ID = put the id of the sheet you wish to modify here

You can find your Kraken API keys by logging into Kraken=>Settings=>API

Step 5: to start the server type node server.js
You will be prompted to authorize the server to modify your spreadsheet. Follow the propmts. You only need to do this once.
Afterwards it will output the result of the kraken and google api calls, and modify the targeted spreadsheet every 10 seconds. 

My Spreadsheet is here: 
https://docs.google.com/spreadsheets/d/18b6YgQ8-27aueybgRsSobrLrasjhwO55SssS20WrnCQ/edit?usp=sharing
