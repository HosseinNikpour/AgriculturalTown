const pool = require('../db/pool');
const express = require('express');
const router = express.Router();

const name = "BaseInfo";

router.get(`/`, function (req, res) {
    let query = `SELECT * FROM ${name} order by groupid,sort  `;

    pool.query(query)
        .then((results) => {
            // pool.end();
            return res.send(results.rows);
        })
        .catch((err) => {
            // pool.end();
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/:key`, function (req, res) {
    let query = `SELECT * FROM ${name} where groupid = ${req.params.key}order by sort  `;

    pool.query(query)
        .then((results) => {
            //  pool.end();
            return res.send(results.rows);
        })
        .catch((err) => {
            //  pool.end();
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/', function (req, res) {
    let query = `INSERT INTO public.baseinfo(title, sort, groupid)
    VALUES  ('${req.body.title}',${req.body.sort},${req.body.groupid})`;
    //  console.log(query);
    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.put('/:id', function (req, res) {
    let query = `UPDATE public.baseinfo
	SET title='${req.body.title}',  sort=${req.body.sort}, groupid=${req.body.groupid}
	WHERE  id=${req.body.id};    `;
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
    let query = `delete from public.baseinfo WHERE  id=${req.params.id};    `;
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

