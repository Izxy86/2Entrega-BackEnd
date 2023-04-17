const {Router} = require('express')
const ProductManager = require('../controllers/productsManager')
const {dirname} = require('path')


const router = Router()

const productsList = new ProductManager(`${dirname(__dirname)}/db/products.json`)

router.get('/', async (req, res) => {
    const limit = req.query.limit
    const products = await productsList.getProducts(limit)
    const objeto = {
        styled: "main.css",
        title: "PRODUCTS LIST",
        products
    }
    res.render('index', objeto)
    console.log('log views router linea 13', products)
})

router.get('/realTimeProducts', async (req, res) => {
    const limit = req.query.limit
    const products = await productsList.getProducts(limit)
    const data = {
        style: "styleProdRt.css",
        title: "PRODUCTS LIST",
        products
    }
    res.render('realTimeProducts', data)
})

module.exports = router