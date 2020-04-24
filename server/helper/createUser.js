var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const pool = require('../db/pool');

function genPass(len) {
    len = len ? len : 8;
    let string = "abcdefghijklmnopqrstuvwxyz";
    let stringU = "abcdefghijklmnopqrstuvwxyz".toUpperCase();
    let numeric = '0123456789';
    let punctuation = '!@#$%';

    let entity = [string, stringU, numeric, punctuation];
    let password = [];

    for (let i = 0; i < len; i++) {
        let x = Math.floor(Math.random() * 4);
        password.push(entity[x][Math.ceil(entity[x].length * Math.random() * Math.random())]);
    }
    return password.join('').toString();

}

var Excel = require('exceljs');
var workbook = new Excel.Workbook();
workbook.xlsx.readFile('USER990203.xlsx').then(a => {

    var worksheet = workbook.getWorksheet('admin');
    let query = 'INSERT INTO public.user( username, name, password,role) values '
    worksheet.eachRow(function (row, rowNumber) {
     if (rowNumber !== 1) {
            let name = row.getCell(1).value + " " + row.getCell(2).value;
            let username = row.getCell(3).value.toLowerCase();
           // let pass = genPass();
            let password ='123';// bcrypt.hashSync('123', salt);
            query += `('${username}', '${name}', '${password}','admin'),`;
           // row.getCell(4).value = pass;
       }

    });
 worksheet = workbook.getWorksheet('M');

    worksheet.eachRow(function (row, rowNumber) {
     if (rowNumber !== 1) {
            let name = row.getCell(2).value;
            let username = row.getCell(3).value.toLowerCase();
           // let pass = genPass();
            let password = '123';//bcrypt.hashSync('123', salt);
            query += `('${username}', '${name}', '${password}','manager'),`;
          }
    });
    worksheet = workbook.getWorksheet('Sheet1');

    worksheet.eachRow(function (row, rowNumber) {
     if (rowNumber !== 1) {
            let name = row.getCell(1).value;
            let username = row.getCell(2).value.toLowerCase();
           // let pass = genPass();
            let password ='123';// bcrypt.hashSync('123', salt);
            query += `('${username}', '${name}', '${password}','contractor'),`;
          }
    });
query=query.slice(0,-1);

//console.log (query);
    pool.query(query)
                .then((results) => {
                   console.log(results.rows);
                })
                .catch((err) => {
                   console.log({ type: "Error", message: err.message })
                });

    // workbook.xlsx.writeFile('USER990124_Filled.xlsx').then(function () {
        console.log('file saved');
    // });
 });


 