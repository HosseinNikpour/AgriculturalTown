const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "wf_history";

router.get(`/`, function (req, res) {
    console.log(req.query)
    let query = `SELECT * FROM vw_${name} where item_id=${req.query.item_id} and entity_name='${req.query.entity_name}' order by id desc`;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/:id`, function (req, res) {
    let query = `SELECT * FROM ${name} where item_id = ${req.params.key} `;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/', function (req, res) {
    let data = req.body.obj;
    let tblName = "";
    switch (data.entity_name) {
        case 'weeklyOperation': tblName = "weekly_operation"; break;
        case 'weeklyWeather':tblName="Weekly_Weather";break;
        case 'weeklyUser':tblName="Weekly_User";break;
        case 'weeklyMachine':tblName="Weekly_Machine";break;
    }
    let query = func.queryGen(name, 'insert', data);
    pool.query(query).then((results) => {
        let query_d = `UPDATE public.${tblName}
            SET current_user_id=${req.body.next_user}, status='${req.body.status}'
            WHERE id =${data.item_id}`
        pool.query(query_d).then((results_d) => {
            return res.send(results.rows);
        }).catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
        
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

