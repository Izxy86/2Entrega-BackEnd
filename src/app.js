const express = require('express')
const cookieParser = require('cookie-parser')
const routers = require('./routers/index.router')
const handlebars = require('express-handlebars')
const viewsRouter = require('./routers/views.router')
const { Server } = require('socket.io')
const http = require('http')
const ProductManager = require('./controllers/ProductManager')

const productsList = new ProductManager((__dirname) + '/db/DB.json')

const app = express()
const PORT = 8080

const httpServer = http.createServer(app)

const io = newServer (httpServer)

httpServer.listen(PORT, ()=> {
    console.log(`Escuchando el puerto ${PORT}`)

})

//____________________________________________
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname +'/views')
app.set ('view engine', 'handlebars')

app.use('/static', express.static((__dirname)+'/public'))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use("/api", routers)
app.use("/", viewsRouter)

io.on('connection', async socket => {
    console.log('Nuevo cliente conectado', socket.id)

    socket.on('client:productDelete', async (pid, cid) => {
        const id = await productsList.getProductById(parseInt(pid.id))
        if(id) {
        await productsList.deleteById(parseInt( pid.id ))
        const data = await productsList.getProducts()
        console.log(data);
        return io.emit('newList', data)
        }
        console.log('log desde app ', cid);
        const dataError = {status: "error", message: "Product not found"}
        return io.emit('newList', dataError)
    })
    socket.on('client:newProduct', async data => {
        console.log(data)
        // const imagePath = data.file.path
        // const imageName = file.filename
        const productAdd = await productsList.addProduct(data)
        if(productAdd.status === 'error'){
            let errorMess = productAdd.message
            io.emit('server:producAdd', {status:'error', errorMess})
        }
        const newData = await productsList.getProducts()
        console.log('log de app linea 69', newData);
        return io.emit('server:productAdd', newData)
    })
})


httpServer.on('error', (error) => {
    console.log('Error', error)
})
