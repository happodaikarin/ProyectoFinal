import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import styles from './CategoryProducts.module.scss';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';
import ResponsiveImage from './components/ResponsiveImage'; // Asegúrate que la ruta de importación es correcta
import { Link } from 'react-router-dom';
import useRecommendations from './hooks/useRecommendations';
import Recommendations from './components/Recomendations';

function CategoryProducts() {
    const { category } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const { authToken } = useAuth();
    let userId = null;
    let userNickname = null; // Asumiendo que el nickname también se decodifica del token

    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.sub;
      userNickname = decodedToken.nickname; // Asegúrate de que el token realmente tiene esta información
    }
    const { recommendations, fetchRecommendations } = useRecommendations(userId);

    useEffect(() => {
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:4948/products`)
      .then(response => response.json())
            .then(data => {
                const filteredProducts = data.filter(product => product.category === category);
                setProducts(filteredProducts);
            })
            .catch(error => console.error("Error fetching products:", error));
    }, [category]);

    
    const saveInteraction = (product) => {
      if (!product) {
        console.error("Product data is undefined.");
        return;
      }
      console.log("Saving interaction for", userId, userNickname, product.id, product.name, product.category);
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:5001/interactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          userNickname: userNickname,
          productId: product.id,
          productName: product.name,
          productCategory: product.category
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          fetchRecommendations();  // Actualizar recomendaciones tras guardar la interacción
        })
        .catch(error => console.error("Error saving interaction:", error));
    };
  
    

      return (
        <div>
            <Navbar />
            <h1>Productos de {category}</h1>
            <Recommendations userId={userId} />
            <div className={styles['products-container']}>
                {products.map((product) => (
                    <div key={product.id} className={styles['product-card']}>
                        <Link to={`/productDetails/${product.id}`} className={styles['product-card-link']} onClick={() => saveInteraction(product)}>
                            <ResponsiveImage src={product.imageUrl} alt={product.name} />
                            <h2>{product.name}</h2>
                            <p>${product.price}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoryProducts;
