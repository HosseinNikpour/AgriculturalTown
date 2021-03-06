const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "extension";

let baseQuery = `SELECT e.*,b.title AS no ,type_id
                    ,case type_id when 1 then c.contract_no else a.contract_no end contract
                    ,case type_id when 1 then co.title else co1.title end vw_company
                    ,case type_id when 1 then c.title else a.title end vw_contract_title
            FROM extension e LEFT JOIN contract c ON e.contract_id = c.id
                    LEFT JOIN agreement a ON e.contract_id = a.id
                    LEFT JOIN baseinfo b ON e.no_id = b.id
                    left JOIN  Company as co ON c.company_id=co.id
                    left JOIN  Company as co1 ON a.company_id=co1.id `;

router.get(`/vw`, function (req, res) {
    let query = `SELECT id,type_id,end_date,contract_id
                        FROM  extension order by end_date desc`;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});

router.get(`/`, function (req, res) {
    let query = ` ${baseQuery} order by id desc  `;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/:id`, function (req, res) {
    let query = ` ${baseQuery} where id = ${req.params.id} `;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/', function (req, res) {

    let data = JSON.parse(req.body.data);
    let files = req.files;

    let file_late = files && files.file_late ? func.saveFile(files.file_late, name, 'file_late', data.contract_id + "_" + data.no_id) : '';
    let file_signification = files && files.file_signification ? func.saveFile(files.file_signification, name, 'file_signification', data.contract_id + "_" + data.no_id) : '';
    let file_plan_pdf = files && files.file_plan_pdf ? func.saveFile(files.file_plan_pdf, name, 'file_plan_pdf', data.contract_id + "_" + data.no_id) : '';
    let file_plan_msp = files && files.file_plan_msp ? func.saveFile(files.file_plan_msp, name, 'file_plan_msp', data.contract_id + "_" + data.no_id) : '';
    data["file_plan_pdf"] = file_plan_pdf;
    data["file_plan_msp"] = file_plan_msp;
    data["file_late"] = file_late;
    data["file_signification"] = file_signification;
    // console.log(data);
    let query = func.queryGen(name, 'insert', data);
    console.log(query)

    console.log(query)
    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.put('/:id', function (req, res) {
    let data = JSON.parse(req.body.data);
    let files = req.files;
    let file_late = files && files.file_late ? func.saveFile(files.file_late, name, 'file_late', data.contract_id + "_" + data.no_id) : '';
    let file_signification = files && files.file_signification ? func.saveFile(files.file_signification, name, 'file_signification', data.contract_id + "_" + data.no_id) : '';
    let file_plan_pdf = files && files.file_plan_pdf ? func.saveFile(files.file_plan_pdf, name, 'file_plan_pdf', data.contract_id + "_" + data.no_id) : '';
    let file_plan_msp = files && files.file_plan_msp ? func.saveFile(files.file_plan_msp, name, 'file_plan_msp', data.contract_id + "_" + data.no_id) : '';
    data["file_late"] = data['file_late'] == false ? '**d**' : file_late;
    data["file_signification"] = data['file_signification'] == false ? '**d**' : file_signification;
    data["file_plan_pdf"] = data['file_plan_pdf'] == false ? '**d**' : file_plan_pdf;
    data["file_plan_msp"] = data['file_plan_msp'] == false ? '**d**' : file_plan_msp;
    let query = func.queryGen(name, 'update', data);
    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.delete('/:id', function (req, res) {

    console.log(req.body);
    let query = `delete from public.${name} WHERE  id=${req.params.id};    `;
    console.log(query);
    pool.query(query)
        .then((results) => {

            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
module.exports = router;



