const fs = require('fs');
const saveFile = (file, entityName, fieldName, title) => {
    let dir = `.\\files\\${entityName}\\${fieldName}`;
    if (!fs.existsSync(dir))
        fs.mkdir(dir, { recursive: true }, e => {
            if (e)
                console.error(e);
        });

    let fileName = `${dir}\\${title}.${file.name.substr(file.name.lastIndexOf('.') + 1)}`
    //console.log(fileName);
    fs.writeFileSync(fileName, file.data);
    return (fileName);
}

const queryGen = (name, type, row) => {
    if (type == 'insert') {
        let insertQuery = `INSERT INTO public.${name}(`, insertValues = '';
        Object.keys(row).forEach(key => {
            if (row[key] && !key.startsWith('f_')) {
                insertQuery += key + ',';
                if (typeof (row[key] == 'number') || typeof (row[key] == 'boolean'))
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
            if (row[key] && !key.startsWith('f_')) {

                if (typeof (row[key] == 'number') || typeof (row[key] == 'boolean'))
                    updateQuery += row[key] + "=${req.body." + row[key] + "},";
                else {
                    updateQuery += row[key] + "='${req.body." + row[key] + "}',";
                }
            }
        })
        updateQuery = updateQuery.slice(0, -1);
        updateQuery = updateQuery + ' WHERE  id=${req.body.id}'
        return updateQuery;
    }
}
module.exports = {
    saveFile,
    queryGen
}