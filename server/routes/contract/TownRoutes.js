const pool = require('../../db/pool');
const express = require('express'); 
const router = express.Router();
const func = require('../../functions/index');
const name = "Town";

let baseQuery=`select t.*,b1.title AS province,b2.title AS activity_type
--b3.title AS ownership_type,
--b4.title AS water_supply,
--b5.title AS power_supply,
--b6.title AS gas_supply,
--b7.title AS location,
--b9.title AS water_index
    FROM town t LEFT JOIN baseinfo b1 ON t.province_id = b1.id
                LEFT JOIN baseinfo b2 ON t.activity_type_id = b2.id
                -- LEFT JOIN baseinfo b3 ON t.ownership_type_id = b3.id
                -- LEFT JOIN baseinfo b4 ON t.water_supply_id = b4.id
                -- LEFT JOIN baseinfo b5 ON t.power_supply_id = b5.id
                -- LEFT JOIN baseinfo b6 ON t.gas_supply_id = b6.id
                -- LEFT JOIN baseinfo b7 ON t.location_id = b7.id
                -- LEFT JOIN baseinfo b9 ON t.water_index_id = b9.id
                 `


router.get(`/vw`, function (req, res) {
    let query = `SELECT id,title,province_id FROM town`;

    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});


router.get(`/`, function (req, res) {
    let query = `${baseQuery} order by id desc  `;
   // console.log(req.query)
    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.get(`/:id`, function (req, res) {
    let query = ` ${baseQuery} where id = ${req.params.id} `;

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
    let file_plan = files && files.file_plan ? func.saveFile(files.file_plan, name, 'file_plan', data.title) : '';
    data["file_plan"] = file_plan;
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
    let file_plan = files && files.file_plan ? func.saveFile(files.file_plan, name, 'file_plan', data.title) : '';
    data["file_plan"] = data['file_plan'] == false ? '**d**' : file_plan;
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



