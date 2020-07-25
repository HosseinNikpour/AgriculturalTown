const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "tender";

let baseQuery=`SELECT w.*,t.title AS town,b1.title AS "group",b2.title AS type,b3.title AS service_type,
    b4.title AS operation_type,b5.title AS invite_method,b6.title AS modifier_type,b7.title AS commission_result,
    b8.title AS call_method
    FROM tender w LEFT JOIN town t ON w.town_id = t.id
                  LEFT JOIN baseinfo b1 ON w.group_id = b1.id
                  LEFT JOIN baseinfo b2 ON w.type_id = b2.id
                  LEFT JOIN baseinfo b3 ON w.service_type_id = b3.id
                  LEFT JOIN baseinfo b4 ON w.operation_type_id = b4.id
                  LEFT JOIN baseinfo b5 ON w.invite_method_id = b5.id
                  LEFT JOIN baseinfo b6 ON w.modifier_type_id = b6.id
                  LEFT JOIN baseinfo b7 ON w.commission_result_id = b7.id
                  LEFT JOIN baseinfo b8 ON w.call_method_id = b8.id `;

router.get(`/`, function (req, res) {
    let query = ` ${baseQuery} order by id desc  `;

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

    let file_record = files && files.file_record ? func.saveFile(files.file_record, name, 'file_record', data.title+"_"+data.town_id) : '';
    data["file_record"] = file_record;
    let file_invite = files && files.file_invite ? func.saveFile(files.file_invite, name, 'file_invite', data.title+"_"+data.town_id) : '';
    data["file_invite"] = file_invite;
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
    let file_record = files && files.file_record ? func.saveFile(files.file_record, name, 'file_recod', data.title+"_"+data.town_id ) : '';
    data["file_record"] = data['file_record'] == false ? '**d**' : file_record;
    let file_invite = files && files.file_invite ? func.saveFile(files.file_invite, name, 'file_invite', data.title+"_"+data.town_id) : '';
    data["file_invite"] = data['file_invite'] == false ? '**d**' : file_invite;
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



