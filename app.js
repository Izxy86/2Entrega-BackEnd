const express = require ("express")
const ProductManager = require("./ProductManager")

const port = 8080
const app = express()
const product = new ProductManager("./DB.json")


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.status(200).send('<h1>Bienvenido</h1>')
})

app.get("/api/productos", async (req, res)=>{
    try {
        const { limit } = req.query
        const products = await product.getProducts()        
        if(!limit) {
            return res.send({
                status: 'success',
                products
            })            
        }
        return res.send({
            status: 'success',
            products: products.slice(0, limit)
        })   
    }catch (error){
        console.log(error)
    }
})

app.get("/api/productos/:pid", async (req, res)=>{
    try {
        const {pid}= req.params
        // validar si es número
        const productDb = await product.getProductById(parseInt(pid))
        // validar que exista el producto
        if (!productDb) {
            return res.send({status: 'error', error: 'product not found'})
        }
        res.send({productDb})
    }catch (error){
        console.log(error)
    }
})



app.listen(port, ()=>{
    console.log(`Listen on port ... ${port}`)
})