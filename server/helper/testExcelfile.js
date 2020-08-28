
let reportId = '';
let query = reports.queries.find(a => a.key === reportId).query;
//console.log(query);
pool.query(query).then((results) => {

    var workbook = new ExcelJS.Workbook();
    workbook.xlsx.readFile(`excels/${req.query.reportId}.xlsx`).then(function () {

        var ws = workbook.getWorksheet('data');
        for (const d of results.rows) {
            const row = ws.addRow(Object.values(d));
        }
        let filePath = `Docs/tempReport/${req.query.reportId}-${new Date().getTime()}.xlsx`
        workbook.xlsx.writeFile(filePath);
        //  return res.send(filePath);
        console.log(filePath);
    })
})