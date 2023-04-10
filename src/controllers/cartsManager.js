const fs = require('fs')

class CartManager{
    constructor(archivo){
        this.archivo = archivo;
    }

    exists(archivo){
        try{
            if (!fs.existsSync(archivo)){
                throw new Error ('El archivo no existe');
            }else {
                return true;
            }
        }catch(error){
            console.log(`Error buscando el archivo: ${error.messsage}`)
        }
    }

    readFile = async (archivo) => {
        try {
            const data = await fs.promises.readFile(archivo);
            return JSON.parse(data);
        }catch(error){
            console.log(`Error leyendo el archivo: ${error.message}`)
        }
    }

    writeFile = async data => {
        try{
            await fs.promises.writeFile(
                this.archivo, JSON.stringify(data, null, 2)
            )
            }catch (error){
            console.log(error);
        }
    }

    createCart = async () =>{
        try{
            if(!this.exists(this.archivo)){
                let cartsArray=[]
                const cart = {
                    id: this.#idGen(),
                    products:[],
                };
                cartsArray.push(cart)
                await this.writeFile(cartsArray)
                console.log(`El carrito fué agregado con el id:${cart.id}`)
                return cart.id
            }else{
                if (this.readFile(this.archivo)){
                    const cartsArray = await this.readFile(this.archivo)
                    if(cartsArray.length === 0 || !cartsArray){
                        const cart = {
                            id: this.#idGen(),
                            products: [],
                        };
                        cartsArray.push(cart);
                    }else {
                        const cart = {
                            id: this.#idGen(cartsArray),
                            products:[],
                        };
                        cartsArray.push(cart);
                    }
                    await this.writeFile(cartsArray);
                    console.log(`El carrito fue agregado con el Id: ${cart.id}`)
                    return carts;
                }
            }
        }catch (error) {
            console.log(`Error agregando: ${error.message}`);
        }
    }

        getCartById = async id => {
            try {
                if(this.exists(this.archivo)){
                    let carts = await this.readFile(this.archivo)
                    const cart = carts.find(item => item.id === id)
                    return cart ? cart : console.log('No product found')
            }
            return console.log('The db not exist')
            } catch (error) {
                console.log(error);
            }
        }
    
        addToCart = async (cid, pid) => {
            try {
                if(this.exists(this.archivo)) {
                    const carts = await this.readFile(this.archivo)
                    const cart = carts.find(item => item.id === cid)
                    console.log(cart);
                if(cart) {
                    const addProduct = cart.products.find(item => item.id === pid)
                    if(addProduct) {
                        addProduct.quantity++
                    }else{
                        cart.products.push({id: pid, quantity: 1 })
                    }
                    await this.writeFile(carts)
                    return cart
                }
                throw new Error(`The cart with the id was not found: ${cid}`)
            }
            } catch (error) {
                console.log(error);
            }
        }
    
        #idGen(productsArray = []) {
            const id =
            productsArray.length === 0
                ? 1
                : productsArray[productsArray.length - 1].id + 1;
            return id;
        }
    
    
    
    
}

module.exports = CartManager