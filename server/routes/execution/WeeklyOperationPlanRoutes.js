const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const func = require('../../functions/index');
const name = "Weekly_Operation_plan";

let baseQuery=`select w.*,p.title AS plan,c.title AS contract,u.name AS "current_user"
    FROM weekly_operation_plan w LEFT JOIN baseinfo p ON w.plan_id = p.id
                            LEFT JOIN contract c ON w.contract_id = c.id
                            LEFT JOIN "user" u ON w.current_user_id = u.id `;

router.get(`/`, function (req, res) {
    let query = ` ${baseQuery} order by plan_id desc  `;

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
    console.log(req.body);
    let query = `INSERT INTO public.${name}(creator_id, create_date, contract_id, plan_id)
        VALUES (${req.body.creator_id},'${req.body.create_date}',${req.body.contract_id},${req.body.plan_id}) RETURNING id`;
        console.log(query)
        pool.query(query).then((results) => {
        let parent_id = results.rows[0].id;
        let query_d = `INSERT INTO public.${name}_detail( period_id, cumulative_done, parent_id, sort)
                VALUES `;
        rows.forEach(e => {
            query_d += `(${e.period_id},${e.cumulative_done},${parent_id},${e.sort}),`
        });
        query_d = query_d.slice(0, -1);
        console.log(query_d)
        pool.query(query_d).then((results_d) => {
          
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
    let parent_id = req.body.parent_id;
   // console.log(req.body.editor_id,req.body.edit_date);
    pool.query(`delete from public.${name}_detail WHERE parent_id=${parent_id}`).then((results) => {
        let query = `update public.${name} 
        SET  editor_id=${req.body.editor_id},
             edit_date='${req.body.edit_date}' ,
             plan_id=${req.body.plan_id}
        where id =${parent_id}`;
     //   console.log('master', query);
        pool.query(query).then((results) => {
            // let parent_id = results.rows[0].id;
            let query_d = `INSERT INTO public.${name}_detail( period_id, cumulative_done, parent_id, sort)
                VALUES `;

            rows.forEach(e => {
                query_d += `(${e.period_id},${e.cumulative_done},${parent_id},${e.sort}),`
            });
            query_d = query_d.slice(0, -1);
            console.log('details', query_d)
            pool.query(query_d).then((results_d) => {
               
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



