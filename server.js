var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
require('dotenv').config()
const key          = process.env.API_KEY; // API Key
const secret       = process.env.PRIVATE_KEY; // API Private Key
const WCI_KEY      = process.env.WCI_KEY;
const KrakenClient = require('kraken-api');
const kraken       = new KrakenClient(key, secret);
const sheet        = process.env.SHEET_ID;
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Sheets API.
  // Display user's balance

  // Get Ticker Info

  authorize(JSON.parse(content), main);
});
let alphabet = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function main(auth){
  setInterval(function(){
  releaseTheKraken('XBTUSD,XBTEUR,XBTCAD,ETHUSD,ETHEUR,ETHCAD,ETHXBT,LTCUSD,LTCEUR,LTCXBT,DASHUSD,DASHEUR,DASHXBT,REPETH,REPEUR,REPXBT,EOSETH,EOSXBT,GNOETH,GNOXBT,XLMXBT').then((function (r){
    //console.log(r.result);
    let values = [];
    for(let x in r.result){
      //console.log(x);
      values.push(formatData(r.result[x],x));
    }
    printresult(auth,"A2:D30",{values:values});
    //console.log(formatData(r.result));
    //printresult(auth,'B2:D10',formatData(r[0]));
  }));
  },5000);
  setInterval(function(){getWCI(auth)},12000);
}
function getWCI(auth){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            console.log(xmlHttp.responeText);
    }
    xmlHttp.open("GET", "", true); // true for asynchronous
    xmlHttp.send(null);


}
function formatData(data,name){
  let values =
    [name,data.c[0],data.a[0],data.b[0]]
  return values;
}
function releaseTheKraken(pair){
  return new Promise((resolve,reject)=>{
    kraken.api('Ticker',{pair:pair}).then((function(result){
      resolve(result);
    })).catch(function(err){
      reject(err);
    });
  });
}


function printresult(auth,rangestr,body) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.update({
    auth: auth,
    spreadsheetId:sheet,
    range: rangestr,
    valueInputOption:'USER_ENTERED',
    resource:body
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log(response);
  });
}

 //Template Function
/*function printresult(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.update({
    auth: auth,
    spreadsheetId:sheet,
    range: 'A1:C3',
    valueInputOption:'RAW',
    resource: {
      "values":[[5],[4],[3]]
    },
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    console.log(response);
  });
}*/
