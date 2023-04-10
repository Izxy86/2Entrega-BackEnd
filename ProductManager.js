const {promises} = require("fs")


const fsP = promises

const products = []


class ProductManager {
    constructor(path) {
        this.products = products
        this.path = path
    }

    //Método para agregar productos
    addProduct(product){
    //valida que todos los campos estén completos
        if(!product.title ||
        !product.description ||
        !product.price ||
        !product.thumbnail ||
        !product.code ||
        !product.stock) return console.log("Every fields are request")
        
        // valida el código del producto, si ya existe lo reporta por consola
        let productPushed = this.products.find(prod => prod.code === product.code)
        if(productPushed) return console.log(`This products was already pushed, here's the code:"${product.code}"`)

        //le asigna un id al producto agregado
        return this.products.push({id: this.products.length+1, ...product})
    }

    // Método que elimina un producto con el ID desde el JSON
    deleteProduct(id) {
        fsP.readFile(this.path,"utf-8",(err, data)=> {
            if(err){
                console.log(err)
                return
            }
        const product = JSON.parse(data)
        const index = product.findIndex(product => product.id === id)
        if(index !== -1) {
            product.splice(index, 1)
        } else {
            console.log(`Product with id ${id} not found`)
            return
        }
        fs.writeFile(path, JSON.stringify(product, null, 2),"utf-8" , err => {
            if (err){
                console.log(err)
            } else {
                console.log(`Product with id ${id} succesfully removed`)
            } 
        }) 
        }
    )}

    // Método que crea el archivo "DB.json"
    createJsonFile =  (path)=> {
        fsP.writeFile(path,JSON.stringify([...product.products],null,2),"utf-8", (err)=> {
            if(err) return console.log(err)
        })
    }

    // Traer productos desde el JSON pero con PROMISES.}
    getProducts = async(limit)=> {
        try {
            let data = await fsP.readFile(this.path,"utf-8")
            const parseData = JSON.parse(data)            
            return parseData
        } catch (err) {
            return []
        }
    }
    
    // Trae producto con ID desde JSON
    async getProductById(pid) {
        const contenido = await fsP.readFile(this.path, "utf-8")
        
        let product = JSON.parse(contenido)
        let productId = product.find(prod => prod.id === pid)
        
        if(!product) return "Product not found" 
        
        return productId
    }
        
}




module.exports = ProductManager;


