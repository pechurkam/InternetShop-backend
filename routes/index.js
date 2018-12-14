let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/category/list', function (req, res, next) {

    const db = require('../app').db;
    db.any('SELECT * FROM category;')
        .then(data => {
            // console.log(data);
            res.send(data);
        })
        .catch(error => {
            res.send({"status": "error", "statusCode": 503, "statusText": error})
        });
});

router.get('/category/:categoryId', function (req, res, next) {

    const categoryId = req.params.categoryId;

    const db = require('../app').db;
    db.any('SELECT * FROM category WHERE id = $1;', [categoryId])
        .then(data => {
            // console.log(data);
            if (data && data.length)
                res.send(data[0]);
            else
                res.send({"status": "error", "statusCode": 404, "statusText": "Not Found"})
        })
        .catch(error => {
            console.log(error);
            res.send({"status": "error", "statusCode": 503, "statusText": error})
        })

});

router.get('/product/list', function (req, res, next) {

    const db = require('../app').db;
    db.any('SELECT * FROM product;')
        .then(data => {
            // console.log(data);
            res.send(data);
        })
        .catch(error => {
            res.send({"status": "error", "statusCode": 503, "statusText": error})
        });
});

router.get('/product/list/category/:categoryId', function (req, res, next) {

    const categoryId = req.params.categoryId;

    const db = require('../app').db;
    db.any('SELECT * FROM product WHERE category_id = $1;', [categoryId])
        .then(data => {
            // console.log(data);
            if (data && data.length)
                res.send(data);
            else
                res.send({"status": "error", "statusCode": 404, "statusText": "Not Found"})
        })
        .catch(error => {
            res.send({"status": "error", "statusCode": 503, "statusText": error})
        });
});

router.get('/product/:productId', function (req, res, next) {

    const productId = req.params.productId;

    const db = require('../app').db;
    db.any('SELECT * FROM product WHERE id = $1;', [productId])
        .then(data => {
            // console.log(data);
            if (data && data.length)
                res.send(data[0]);
            else
                res.send({"status": "error", "statusCode": 404, "statusText": "Not Found"})
        })
        .catch(error => {
            res.send({"status": "error", "statusCode": 503, "statusText": error})
        });
});

router.post("/order/add", function (req, res) {
    console.log(req.body);
    let token = req.body.token;
    let name = req.body.name;
    let phone = req.body.phone;
    let email = req.body.email;

    console.log(token);

    let orderId;
    let errors = '';

    const db = require('../app').db;

    db.one('INSERT INTO "order"(client_name, client_phone, client_email) VALUES($1, $2, $3) RETURNING id', [name, phone, email])
        .then(data => {
            // success;
            console.log(data);
            orderId = data.id;
            console.log(orderId);
        })
        .then(function () {
            Object.entries(req.body).forEach(([key, value]) => {

                if (key.startsWith('products')) {

                    let normKey = key.substring(
                        key.lastIndexOf("[") + 1,
                        key.lastIndexOf("]")
                    );
                    console.log(orderId + ' ' + normKey + " " + value);
                    db.none('INSERT INTO order_to_product(order_id, product_id, count) VALUES($1, $2, $3)', [parseInt(orderId), parseInt(normKey), parseInt(value)])
                        .then(() => {
                            // success;
                        })
                        .catch(error => {
                            errors += error + '\n';
                        });
                }
            });
        })
        .catch(error => {
            // res.send({"status": "error", "statusCode": 503, "statusText": error})
        });

    // if (errors === '')
    //     res.send({"status": "error", "statusCode": 503, "statusText": error});
    // else
    res.send({"status": "success"})

});

module.exports = router;
