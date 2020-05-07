const pool = require('../../db/pool');
const express = require('express'); 
const router = express.Router();
const func = require('../../functions/index');
const name = "Town";

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
    let file_dxf = files && files.file_dxf ? func.saveFile(files.file_dxf, name, 'file_dxy', data.title) : '';
    let file_kmz = files && files.file_kmz ? func.saveFile(files.file_kmz, name, 'file_kmz', data.title) : '';
    data["file_dxf"] = file_dxf;
    data["file_kmz"] = file_kmz;
    // console.log(data);
    let query = func.queryGen(name, 'insert', data);
    //console.log(query)

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
    let file_dxf = files && files.file_dxf ? func.saveFile(files.file_dxf, name, 'file_dxy', data.title) : '';
    let file_kmz = files && files.file_kmz ? func.saveFile(files.file_kmz, name, 'file_kmz', data.title) : '';
    data["file_dxf"] = data['file_dxf'] == false ? '**d**' : file_dxf;
    data["file_kmz"] = data['file_kmz'] == false ? '**d**' : file_kmz;

    let query = func.queryGen(name, 'update', data);
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

    let filePath1 = req.body.file_dxf,
        filePath2 = req.body.file_kmz;
    console.log(req.body);
    let query = `delete from public.${name} WHERE  id=${req.params.id};    `;
    console.log(query);
    pool.query(query)
        .then((results) => {
            //   fs.unlinkSync(filePath1);
            //    fs.unlinkSync(filePath2);
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
module.exports = router;



