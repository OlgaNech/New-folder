const express = require('express');
const app = express();

app.use(express.json()); // Middleware to parse JSON body

// In-memory database for products
let products = [];
let currentId = 1;

// Create a product (POST /products)
app.post('/products', (req, res) => {
    const { name, price, stock } = req.body;

    if (!name || price == undefined || stock == undefined) {
        return res.status(400).json({ error: 'Name, price, and stock are required' });
    }

    const newProduct = { id: currentId++, name, price: parseFloat(price), stock: parseInt(stock) };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

// Get all products (GET /products)
app.get('/products', (req, res) => {
    res.json(products);
});

// Get a product by ID (GET /products/:id)
app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
});

// Update a product by ID (PUT /products/:id)
app.put('/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const { name, price, stock } = req.body;
    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);

    res.json(product);
});

// Delete a product by ID (DELETE /products/:id)
app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));
    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(productIndex, 1);
    res.json(deletedProduct[0]);
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
