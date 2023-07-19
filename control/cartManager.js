import fs, { existsSync } from "fs";

export class CartManager {
  constructor(path) {
    this.path = path;
  }

 

  async getCarts() {
    try {
      if (existsSync(this.path)) {
        const cartLista = await fs.promises.readFile(this.path, "utf-8");
        let cartListaJSON = JSON.parse(cartLista);
        return cartListaJSON;
      } else {
        console.error("Error al presentar los cart");
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
  }


  async getCartById(id) {
    const cartCompletos = await this.getCarts();
    const encontrado = cartCompletos.find(
      (element) => element.id === Number(id)
    );
    return encontrado;
  }


  async idGenerator() {
    if (existsSync(this.path)) {
      const listaCart = await this.getCarts({});
      const counter = listaCart.length;
      if (counter == 0) {
        return 1;
      } else {
        return listaCart[counter - 1].id + 1;
      }
    }
  }

 
  async addCart() {
    const cartList = await this.getCarts();
    const id = await this.idGenerator();
    const newCart = {
      id,
      products: [],
    };

    cartList.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(cartList, null, 2));
  }

  addProductToCart = async (cid, pid) => {
    const listaCarts = await this.getCarts();

    const cart = listaCarts.find((e) => e.id === cid);

    const productoIndex = cart.products.findIndex(
      (element) => element.pid === pid
    );

    if (productoIndex !== -1) {
      cart.products[productoIndex].quantity++;
    } else {
      cart.products.push({
        pid,
        quantity: 1,
      });
    }
    await fs.promises.writeFile(this.path, JSON.stringify(listaCarts, null, 2));
  };
}
