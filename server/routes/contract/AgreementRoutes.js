const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "Agreement";
//var jwt = require('jsonwebtoken');

router.get(`/`, function (req, res) {
    // let userId = req.query.userId,
    //     token = req.query.token;
    // if (!userId || !token) return res.send({ type: "Error", message: "token is not vallid." });
    // let user = jwt.verify(token, process.env.JWT_SECRET);
    // if (!user || user.id != userId) return res.send({ type: "Error", message: "token is not vallid2." });
   
     let where = '';
    // switch (user.role_id) {
    //     case 2:
    //         where = 'where engineer_user_id='+user.id;
    //         break;
    //     case 1:
    //         where = 'where contractor_user_id='+user.id;
    //         break;
    //     case 3:
    //         where = 'where manager_user_id='+user.id;
    //         break;

    //     default:
    //         break;
    // }

    let query = `SELECT * FROM vw_${name} ${where} order by id desc  `;

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
 
    data["file_agreement"] = file_agreement;
    data["file_announcement"] = file_announcement;
  
    let query = func.queryGen(name, 'insert', data);

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
   
    data["file_agreement"] = data['file_agreement'] == false ? '**d**' : file_agreement;
    data["file_announcement"] = data['file_announcement'] == false ? '**d**' : file_announcement;
  

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



