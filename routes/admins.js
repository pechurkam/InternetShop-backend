let express = require('express');
let router = express.Router();

const apiToken = '563C918CFA56303D4346FA9FE59F5A825F1FE1C67D959F18E8776D41BFCBC713'; // sha 256 of string 'Milena'

/* GET users listing. */
router.post('/', function (req, res) {

    if (req.body.password === 'm.pechura')


        res.send({'status': 'success', 'token': apiToken});
    else
        res.send({'status': 'error', 'statusCode': 401, 'statusError': 'Bad token'})

});

router.post('/product/add', function (req, res) {
    if (req.body.token !== apiToken)
        res.send({'status': 'error', 'statusCode': 401, 'statusError': 'Bad token'});

    let name = req.body.name;
    let description = req.body.description;
    let imageUrl = req.body.imageUrl;
    let price = req.body.price;
    let specialPrice = null;

    if ('specialPrice' in req.body)
        specialPrice = req.body.specialPrice;

    let categoryId = req.body.categoryId;

    const db = require('../app').db;

    db.none('INSERT INTO product(name, description, image_url, price, special_price, category_id) VALUES($1, $2, $3, $4, $5, $6)', [name, description, imageUrl, price, specialPrice, categoryId])
        .then(() => {
            // success;
            res.send({'status': 'success'})
        })
        .catch(error => {
            res.send({'status': 'error', 'statusCode': 503, 'statusError': error})
        });

});

router.post('/category/add', function (req, res) {

    if (req.body.token !== apiToken)
        res.send({'status': 'error', 'statusCode': 401, 'statusError': 'Bad token'});

    let name = req.body.name;
    let description = req.body.description;

    const db = require('../app').db;

    db.none('INSERT INTO category(name, description) VALUES($1, $2)', [name, description])
        .then(() => {
            // success;
            res.send({'status': 'success'})
        })
        .catch(error => {
            res.send({'status': 'error', 'statusCode': 503, 'statusError': error})
        });


});

router.post('/order/list', function (req, res) {

    if (req.body.token !== apiToken)
        res.send({'status': 'error', 'statusCode': 401, 'statusError': 'Bad token'});

    const db = require('../app').db;

    db.any('SELECT * FROM "order"')
        .then(data => {
            console.log(data);
            let newData = [];
            Object.entries(data).forEach((item, index) => {
                // console.log(item);
                db.any('SELECT product_id, count FROM order_to_product WHERE order_id = $1', [item[1].id])
                    .then((order_data) => {
                        // console.log('here');
                        // console.log(order_data)
                        item.push(order_data);
                        // console.log(item);
                        console.log(item);
                        newData.push(item);
                        if (data.length - 1 === index) {
                            // console.log('here');
                            // console.log(data);
                            res.send(newData)
                        }
                        // item['products'] = order_data;
                    })
                    .catch(error => {
                        console.log(error)
                    })

                // console.log(data);
                // res.send(data)
            });
            // res.send(data)
        })
        .catch(error => {
            console.log(error);
            res.send({"status": "error", "statusCode": 503, "statusError": error})
        })

});

module.exports = router;

// Description of admin page POST methods
//
// POST: /api/admin
//                 password //m.pechura
// POST: /api/admin/product/add
//                 token
//                 name
//                 description
//                 imageUrl
//                 price
//                 specialPrice = null
//                 categoryId
// POST: /api/admin/category/add
//                 token
//                 name
//                 description
// POST: /api/admin/order/list
//                 token