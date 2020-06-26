const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "WBS_Study";

let baseQuery=`select w.* ,c.title AS contract,o.title AS operation
    FROM WBS_Study as w  LEFT JOIN agreement c ON w.contract_id = c.id
                      LEFT JOIN operation o ON w.operation_id = o.id `;



router.get(`/`, function (req, res) {
    let query = `${baseQuery} order by id desc  `;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/:id`, function (req, res) {
    let query = `${baseQuery} where contract_id = ${req.params.id} order by sort`;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/upsert', function (req, res) {

    let rows = req.body.rows;
    let contractId = req.body.rows[0].contract_id;
    console.log(req.body);
    pool.query(`delete from public.${name} WHERE contract_id=${contractId}`).then((results) => {
        let query = `INSERT INTO public.${name}(
        creator_id, create_date, contract_id, operation_id, weight, sort)
        VALUES `;
        rows.forEach(e => {
            query += `(${req.body.user_id},'${new Date().toLocaleString()}',${e.contract_id},${e.operation_id},${e.weight},${e.sort}),`
        });
        query = query.slice(0, -1);
        console.log(query)
        pool.query(query)
            .then((results) => {
                return res.send(results.rows);
            })
            .catch((err) => {
                return res.send({ type: "Error", message: err.message })
            });
    });
});
router.post('/', function (req, res) {

    //let rows = req.body.rows;

    let query = func.queryGen(name, 'insert', req.body);
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
    let data = req.req;
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


