const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "invoice_contractor_Approve";

let baseQuery = `select i.*, c.contract_no AS contract,b2.title AS no
    ,co.title as vw_company ,c.title as vw_contract_title,c.file_agreement as vw_file_agreement
    FROM ${name} i LEFT JOIN contract c ON i.contract_id = c.id
                                  LEFT JOIN baseinfo b2 ON i.no_id = b2.id
                                  left JOIN  Company as co ON c.company_id=co.id `;

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
    let file_letter_manager = files && files.file_letter_manager ? func.saveFile(files.file_letter_manager, name, 'file_letter_manager',data.contract_id+"_"+data.no_id) : '';
    data["file_letter_manager"] = file_letter_manager;
    let file_letter_employer = files && files.file_letter_employer ? func.saveFile(files.file_letter_employer, name, 'file_letter_employer',data.contract_id+"_"+data.no_id) : '';
    data["file_letter_employer"] = file_letter_employer;

    let query = func.queryGen(name, 'insert', data);
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
    let file_letter_manager = files && files.file_letter_manager ? func.saveFile(files.file_letter_manager, name, 'file_letter_manager',data.contract_id+"_"+data.no_id) : '';
    data["file_letter_manager"] = data['file_letter_manager'] == false ? '**d**' : file_letter_manager;
    let file_letter_employer = files && files.file_letter_employer ? func.saveFile(files.file_letter_employer, name, 'file_letter_employer', data.contract_id+"_"+data.no_id) : '';
    data["file_letter_employer"] = data['file_letter_employer'] == false ? '**d**' : file_letter_employer;


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



