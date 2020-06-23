const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "temp_delivery";

let baseQuery=`select d.*, c.contract_no AS contract
    ,co.title as vw_company ,c.title as vw_contract_title
    FROM temp_delivery d  LEFT JOIN contract c ON d.contract_id = c.id
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
    let query = `${baseQuery} where id = ${req.params.id} `;

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
    console.log(data)
    let file_defect = files && files.file_defect ? func.saveFile(files.file_defect, name, 'file_defect', data.contract) : '';
    let file_record = files && files.file_record ? func.saveFile(files.file_record, name, 'file_record', data.contract) : '';
    let file_signification = files && files.file_signification ? func.saveFile(files.file_signification, name, 'file_signification',  data.contract) : '';
    let file_elimination_defects = files && files.file_elimination_defects ? func.saveFile(files.file_elimination_defects, name, 'file_elimination_defects',  data.contract) : '';
    data["file_elimination_defects"] = file_elimination_defects;
    data["file_defect"] = file_defect;
    data["file_record"] = file_record;
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
    console.log(data)
    let files = req.files;
    let file_defect = files && files.file_defect ? func.saveFile(files.file_defect, name, 'file_defect', data.contract) : '';
    let file_record = files && files.file_record ? func.saveFile(files.file_record, name, 'file_record', data.contract) : '';
    let file_signification = files && files.file_signification ? func.saveFile(files.file_signification, name, 'file_signification', data.contract) : '';
    let file_elimination_defects = files && files.file_elimination_defects ? func.saveFile(files.file_elimination_defects, name, 'file_elimination_defects', data.contract) : '';
    data["file_elimination_defects"] = data['file_elimination_defects'] == false ? '**d**' : file_elimination_defects;
    data["file_defect"] = data['file_defect'] == false ? '**d**' : file_defect;
    data["file_record"] = data['file_record'] == false ? '**d**' : file_record;
    data["file_signification"] = data['file_signification'] == false ? '**d**' : file_signification;

    let query = func.queryGen(name, 'update', data);
    console.log(query)
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



