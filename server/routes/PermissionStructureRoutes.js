const pool = require('../db/pool');
const express = require('express');
const router = express.Router();

const name = "per_structure";

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
    let query = `SELECT * FROM ${name} where id = ${req.params.key} `;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/', function (req, res) {
    let query = `INSERT INTO public.${name}(entity_name,item_creator,item_approver,item_viewer,item_editor)  
    Values('${req.body.entity_name}','{${req.body.item_creator}}','{${req.body.item_approver}}','{${req.body.item_viewer}}','{${req.body.item_editor}}')`;
    //console.log(query)
    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.put('/:id', function (req, res) {
    let query = `UPDATE public.${name}  
    SET entity_name='${req.body.entity_name}',item_creator=${req.body.item_creator},
        item_approver=${req.body.item_approver},item_viewer=${req.body.item_viewer},
        item_editor=${req.body.item_editor} 
	WHERE  id=${req.body.id};    `;
    //console.log(query);
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

