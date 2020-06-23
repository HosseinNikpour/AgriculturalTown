const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "pay_invoice_contractor";

let baseQuery=`select i.*, c.contract_no AS contract,b1.title AS type,b2.title AS no, b3.title AS credit
    ,co.title as vw_company ,c.title as vw_contract_title,c.file_agreement as vw_file_agreement
    FROM pay_invoice_contractor i LEFT JOIN contract c ON i.contract_id = c.id
                                  LEFT JOIN baseinfo b1 ON i.type_id = b1.id
                                  LEFT JOIN baseinfo b2 ON i.no_id = b2.id
                                  LEFT JOIN baseinfo b3 ON i.credit_id = b3.id
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

    let data = req.body;
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
    let data = req.body;
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



