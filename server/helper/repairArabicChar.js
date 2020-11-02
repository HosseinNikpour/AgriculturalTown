const pool = require('../db/pool');

//update public.baseinfo set title=REPLACE(title,'ي',N'ی')

let query2 = `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'`;
pool.query(query2).then((results2) => {
    results2.rows.forEach(el => {


        let tableName = el.table_name.toLowerCase();// 'baseinfo'.toLowerCase();
        let query = `SELECT column_name  FROM information_schema.columns WHERE table_schema = 'public' AND table_name   = '${tableName}' and data_type='character varying' `;


        pool.query(query).then((results) => {
            //  console.log(results.rows);
            let cols = results.rows;
            //let c = cols.map(a => a.column_name).toString();

            // let query2 = `SELECT ${c}  FROM public.${tableName} `
            // pool.query(query2).then((results2) => {
            //     let rows = results2.rows;
            //     rows.forEach(r => {
            //         cols.forEach(c => {
            //             if (r[c.column_name])
            //                 if (r[c.column_name].indexOf('ي') > -1||r[c.column_name].indexOf('ك') > -1)
            //                     console.log(c, r[c.column_name]);
            //         });
            //     });
            // }).catch((err) => {
            //     console.log(err.message)
            // });
            let q = `UPDATE public.${tableName} set `;
            cols.forEach(e => {
                if (!e.column_name.startsWith('file_'))
                    q += `${e.column_name}=REPLACE(REPLACE(${e.column_name},'ي','ی'),'ك','ک'),`
            });
            q = q.slice(0, -1);
            console.log(q)

        }).catch((err) => {
            console.log(err.message)
        });
    });
}).catch((err) => {
    console.log(err.message)
});