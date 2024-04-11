import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './CategoryProducts.css';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';

function CategoryProducts() {
    const { category } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const { authToken } = useAuth();
    let userId = null;

    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.sub;
    }
    useEffect(() => {
        fetch(`http://localhost:4948/products`)
            .then(response => response.json())
            .then(data => {
                const filteredProducts = data.filter(product => product.category === category);
                setProducts(filteredProducts);
            })
            .catch(error => console.error("Error fetching products:", error));
    }, [category]);

    const guardarInteraccionProducto = (productId) => {
        const interaccionData = {
            id_usuario: userId,
            id_producto: productId,
            tipo: 'visualizacion_producto',
            timestamp: new Date().toISOString(),
        };

        fetch('http://localhost:3030/interacciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(interaccionData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al registrar interacción de producto');
            }
            return response.json();
        })
        .then(data => console.log('Interacción de producto registrada:', data))
        .catch(error => console.error(error));

        // Navegar a los detalles del producto
        navigate(`/productDetails/${productId}`);
    };

    return (
        <div>
            <Navbar />
            <h1>Productos de {category}</h1>
            <div className="products-container">
                {products.map((product) => (
                    <div key={product.id} className="product-card" onClick={() => guardarInteraccionProducto(product.id)}>
                        <img src={product.imageUrl} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>${product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryProducts;
