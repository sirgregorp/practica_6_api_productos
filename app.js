const express = require('express')
const app = express()

app.use(express.json())

const productos = [
    {
        id: 1,
        nombre: 'Teclado inalambrico',
        descripcion: 'Teclado 101 teclas idioma ingles',
        precio: 1500.00
    },
    {
        id: 2,
        nombre: 'Mouse inalambrico',
        descripcion: 'Mouse optico inalambrico.',
        precio: 600.00
    },
    {
        id: 3,
        nombre: 'Monitor 23.5 pulgadas full hd',
        descripcion: 'Monitor Full HD panel IPS',
        precio: 6500.00
    }
]

// GET - Listar todos los productos
app.get('/productos', (req, res) => {
    res.json(productos)
})

// GET - Obtener un producto por id
app.get('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const producto = productos.find(p => p.id === id)

    if (!producto) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    res.json(producto)
})


// ============================================================
// PRÁCTICA 6: Completa los siguientes métodos de la API
// ============================================================

// POST - Crear nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio } = req.body

    // Validar que vengan los 3 campos
    if (!nombre || !descripcion || precio === undefined || precio === '') {
        return res.status(400).json({ mensaje: 'Los campos nombre, descripcion y precio son obligatorios' })
    }

    // Reto opcional: el precio tiene que ser un numero mayor que 0
    const precioNumero = parseFloat(precio)
    if (isNaN(precioNumero) || precioNumero <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un numero mayor que cero' })
    }

    // Busco el id mas alto y le sumo 1 para que no se repita
    let nuevoId = 1
    if (productos.length > 0) {
        nuevoId = Math.max(...productos.map(p => p.id)) + 1
    }

    const nuevoProducto = {
        id: nuevoId,
        nombre: nombre,
        descripcion: descripcion,
        precio: precioNumero
    }

    productos.push(nuevoProducto)

    res.status(201).json(nuevoProducto)
})


// PUT - Actualizar un producto
app.put('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    // Si no lo encuentra findIndex devuelve -1
    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    const { nombre, descripcion, precio } = req.body

    if (!nombre || !descripcion || precio === undefined || precio === '') {
        return res.status(400).json({ mensaje: 'Los campos nombre, descripcion y precio son obligatorios' })
    }

    const precioNumero = parseFloat(precio)
    if (isNaN(precioNumero) || precioNumero <= 0) {
        return res.status(400).json({ mensaje: 'El precio debe ser un numero mayor que cero' })
    }

    // Reemplazo los datos pero dejo el mismo id
    productos[indice] = {
        id: id,
        nombre: nombre,
        descripcion: descripcion,
        precio: precioNumero
    }

    res.status(200).json(productos[indice])
})


// DELETE - Eliminar un producto
app.delete('/productos/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const indice = productos.findIndex(p => p.id === id)

    if (indice === -1) {
        return res.status(404).json({ mensaje: 'Producto no encontrado' })
    }

    // splice devuelve un arreglo con lo que se elimino, por eso uso [0]
    const productoEliminado = productos.splice(indice, 1)[0]

    res.json({
        mensaje: 'Producto eliminado',
        producto: productoEliminado
    })
})


// Uso el puerto 3001 porque el 3000 lo tengo ocupado con otro proyecto
const puerto = 3001

app.listen(puerto, () => {
    console.log('Servidor corriendo en http://localhost:' + puerto)
})
