import { readFileSync, writeFileSync } from 'fs';

const productsFilePath = 'src/data/productos.json';
const cartsFilePath = 'src/data/carritos.json';

// Para leer productos desde el archivo JSON
export const readProducts = () => {
  const data = readFileSync(productsFilePath, { encoding: 'utf8', flag: 'r' });
  return JSON.parse(data);
}

// Para escribir productos al archivo JSON
export const writeProducts = () => {
  writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Función para leer carritos desde el archivo JSON
export const readCarts = () => {
  const data = readFileSync(cartsFilePath, 'utf-8');
  return JSON.parse(data);
}

// Función para escribir carritos al archivo JSON
export const writeCarts = () => {
  writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));
}


