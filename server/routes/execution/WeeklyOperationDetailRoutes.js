const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "Weekly_Operation_detail";




router.get(`/getPrev`, function (req, res) {
    console.log(req.query)
    let query = `SELECT operation, unit,sum(current_done) as prev_done
    FROM public.weekly_operation_detail as d join public.weekly_operation as m on d.parent_id=m.id
    where m.contract_id= ${req.query.contract_id} and period_id< ${req.query.period_id}
    group by operation, unit  `;
console.log(query)
    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/`, function (req, res) {
    let query = `SELECT * FROM vw_${name} `;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});

router.get(`/:id`, function (req, res) {
    let query = `SELECT * FROM vw_${name} where parent_id = ${req.params.id} order by sort`;
//console.log(query)
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



