const pool = require('../../db/pool');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');



let name = 'user';

router.post(`/signin`, function (req, res) {
    const user = req.body.username;
    const pwd = req.body.password;
    if (!user || !pwd) {
        return res.status(400).json({
            error: true,
            message: "Username or Password required."
        });
    }

    let query = `SELECT * FROM public.${name} where username='${user}' and enabled=true `;
    pool.query(query)
        .then((results) => {
            if (results.rows.length != 1)
                return res.status(401).json({
                    error: true,
                    message: "Username or Password is Wrong.1"
                });
            else {
                bcrypt.compare(pwd, results.rows[0].password, function (err, res2) {
                    if (err) {
                        return res.status(401).json({
                            error: true,
                            message: "Username or Password is Wrong.2",
                            additianl: err
                        });
                    }
                    if (res2) {
                        let user = {
                            id: results.rows[0].id,
                            name: results.rows[0].name,
                            username: results.rows[0].username,
                            role_id: results.rows[0].role_id,
                            last_login: results.rows[0].last_login
                        };

                        let token = jwt.sign(user, process.env.JWT_SECRET, {
                            expiresIn: 60 * 60 * 24 // expires in 24 hours
                        });
                        let query = `UPDATE public.${name}
                        SET last_login='${new Date().toLocaleString()}'
                         WHERE  id=${results.rows[0].id}    `;
                        pool.query(query)
                            .then((results) => {
                                return res.status(200).json({
                                    error: false,
                                    message: "ok",
                                    
                                    user,
                                    token
                                });
                            })
                            .catch((err) => {
                                return res.status(200).json({
                                    error: false,
                                    message: "ok",
                                    user,
                                    token
                                });
                            });


                    } else {
                        return res.status(401).json({
                            error: true,
                            message: "Username or Password is Wrong.3"
                        });
                    }
                })
            }
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/verifyToken', function (req, res) {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token;
    let userData = req.body.user || req.query.user;


    if (!token) {
        return res.status(400).json({
            error: true,
            message: "Token is required."
        });
    }
    // check token that was passed by decoding token using secret
    jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err) return res.status(401).json({
            error: true,
            message: "Invalid token.   " + err
        });
        // return 401 status if the userId does not match.
        if (user.id !== userData.id) {
            return res.status(401).json({
                error: true,
                message: "Invalid user."
            });
        }
        // get basic user details
        //  var userObj = utils.getCleanUser(userData);
        return res.json({ user: userData, token });
    });
});
router.get(`/`, function (req, res) {
    let query = `SELECT u.id, u.username, u.name, u.last_login,u.enabled,u.role_id ,r.title as role
            FROM public.${name} as u left join tbl_roles as r on u.role_id=r.id
            order by id desc  `;

    pool.query(query)
        .then((results) => {
            // pool.end();
            return res.send(results.rows);
        })
        .catch((err) => {
            // pool.end();
            return res.send({ type: "Error", message: err.message })
        });
});
router.post('/', function (req, res) {
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {

            let query = `INSERT INTO public.${name} (username, name, password,enabled,role_id,creator_id, create_date)  
                         Values('${req.body.username}','${req.body.name}','${hash}',${req.body.enabled},'${req.body.role_id}',${req.body.creator_id},'${req.body.create_date}')`;
            console.log(query);
            pool.query(query)
                .then((results) => {
                    return res.send(results.rows);
                })
                .catch((err) => {
                    return res.send({ type: "Error", message: err.message })
                });
        });
    })

});
router.put('/updatePassword', function (req, res) {
  //  console.log(req.body);
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            let query = `UPDATE public.${name}
            SET password='${hash}'  WHERE  id=${req.body.id}    `;


            //console.log(query);
            pool.query(query)
                .then((results) => {
                    return res.send(results.rows);
                })
                .catch((err) => {
                    return res.send({ type: "Error", message: err.message })
                });
        })
    })
});
router.put('/:id', function (req, res) {
  //  console.log('in update')
    let query = `UPDATE public.${name}
            SET name='${req.body.name}',
                username='${req.body.username}',
                role_id='${req.body.role_id}',
                enabled=${req.body.enabled},
                editor_id=${req.body.editor_id}, 
                edit_date='${req.body.edit_date}'
             WHERE  id=${req.body.id}    `;


    //console.log(query);
    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });

});
router.delete('/:id', function (req, res) {
    let query = `delete from public.${name} WHERE  id=${req.params.id};    `;
    //    console.log(query);
    pool.query(query)
        .then((results) => {
            return res.send(results.rows);
        })
        .catch((err) => {
            return res.send({ type: "Error", message: err.message })
        });
});
module.exports = router;

