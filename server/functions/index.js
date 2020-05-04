const fs = require('fs');
const saveFile = (file, entityName, fieldName, title) => {
    let dir = `.\\Docs\\files\\${entityName}\\${fieldName}`;
    if (!fs.existsSync(dir))
        fs.mkdir(dir, { recursive: true }, e => {
            if (e)
                console.error(e);
        });

    let fileName = `${dir}\\${title}.${file.name.substr(file.name.lastIndexOf('.') + 1)}`
    //console.log(fileName);
    fs.writeFileSync(fileName, file.data);//, () => {
    return (fileName.replace('.\\Docs', ''));
    //  });

}

const queryGen = (name, type, row) => {
//   console.log('****************');
//     console.log(row);
//     console.log('****************');
    Object.keys(row).forEach(key => {
        if (key.endsWith('_id')) {
            let x = key.replace('_id', '');
            if (row[x]) delete row[x];
        }

    });
  
    if (type == 'insert') {
        let insertQuery = `INSERT INTO public.${name}(`, insertValues = '';
        Object.keys(row).forEach(key => {
            if (row[key] && !key.startsWith('f_')) {
                insertQuery += key + ',';
                // console.log(typeof (row[key]));
                if (typeof (row[key]) == 'number' || typeof (row[key]) == 'boolean')
                    insertValues += `${row[key]},`;
                else {

                    insertValues += `'${row[key]}',`
                }
            }
        })

        insertQuery = insertQuery.slice(0, -1) + ") ";
        insertValues = insertValues.slice(0, -1);
        insertQuery = insertQuery + ' Values(' + insertValues + ')';
        return insertQuery;
    }
    else if (type == 'update') {
        updateQuery = `UPDATE public.${name} SET `
        Object.keys(row).forEach(key => {
            if (row[key] && !key.startsWith('f_') && key != 'id') {

                if (typeof (row[key]) == 'number' || typeof (row[key]) == 'boolean')
                    updateQuery += `${key} =${row[key]},`;
                else {
                    if (row[key] === '**d**')
                        updateQuery += `${key} = null,`;
                    else
                        updateQuery += `${key} ='${row[key]}',`;
                }
            }
        })
        updateQuery = updateQuery.slice(0, -1);
        updateQuery = updateQuery + ` WHERE  id=${row['id']}`
        return updateQuery;
    }
}
module.exports = {
    saveFile,
    queryGen
}