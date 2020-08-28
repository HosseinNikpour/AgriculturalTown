const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const reports = require('./statics');
const ExcelJS = require('exceljs');

router.get(`/`, function (req, res) {
  //  console.log("1");
    let query = reports.queries.find(a => a.key === req.query.reportId).query;
//console.log(query);
    pool.query(query).then((results) => {

        var workbook = new ExcelJS.Workbook();
        workbook.xlsx.readFile(`excels/${req.query.reportId}.xlsx`).then(function () {
            
            var ws = workbook.getWorksheet('data');
            for (const d of results.rows) {
                const row = ws.addRow(Object.values(d));
            }
            let filePath=`Docs/tempReport/${req.query.reportId}-${new Date().getTime()}.xlsx`
            workbook.xlsx.writeFile(filePath);
            return res.send(filePath);
        })
    })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});

module.exports = router;