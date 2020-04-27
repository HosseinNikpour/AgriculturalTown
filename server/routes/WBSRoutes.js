const pool = require('../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../functions/index');
const name = "WBS";





router.get(`/`, function (req, res) {
    let query = `SELECT * FROM vw_${name} order by id desc  `;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/:id`, function (req, res) {
    let query = `SELECT * FROM vw_${name} where contract_id = ${req.params.id} order by sort`;

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
    pool.query(`delete from public.${name} WHERE contract_id=${contractId}`).then((results) => {
        let query = `INSERT INTO public.${name}(
        creator_id, create_date, contract_id, operation_id, unit_id, value, value_change, value_diff, 
        price, price_change, price_diff, wieght, sort)
        VALUES `;
        rows.forEach(e => {
            query += `(${e.user_id},'${new Date().toLocaleString()}',${e.contract_id},${e.operation_id},${e.unit_id},${e.value},${e.value_change},${e.value_diff},
            ${e.price},${e.price_change},${e.price_diff},${e.wieght},${e.sort}),`
        });
        query = query.slice(0, -1);
        // query+=` ON CONFLICT (id) 
        //         DO UPDATE
        //         SET editor_id = ${e.user_id}, 
        //             edit_date = '${new Date()}',
        //             contract_id=EXCLUDED.contract_id ,
        //             operation_id=EXCLUDED.operation_id ,
        //             unit_id=EXCLUDED.unit_id ,
        //             value=EXCLUDED.value ,
        //             value_change=EXCLUDED.value_change ,
        //             value_diff=EXCLUDED.value_diff ,
        //             price=EXCLUDED.price ,
        //             price_change=EXCLUDED.price_change ,
        //             price_diff=EXCLUDED.price_diff ,
        //             wieght=EXCLUDED.wieght ,
        //             sort=EXCLUDED.sort `
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


