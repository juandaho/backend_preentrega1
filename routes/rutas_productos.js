import { Router } from "express";
import { __dirname } from "../utils.js";
import { ProductManager } from "../control/productManager.js";

const manager = new ProductManager(__dirname+"/files/productos.json")
const router = Router();

router.get("/products", async (req, res) => {
    const limit = parseInt(req.query.limit);
    const ListaProductos = await manager.getProduct({ limit });
    res.json({message:"success", ListaProductos})
});

router.get("/products/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const productoEncontrado = await manager.getProductById(pid);
    if (productoEncontrado) {
        res.json({message:"success", Producto: productoEncontrado})
    } else {
        console.error("Producto no encontrado");
        res.status(404).json({message: "Producto no encontrado"});
    }
});

router.post("/products", async (req,res) => {
    const productoNuevo = await manager.addProduct(req.body);
    res.json({status:"success", productoNuevo});
});

export default router;
