const pool = require('../db/pool');
const fs = require('fs');
const path = require('path');

let filesField = [{ table: 'town', field: 'file_dxf' }, { table: 'town', field: 'file_kmz' }
]

let query = '';
filesField.forEach(f => {
    query += `select ${f.field} from ${f.table} UNION `
});
query = query.slice(0, -6);
console.log(query);
let arr1 = [];
//مواردی که آدرس فایل در سیستم دارند ولی فایل موجود نیست
pool.query(query)
    .then((results) => {
        arr1 = results.rows;
        console.log(results)
        let ext_file_list = recFindByExt('../files', '*')

        console.log(ext_file_list);
        console.log(arr1);
    })
    .catch((err) => {
        console.log(err.message)
    });

function recFindByExt(base, ext, files, result) {
    files = files || fs.readdirSync(base)
    result = result || []

    files.forEach(
        function (file) {
            var newbase = path.join(base, file)
            if (fs.statSync(newbase).isDirectory()) {
                result = recFindByExt(newbase, ext, fs.readdirSync(newbase), result)
            }
            else {

                if (ext == '*' || file.substr(-1 * (ext.length + 1)) == '.' + ext) {
                    result.push(newbase);
                }
            }
        }
    )
    return result
}

