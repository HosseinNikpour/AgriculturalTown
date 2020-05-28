const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();

const name = "Weekly_User";



router.get(`/`, function (req, res) {
    let query = `SELECT * FROM vw_${name} order by period_id desc  `;

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
    let rows = req.body.rows;
    let query = `INSERT INTO public.${name}(creator_id, create_date, current_user_id, status, contract_id, period_id)
        VALUES (${req.body.creator_id},'${req.body.create_date}',${req.body.current_user_id},'${req.body.status}',${req.body.contract_id},${req.body.period_id}) RETURNING id`;
  
    pool.query(query)
        .then((results) => {
            let parent_id = results.rows[0].id;
            let query_d = `INSERT INTO public.${name}_detail(
                user_type, contractor_user, consultant_user, parent_id)
                VALUES `;
            rows.forEach(e => {
                query_d += `('${e.user_type}',${e.contractor_user},${e.consultant_user},${parent_id}),`
            });
            query_d = query_d.slice(0, -1);
            console.log(query_d)
            pool.query(query_d).then((results_d) => {
                if (req.body.role_id < 4) {
                    let query_a = `INSERT INTO public.wf_history(creator_id, create_date, entity_name, item_id, action)
                        VALUES (${req.body.creator_id},'${req.body.create_date}','${req.body.entity_name}',${parent_id},0)`;
                    pool.query(query_a).then((results_a) => {
                        return res.send(results.rows);
                    });
                }
                else
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
    console.log(parent_id);
    pool.query(`delete from public.${name}_detail WHERE parent_id=${parent_id}`).then((results) => {
        let query = `update public.${name} 
        SET  editor_id=${req.body.editor_id}, 
             edit_date='${req.body.edit_date}',
             status='${req.body.status}',
             current_user_id=${req.body.current_user_id} 
        where id =${parent_id}`;
        console.log('master', query);
        pool.query(query)
            .then((results) => {
                // let parent_id = results.rows[0].id;
                let query_d = `INSERT INTO public.${name}_detail(
                    user_type, contractor_user, consultant_user, parent_id)
                VALUES `;

                rows.forEach(e => {
                    query_d += `('${e.user_type}',${e.contractor_user},${e.consultant_user},${parent_id}),`
                });
                query_d = query_d.slice(0, -1);
                console.log('details', query_d)
                pool.query(query_d) .then((results_d) => {
                    if (req.body.role_id<4) {
                        let query_a = `INSERT INTO public.wf_history(creator_id, create_date, entity_name, item_id, action)
                            VALUES (${req.body.editor_id},'${req.body.edit_date}','${req.body.entity_name}',${parent_id},3)`;
                        pool.query(query_a).then((results_a) => {
                            return res.send(results.rows);
                        });
                    }
                    else
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



