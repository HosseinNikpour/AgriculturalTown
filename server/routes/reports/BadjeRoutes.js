const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();

router.get(`/1`, function (req, res) {
    query = ``;
    pool.query(query).then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});

module.exports = router;