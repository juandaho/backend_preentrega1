import fs, { existsSync } from "fs";

export class ProductManager {
  constructor(path) {
    this.path = path;
    this.productos = [];
  }

  async getProduct(info = {}) {
    const { limit } = info;

    try {
      if (existsSync(this.path)) {
        const productosLista = await fs.promises.readFile(this.path, "utf-8");
        let productosListaJSON = JSON.parse(productosLista);

        productosListaJSON = productosListaJSON.map((producto) => {
          return {
            ...producto,
            status: producto.status === undefined ? true : producto.status,
          };
        });
        this.productos = productosListaJSON;
        if (limit) {
          return productosListaJSON.slice(0, limit);
        } else {
          return productosListaJSON;
        }
      } else {
        console.error("Error al presentar los productos");
        return [];
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductById(id) {
    const productosCompletos = await this.getProduct();
    const encontrado = productosCompletos.find((element) => element.id === id);
    return encontrado;
  }

  async idGenerator() {
    if (existsSync(this.path)) {
      const listaProductos = await this.getProduct({});
      const counter = listaProductos.length;
      if (counter == 0) {
        return 1;
      } else {
        return listaProductos[counter - 1].id + 1;
      }
    }
  }

  async addProduct(obj) {
    const {
      title,
      description,
      price,
      thumbnail,
      category,
      status = true,
      code,
      stock,
    } = obj;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !category ||
      !code ||
      !stock
    ) {
      console.log("Ingrese los datos del producto");
      return;
    } else {
      const codigo = this.productos.find((elemento) => elemento.code === code);
      if (codigo) {
        console.log("El codigo esta repetido");
        return;
      } else {
        const idgenerado = await this.idGenerator();
        const productoAgregado = {
          id: idgenerado,
          title,
          description,
          price,
          thumbnail,
          category,
          status,
          code,
          stock,
        };
        this.productos.push(productoAgregado);
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(this.productos, null, 2)
        );
      }
    }
  }

  async updateProduct(pid, obj) {
    const id = parseInt(pid);
    const {
      title,
      description,
      price,
      thumbnail,
      category,
      status = true,
      code,
      stock,
    } = obj;

    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !category ||
      !code ||
      !stock
    ) {
      console.log("Ingrese los datos del producto para su actualización");
      return;
    } else {
      const productosActuales = await this.getProduct();
      const nuevosProductosActuales = productosActuales.map((elemento) => {
        if (elemento.id === id) {
          return {
            ...elemento,
            title,
            description,
            price,
            thumbnail,
            code,
            status,
            category,
            stock,
          };
        } else {
          return elemento;
        }
      });
      this.productos = nuevosProductosActuales;
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(nuevosProductosActuales, null, 2)
      );
      console.log("Producto actualizado");
    }
  }

  async deleteProduct(id) {
    id = parseInt(id);
    const productosCompletos = await this.getProduct();
    const productosActualizados = productosCompletos.filter(
      (elemento) => elemento.id !== id
    );
    this.productos = productosActualizados;
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productosActualizados, null, 2)
    );
    console.log(`Producto con ID ${id} eliminado`);
  }
}
