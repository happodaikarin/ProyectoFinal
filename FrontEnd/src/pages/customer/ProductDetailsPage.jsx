// ProductDetailsPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import styles from './ProductDetailsPage.module.scss';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import Recommendations from './components/Recomendations';
import useRecommendations from './hooks/useRecommendations';

function ProductDetailsPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(null);
  const [hover, setHover] = useState(null);
  const { authToken } = useAuth();
  const [orderCount, setOrderCount] = useState(0);
  const [showOrderListButton, setShowOrderListButton] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userNickname, setUserNickname] = useState(null);

  const { recommendations, fetchRecommendations } = useRecommendations(userId);

  useEffect(() => {
    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      setUserId(decodedToken.sub);
      setUserNickname(decodedToken.nickname);
    }
  }, [authToken]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:4948/products/${productId}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error("Error fetching product details:", error));
    setRating(null);
  }, [productId]);

  useEffect(() => {
    const userRating = localStorage.getItem(`rating-${productId}-${userId}`);
    if (userRating) {
      setRating(parseInt(userRating));
    }
  }, [productId, userId]);

  const handleRatingChange = (ratingValue) => {
    setRating(ratingValue);
    localStorage.setItem(`rating-${productId}-${userId}`, ratingValue.toString());
    if (product) {
      fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:5001/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          userNickname: userNickname,
          productId: productId,
          productName: product.name,
          productCategory: product.category,
          rating: ratingValue
        }),
      })
        .then(response => response.json())
        .then(data => {
          console.log("Rating saved:", data);
          fetchRecommendations();
        })
        .catch(error => console.error("Error saving rating:", error));
    } else {
      console.error("Product data is not loaded yet.");
    }
  };

  const orderProductDirectly = () => {
    const existingOrderList = JSON.parse(sessionStorage.getItem("orderList")) || [];
    const updatedOrderList = [...existingOrderList, product];
    sessionStorage.setItem("orderList", JSON.stringify(updatedOrderList));
    setOrderCount(updatedOrderList.length);
    setShowOrderListButton(true);

    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:5001/add-to-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, product_id: productId })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Add to order interaction saved:", data);
        fetchRecommendations();
      })
      .catch(error => console.error("Error saving add to order interaction:", error));
  };

  const orderPlaced = () => {
    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:5001/order_placed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: userId, product_id: productId })
    })
      .then(response => response.json())
      .then(data => {
        console.log("Order placed interaction saved:", data);
        fetchRecommendations();
      })
      .catch(error => {
        console.error("Error saving order placed interaction:", error);
      })
      .finally(() => {
        // Esta línea se ejecutará tanto si la promesa se resuelve con éxito como si se rechaza
        goToOrderListPage(); // Navegar a la página de lista de pedidos
      });
  };
  
  const goToOrderListPage = () => {
    navigate('/orderList');
  };
  

  return (
    <div className={styles.productDetailsContainer}>
      <Navbar showOrderListButton={showOrderListButton} />
      <Recommendations userId={userId} />

      <h1 className={styles.productName}>{product?.name}</h1>
      <img src={product?.imageUrl} alt={product?.name} className={styles.productImage} />
      <p className={styles.productDescription}>{product?.description}</p>
      <strong className={styles.productPrice}>${product?.price}</strong>
      <div className={styles.starRatingContainer}>
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <label key={index} className={styles.starLabel}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                style={{ display: 'none' }}
                onChange={() => handleRatingChange(ratingValue)}
              />
              <FaStar
                size={40}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(null)}
                color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                style={{ cursor: 'pointer', marginRight: '8px' }}
              />
            </label>
          );
        })}
      </div>
      <div className={styles.productActionButtons}>
        <button onClick={orderProductDirectly} className={styles.addToOrderListBtn}>Añadir a una Lista de Pedidos</button>
        {showOrderListButton && (
          <button onClick={orderPlaced} className={styles.finalizeOrderBtn}>Finalizar Pedido</button>
        )}
        <span className={styles.orderCount}>Items en tu pedido: {orderCount}</span>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
