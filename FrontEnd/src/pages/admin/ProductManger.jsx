    import React, { useEffect, useState } from 'react';
    import Navbar from '../../components/Navbar';
    import styles from './ProductManager.module.scss';

    const ProductManager = () => {
      const categories = ['Bebidas Frias', 'Bebidas Calientes', 'Cervezas', 'Comidas','Postres','Vinos', 'Cócteles'];

      const [products, setProducts] = useState([]);
      const [selectedProduct, setSelectedProduct] = useState({ name: '', category: '', price: 0, description: '', imageUrl: '' });

      useEffect(() => {
        fetchProducts();
      }, []);

      const fetchProducts = () => {
        fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:4948/products`)
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
          ? `${import.meta.env.VITE_REACT_APP_API_URL}:4948/products/${selectedProduct.id}`
          : `${import.meta.env.VITE_REACT_APP_API_URL}:4948/products`;

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
        fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:4948/products/${id}`, {
          method: 'DELETE',
        })
          .then(() => {
            fetchProducts();
          })
          .catch(error => {
            console.error('Error deleting product:', error);
          });
      };
      return (
        <div className={styles['product-manager-container']}>
            <Navbar />
            <h1 className={styles['manager-title']}>Gestión de Productos</h1>
            <form onSubmit={handleSubmit} className={styles['product-form']}>
                {/* Inputs and textarea for product data */}
                <input
                    className={styles['input']}
                    type="text"
                    name="name"
                    value={selectedProduct.name}
                    onChange={handleChange}
                    placeholder="Nombre"
                    required
                />
                <input
                    className={styles['input']}
                    type="text"
                    name="category"
                    value={selectedProduct.category}
                    onChange={handleChange}
                    placeholder="Categoría"
                    required
                />
                <input
                    className={styles['input']}
                    type="number"
                    name="price"
                    value={selectedProduct.price}
                    onChange={handleChange}
                    placeholder="Precio"
                    required
                />
                <textarea
                    className={styles['textarea']}
                    name="description"
                    value={selectedProduct.description}
                    onChange={handleChange}
                    placeholder="Descripción"
                    required
                ></textarea>
                <input
                    className={styles['input']}
                    type="text"
                    name="imageUrl"
                    value={selectedProduct.imageUrl}
                    onChange={handleChange}
                    placeholder="URL de la Imagen"
                    required
                />
                <button type="submit" className={styles['submit-button']}>Guardar Producto</button>
            </form>
            <div className={styles['product-list']}>
                <h2 className={styles['list-title']}>Lista de Productos</h2>
                {products.map((product) => (
                    <div key={product.id} className={styles['product-item']}>
                        <div className={styles['product-info']}>
                            <p className={styles['info-item']}>Nombre: {product.name}</p>
                            <p className={styles['info-item']}>Categoría: {product.category}</p>
                            <p className={styles['info-item']}>Precio: {product.price} COP</p>
                            <p className={styles['info-item']}>Descripción: {product.description}</p>
                        </div>
                        <div className={styles['product-buttons']}>
                            <button onClick={() => handleEdit(product)} className={styles['edit-button']}>Editar</button>
                            <button onClick={() => handleDelete(product.id)} className={styles['delete-button']}>Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
    };

    export default ProductManager;
