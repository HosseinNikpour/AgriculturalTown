const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "value_change";

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
    let query = `SELECT * FROM vw_${name} where id = ${req.params.id} `;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/', function (req, res) {

    let data = JSON.parse(req.body.data);
    let files = req.files;
   
    let file_signification = files && files.file_signification ? func.saveFile(files.file_signification, name, 'file_signification', data.title) : '';
    data["file_signification"] = file_signification;
    let file_25percent = files && files.file_25percent ? func.saveFile(files.file_25percent, name, 'file_25percent', data.title) : '';
    data["file_25percent"] = file_25percent;
    // console.log(data);
    let query = func.queryGen(name, 'insert', data);

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.put('/:id', function (req, res) {
    let data = JSON.parse(req.body.data);
    let files = req.files;
    let file_signification = files && files.file_signification ? func.saveFile(files.file_signification, name, 'file_signification', data.title) : '';
       data["file_signification"] = data['file_signification'] == false ? '**d**' : file_signification;
       let file_25percent = files && files.file_25percent ? func.saveFile(files.file_25percent, name, 'file_25percent', data.title) : '';
       data["file_25percent"] = data['file_25percent'] == false ? '**d**' : file_25percent;
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



