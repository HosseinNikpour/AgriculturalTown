const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();

const name = "tbl_roles";

router.get(`/`, function (req, res) {
    let query = `SELECT * FROM ${name} `;

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

module.exports = router;

