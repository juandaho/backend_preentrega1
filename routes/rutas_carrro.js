import { Router } from "express";
import { __dirname } from "../utils.js";
import { CartManager } from "../control/cartManager.js";

const manager = new CartManager(__dirname+"/files/cart.json")
const router = Router();

router.get("/carts", async (req, res) => {
    const listaCarros = await manager.getCarts()
    res.json({message:"success",listaCarros})
    
});

router.get("/carts/:pid", async (req, res) => {
    const cartEncontrado = await manager.getCartById(req.params.pid);

    if (cartEncontrado) {
        res.send({status: "success", cartEncontrado});
    } else {
        res.status(404).send({status: "error", message: "Cart not found"});
    }
});

router.post("/carts", async (req,res) => {
    const cartNuevo = await manager.addCart(req.body);
    res.send({status:"success", cartNuevo});
});

router.post("/carts/:cid/products/:pid", async (req,res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    const productoToCart = await manager.addProductToCart(cid,pid);
    res.send({status:"success", productoToCart});
});



router.put("/products/:id", async (req,res) => {
    const productoActualizado = await manager.updateProduct(req.params.id, req.body);
    res.json({status:"success", productoActualizado});
});

router.delete("/products/:id", async (req,res) => {
    const productoBorrado = await manager.deleteProduct(req.params.id); 
    res.send({status:"success", productoBorrado});
  });


export default router;
