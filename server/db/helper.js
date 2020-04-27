const pool = require('./pool');
var Excel = require('exceljs');

pool.on('connect', () => {
    console.log('connected to the db');
});


// String.prototype.toPascalCase = function () {
//     return this.match(/[a-z]+/gi)
//         .map(function (word) {
//             return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
//         })
//         .join('')
// }

const createQueries = (table_name) => {
    const Query = `SELECT *
    FROM information_schema.columns
   WHERE table_schema = 'public'  AND table_name   = '${table_name}'`;

    pool.query(Query)
        .then((res) => {
            //console.log(res.rows[1]);
            //console.log(res.rows[4]);
            let insertQuery = 'INSERT INTO public.${name}(', insertValues = '',
                updateQuery = 'UPDATE public.${name} SET ', emptyObj = '', gridColumn = '';
            res.rows.forEach(e => {
                //  console.log(e.column_name + '     ' + e.udt_name);
                if (e.column_name != 'id') {
                    insertQuery += e.column_name + ',';
                    emptyObj += `${e.column_name} : '' ,`;
                    gridColumn += ` { dataIndex: '${e.column_name}',key: '${e.column_name}', title: '${e.column_name}' },`;

                    if (e.udt_name == 'varchar' || e.udt_name == 'date' || e.udt_name == 'timestamptz') {
                        insertValues += "'${req.body." + e.column_name + "}',";
                        updateQuery += e.column_name + "='${req.body." + e.column_name + "}',";
                    }
                    else if (e.udt_name.indexOf('_') == 0) {
                        insertValues += "'{${req.body." + e.column_name + "}}',";
                        updateQuery += e.column_name + "='{${req.body." + e.column_name + "}}',";
                    }
                    else {
                        insertValues += "${req.body." + e.column_name + "},";
                        updateQuery += e.column_name + '=${req.body.' + e.column_name + '},';
                    }

                }
            });

            insertQuery = insertQuery.slice(0, -1) + ") ";
            insertValues = insertValues.slice(0, -1);
            updateQuery = updateQuery.slice(0, -1);

            insertQuery = insertQuery + ' Values(' + insertValues + ')';
            // console.log("insertQuery");
            // console.log(insertQuery);
            // updateQuery = updateQuery + ' WHERE  id=${req.body.id}'
            // console.log("updateQuery");
            // console.log(updateQuery);
            console.log("emptyObj");
            console.log(emptyObj);
            console.log("gridColumn");
            console.log(gridColumn);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

createQueries('operation');

