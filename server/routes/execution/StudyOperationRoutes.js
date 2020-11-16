const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "Study_Operation";

let baseQuery=`select w.*,c.title AS contract, c.contract_no,co.title as company
FROM study_operation w LEFT JOIN agreement c ON w.contract_id = c.id
                        LEFT JOIN company co ON c.company_id = co.id
                           `;

router.get(`/`, function (req, res) {
    let query = ` ${baseQuery} order by report_date desc  `;

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
    let rows = req.body.rows;
    let query = `INSERT INTO public.${name}(creator_id, create_date,contract_id, report_date)
        VALUES (${req.body.creator_id},'${req.body.create_date}',${req.body.contract_id},'${req.body.report_date}') RETURNING id`;
        console.log(query);
        pool.query(query).then((results) => {
        let parent_id = results.rows[0].id;
        let query_d = `INSERT INTO public.${name}_detail(
            operation, weight, percent_done, progress_done, percent_approve, progress_approve, parent_id, sort)
                VALUES `;
        rows.forEach(e => {
            query_d += `('${e.operation}',${e.weight},${e.percent_done},${e.progress_done},${e.percent_approve},${e.progress_approve},${parent_id},${e.sort}),`
        });
        query_d = query_d.slice(0, -1);
        console.log(query_d);
        pool.query(query_d).then((results_d) => {
        //     if (req.body.role_id<4) {
        //         let query_a = `INSERT INTO public.wf_history(creator_id, create_date, entity_name, item_id, action)
        //             VALUES (${req.body.creator_id},'${req.body.create_date}','${req.body.entity_name}',${parent_id},0)`;
        //         pool.query(query_a).then((results_a) => {
        //             return res.send(results.rows);
        //         });
        //     }
        //     else
             return res.send(results.rows);
        }).catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
    })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.put('/:id', function (req, res) {
    let rows = req.body.rows;
    let parent_id = req.body.id;
   // console.log(req.body.editor_id,req.body.edit_date);
    pool.query(`delete from public.${name}_detail WHERE parent_id=${parent_id}`).then((results) => {
        let query = `update public.${name} 
        SET  editor_id=${req.body.editor_id},
             edit_date='${req.body.edit_date}' 
           
        where id =${parent_id}`;
        console.log('master', query);
        pool.query(query).then((results) => {
            // let parent_id = results.rows[0].id;
            let query_d = `INSERT INTO public.${name}_detail(
                operation, weight, percent_done, progress_done, percent_approve, progress_approve, parent_id, sort)
                VALUES `;

            rows.forEach(e => {
                query_d += `('${e.operation}',${e.weight},${e.percent_done},${e.progress_done},${e.percent_approve},${e.progress_approve},${parent_id},${e.sort}),`
            });
            query_d = query_d.slice(0, -1);
            console.log('details', query_d)
            pool.query(query_d).then((results_d) => {
                // if (req.body.role_id<4) {
                //     let query_a = `INSERT INTO public.wf_history(creator_id, create_date, entity_name, item_id, action)
                //         VALUES (${req.body.editor_id},'${req.body.edit_date}','${req.body.entity_name}',${parent_id},3)`;
                //     pool.query(query_a).then((results_a) => {
                //         return res.send(results.rows);
                //     });
                // }
                // else
                    return res.send(results.rows);
                
            }).catch((err) => {
                return res.send({ type: "Error", message: err.message })
            });

        })
            .catch((err) => {
                return res.send({ type: "Error", message: err.message })
            });
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



