const pool = require('../db/poolMain');
const moment = require('moment-jalaali')

let query = `INSERT INTO public.period(title, start_date, end_date, month)
    VALUES `

let arr = [], i = 1;
let dt = moment('1398/01/03', 'jYYYY/jMM/jDD');
while (dt.isBefore(moment('1401/01/01', 'jYYYY/jMM/jDD'))) {
    let s=dt;
    let e=moment(dt).add(6, "days");
    query += `('${i} :  ${s.format('jYYYY/jMM/jDD')} الی ${e.format('jYYYY/jMM/jDD')}','${s.toDate().toLocaleString()}','${e.toDate().toLocaleString()}','${s.format("jYYjMM")}'),`
   //   arr.push({ title: `دوره شماره ${i}`, month:dt.format('jYYjMM') ,start_date: dt.toDate(), end_date: dt.add(7, 'days').toDate() })
    i++;
    dt.add(7, "days");
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
