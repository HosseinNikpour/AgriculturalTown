const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const reports = require('./statics');
const reportWeb = require('./staticsWeb');
const ExcelJS = require('exceljs');

router.get(`/excels`, function (req, res) {
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
            let filePath = `Docs/tempReport/${req.query.reportId}-${new Date().getTime()}.xlsx`
            workbook.xlsx.writeFile(filePath).then((a) => {
                return res.send(filePath.substring(5));
            })
        })
    }).catch((err) => {
        return res.send({ type: "Error pool", message: err.message })
    });
});

router.get(`/webs`, function (req, res) {
    console.log(req.query.reportParmas);
    let rpt = reportWeb.queries.find(a => a.key === req.query.reportId);
    let query = rpt.query;
    if (req.query.reportFilter)
        query += req.query.reportFilter;

    // if(req.query.reportParmas)
    // {
    //     let f=rpt.filter;
    //     req.query.reportParmas.forEach(a=>{
    //         let x=JSON.parse(a);
    //        f= f.replace(x[0],x[1]);
    //     })

    //     query+=f;
    // }
    console.log(query);
    pool.query(query).then((results) => {
        return res.send(results.rows);
    }).catch((err) => {
        return res.send({ type: "Error", message: err.message })
    });
});

module.exports = router;