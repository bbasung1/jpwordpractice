const express = require('express');
const http = require("http");
const app = express();
const server = http.createServer(app);
app.use(express.static("./"));
const cors = require("cors");
app.use(cors())
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const credentials = require('./helical-client-280809-f430362090af.json');
const serviceAccountAuth = new JWT({
  email: credentials.client_email,
  key: credentials.private_key,
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
  ],
});



async function Run() {
  const doc = new GoogleSpreadsheet('100WYx3325c2mYWE24a_2qzFk6HJsD7P36kIGp1YEcaI', serviceAccountAuth);
  await doc.loadInfo();
  console.log(doc.title);
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  let m = rows.length, t, i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    // 현재 요소와 선택한 요소를 교환
    t = rows[m];
    rows[m] = rows[i];
    rows[i] = t;
  }
  return rows.slice(0, 100).map(row => ({
    rownum: row._rowNumber,
    rowdata: row._rawData
  }));
}


app.get("/shuffle", (req, res) => {
  console.log("test")
  Run().then((test) => {
    res.json(test);
  })
})
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/main.html');
})
server.listen(9500, () => { })