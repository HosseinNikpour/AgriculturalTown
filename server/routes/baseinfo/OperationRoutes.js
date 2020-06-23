const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "Operation";


let baseQuery=`select o.*,b.title AS category,b2.title AS unit
                FROM operation o LEFT JOIN baseinfo b ON o.category_id = b.id
                                 LEFT JOIN baseinfo b2 ON o.unit_id = b2.id `


router.get(`/`, function (req, res) {
    let query = `${baseQuery} order by sort  `;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/:id`, function (req, res) {
    let query = `${baseQuery} where category_id = ${req.params.id} order by sort`;

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

    let query=func.queryGen(name,'insert',data);
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
   let data=req.body;
    let query=func.queryGen(name,'update',data);
    console.log(query);
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



