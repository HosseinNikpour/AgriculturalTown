const pool = require('../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../functions/index');
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

    let query=func.queryGen(name,'insert',data);
    // let query = `INSERT INTO public.${name}(title,province_id,city,gross_area,pure_area,inityear,activity_type_id,ownership_type_id,water_supply_id,water_rate,power_supply_id,power_rate,gas_supply_id,gas_rate,total_units,used_units,used_number,location_id,coordinate_e,coordinate_n,file_dxf,file_kmz)  
    // Values('${data.title}',${data.province_id},'${data.city}',${data.gross_area},${data.pure_area},${data.inityear},${data.activity_type_id},${data.ownership_type_id},${data.water_supply_id},${data.water_rate},${data.power_supply_id},${data.power_rate},${data.gas_supply_id},${data.gas_rate},${data.total_units},${data.used_units},${data.used_number},${data.location_id},${data.coordinate_e},${data.coordinate_n},'${file_dxf}','${file_kmz}')`;
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
    // let query = `UPDATE public.${name} 
    // SET title='${req.body.title}',province_id=${req.body.province_id},city='${req.body.city}',
    // gross_area=${req.body.gross_area},pure_area=${req.body.pure_area},inityear=${req.body.inityear},
    // activity_type_id=${req.body.activity_type_id},ownership_type_id=${req.body.ownership_type_id},
    // water_supply_id=${req.body.water_supply_id},water_rate=${req.body.water_rate},
    // power_supply_id=${req.body.power_supply_id},power_rate=${req.body.power_rate},
    // gas_supply_id=${req.body.gas_supply_id},gas_rate=${req.body.gas_rate},
    // total_units=${req.body.total_units},used_units=${req.body.used_units},
    // used_number=${req.body.used_number},location_id=${req.body.location_id},
    // coordinate_e=${req.body.coordinate_e},coordinate_n=${req.body.coordinate_n},
    // file_dxf='${req.body.file_dxf}',file_kmz='${req.body.file_kmz}' 
    // WHERE  id=${req.body.id}`;
    //console.log(query);
    let query=func.queryGen(name,'update',data);
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
            fs.unlinkSync(filePath1);
            fs.unlinkSync(filePath2);
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
module.exports = router;



