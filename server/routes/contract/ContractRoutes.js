const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "Contract";

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
  //  console.log(files.file_agreement);
    let file_agreement = files && files.file_agreement ? func.saveFile(files.file_agreement, name, 'file_agreement', data.title) : '';
    let file_announcement = files && files.file_announcement ? func.saveFile(files.file_announcement, name, 'file_announcement', data.title) : '';
    let file_delivery = files && files.file_delivery ? func.saveFile(files.file_delivery, name, 'file_delivery', data.title) : '';
    data["file_agreement"] = file_agreement;
    data["file_announcement"] = file_announcement;
    data["file_delivery"] = file_delivery;

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
    let data = JSON.parse(req.body.data);
    let files = req.files;
  //  console.log(files.file_agreement);
    let file_agreement = files && files.file_agreement ? func.saveFile(files.file_agreement, name, 'file_agreement', data.title) : '';
    let file_announcement = files && files.file_announcement ? func.saveFile(files.file_announcement, name, 'file_announcement', data.title) : '';
    let file_delivery = files && files.file_delivery ? func.saveFile(files.file_delivery, name, 'file_delivery', data.title) : '';
    data["file_agreement"] = data['file_agreement'] == false ? '**d**' :file_agreement;
    data["file_announcement"] = data['file_announcement'] == false ? '**d**' :file_announcement;
    data["file_delivery"] = data['file_delivery'] == false ? '**d**' :file_delivery;

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



