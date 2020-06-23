const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "project_cycle";

let baseQuery=`SELECT w.*,  p.title AS period,b.title AS status,c.contract_no AS contract
    ,co.title as vw_company ,c.title as vw_contract_title
    FROM project_cycle w  LEFT JOIN period p ON w.period_id = p.id
                          LEFT JOIN agreement c ON w.contract_id = c.id
                          LEFT JOIN baseinfo b ON w.state_id = b.id  
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
   
    let file_record = files && files.file_record ? func.saveFile(files.file_record, name, 'file_record', data.title) : '';
    data["file_record"] = file_record;
    // console.log(data);
    let query = func.queryGen(name, 'insert', data);

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
    let file_record = files && files.file_record ? func.saveFile(files.file_record, name, 'file_record', data.title) : '';
       data["file_record"] = data['file_record'] == false ? '**d**' : file_record;

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



