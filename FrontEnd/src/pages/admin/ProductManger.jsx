  import React, { useEffect, useState } from 'react';
  import Navbar from '../../components/Navbar';
  import './ProductManager.css';

  const ProductManager = () => {
    const categories = ['Bebidas Frias', 'Bebidas Calientes', 'Cervezas', 'Comidas','Postres','Vinos', 'Cócteles'];

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({ name: '', category: '', price: 0, description: '', imageUrl: '' });

    useEffect(() => {
      fetchProducts();
    }, []);

    const fetchProducts = () => {
      fetch('http://localhost:4948/products')
        .then(response => response.json())
        .then(data => {
          console.log("Productos:", data);
          setProducts(data);
        })
        .catch(error => console.error("Error fetching products:", error));
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setSelectedProduct({ ...selectedProduct, [name]: value });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const method = selectedProduct.id ? 'PUT' : 'POST';
      const endpoint = selectedProduct.id
        ? `http://localhost:4948/products/${selectedProduct.id}`
        : 'http://localhost:4948/products';

      fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedProduct),
      })

        .then(response => response.json())
        .then(() => {
          fetchProducts();
          setSelectedProduct({ name: '', category: '', price: 0, description: '', imageUrl: '' });
        })
        .catch(error => {
          console.error('Error saving product:', error);
        });
    };

    const handleEdit = (product) => {
      setSelectedProduct(product);
    };

    const handleDelete = (id) => {
      fetch(`http://localhost:4948/products/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          fetchProducts();
        })
        .catch(error => {
          console.error('Error deleting product:', error);
        });
    };
    const handleDirectSync = () => {
      // Primero, obtenemos los productos del microservicio de Product Manager
      fetch('http://localhost:4948/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Aquí irían los headers de autenticación si son necesarios
        },
      })
      .then(response => response.json())
      .then(products => {
        // Ahora, enviamos esos productos al microservicio de interacciones para sincronizar
        return fetch('http://localhost:3030/productos/sincronizar', { // Asume que este es el endpoint correcto
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Headers de autenticación si son necesarios
          },
          body: JSON.stringify(products),
        });
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Falló la sincronización con el servicio de interacciones');
        }
        return response.json();
      })
      .then(data => {
        console.log('Sincronización directa exitosa:', data);
        alert('Sincronización directa completada exitosamente');
      })
      .catch(error => {
        console.error('Error en la sincronización directa:', error);
        alert('Error en la sincronización directa');
      });
    };
    

    return (
      <div className="product-manager-container">
        <Navbar />
        <h1>Gestión de Productos</h1>
        <form onSubmit={handleSubmit} className="product-form">
          {/* Inputs and textarea for product data */}
          <input type="text" name="name" value={selectedProduct.name} onChange={handleChange} placeholder="Nombre" required />
          <select name="category" value={selectedProduct.category} onChange={handleChange} required>
            <option value="">Seleccione una categoría</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          <input type="number" name="price" value={selectedProduct.price} onChange={handleChange} placeholder="Precio" required />
          <textarea name="description" value={selectedProduct.description} onChange={handleChange} placeholder="Descripción" required></textarea>
          <input type="text" name="imageUrl" value={selectedProduct.imageUrl} onChange={handleChange} placeholder="URL de la Imagen" required />
          <button type="submit" className="submit-button">Guardar Producto</button>
          <button onClick={handleDirectSync} className="sync-button">Sincronizar Directamente</button>

        </form>
        <div className="product-list">
          <h2>Lista de Productos</h2>
          {products.map((product) => (
            <div key={product.id} className="product-item">
            <div className="product-info">
                <p>Nombre: {product.name}</p>
                <p>Categoría: {product.category}</p>
                <p>Precio: {product.price} COP</p> {/* Se asume que "COP" es el símbolo de los pesos colombianos */}
                <p>Descripción: {product.description}</p>
              </div>
              <div className="product-buttons">
                <button onClick={() => handleEdit(product)}>Editar</button>
                <button onClick={() => handleDelete(product.id)}>Eliminar</button>
              </div>

            </div>
          ))}


        </div>
      </div>
    );
  };

  export default ProductManager;
