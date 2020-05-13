const pool = require('../db/pool');
const moment = require('moment-jalaali')

let query = `INSERT INTO public.period(title, start_date, end_date, month)
    VALUES `

let arr = [], i = 1;
let dt = moment('1399/03/07', 'jYYYY/jMM/jDD');
while (dt.isBefore(moment('1400/01/01', 'jYYYY/jMM/jDD'))) {
    query += `('دوره شماره ${i}','${dt.toDate().toLocaleString()}','${dt.add(6, "days").toDate().toLocaleString()}','${dt.format("jYYjMM")}'),`
   //   arr.push({ title: `دوره شماره ${i}`, month:dt.format('jYYjMM') ,start_date: dt.toDate(), end_date: dt.add(7, 'days').toDate() })
    i++;
    dt.add(1, "days");
}

query = query.slice(0, -1);
console.log(arr.length)

console.log(query)
pool.query(query)
    .then((results) => {
       console.log(results.rows);
    }).catch((err) => {
        console.log( err.message )
    });
