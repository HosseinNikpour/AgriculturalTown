const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "value_change";


let baseQuery=`select w.* , b.title AS no,type_id
,case type_id when 1 then c.contract_no else a.contract_no end contract
,case type_id when 1 then co.title else co1.title end vw_company
,case type_id when 1 then c.title else a.title end vw_contract_title
FROM value_change w LEFT JOIN contract c ON w.contract_id = c.id
                   LEFT JOIN agreement a ON w.contract_id = a.id
                   LEFT JOIN baseinfo b ON w.no_id = b.id
                   left JOIN  Company as co ON c.company_id=co.id 
                   left JOIN  Company as co1 ON a.company_id=co1.id `;

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
   
    let file_signification = files && files.file_signification ? func.saveFile(files.file_signification, name, 'file_signification',data.contract_id+"_"+data.no_id) : '';
    data["file_signification"] = file_signification;
    let file_25percent = files && files.file_25percent ? func.saveFile(files.file_25percent, name, 'file_25percent',data.contract_id+"_"+data.no_id) : '';
    data["file_25percent"] = file_25percent;
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
    let file_signification = files && files.file_signification ? func.saveFile(files.file_signification, name, 'file_signification', data.contract_id+"_"+data.no_id) : '';
       data["file_signification"] = data['file_signification'] == false ? '**d**' : file_signification;
       let file_25percent = files && files.file_25percent ? func.saveFile(files.file_25percent, name, 'file_25percent',data.contract_id+"_"+data.no_id) : '';
       data["file_25percent"] = data['file_25percent'] == false ? '**d**' : file_25percent;
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



