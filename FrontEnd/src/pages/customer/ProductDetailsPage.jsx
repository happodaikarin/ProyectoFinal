  // ProductDetailsPage.js

  import React, { useEffect, useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { FaStar } from 'react-icons/fa';
  import styles from './ProductDetailsPage.module.scss';
  import Navbar from '../../components/Navbar';
  import { useAuth } from '../../context/AuthContext';
  import { jwtDecode } from 'jwt-decode';
  import Recommendations from './components/Recomendations'; // Importa el nuevo componente
  import useRecommendations from './hooks/useRecommendations';  // Asegúrate de importar el hook
  
  
  function ProductDetailsPage() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);
    const { authToken } = useAuth();
    const [orderCount, setOrderCount] = useState(0);
    const [showOrderListButton, setShowOrderListButton] = useState(false); 

    let userId = null;
    let userNickname = null;

    if (authToken) {
      const decodedToken = jwtDecode(authToken);
      userId = decodedToken.sub;
      userNickname = decodedToken.nickname;
    }
    const { recommendations, fetchRecommendations } = useRecommendations(userId);

    useEffect(() => {
      fetch(`http://localhost:4948/products/${productId}`)
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
      console.log("Sending rating for", product.name);  // Añade esto para depurar
      setRating(ratingValue);
      localStorage.setItem(`rating-${productId}-${userId}`, ratingValue.toString());
      // Enviar la calificación al servidor
      if (product) {
          fetch('http://localhost:5001/ratings', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  userId: userId,
                  userNickname: userNickname,
                  productId: productId,
                  productName: product.name,  // Asegúrate de que esto no es null
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
    
    // Enviar interacción al servidor
    fetch('http://localhost:5001/add-to-order', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId: userId, product_id: productId})
    }).then(response => response.json())
      .then(data => console.log("Add to order interaction saved:", data),fetchRecommendations())
      .catch(error => console.error("Error saving add to order interaction:", error));
      
  };


  const orderPaced = () => {
    const existingOrderList = JSON.parse(sessionStorage.getItem("orderList")) || [];
    const updatedOrderList = [...existingOrderList, product];
    sessionStorage.setItem("orderList", JSON.stringify(updatedOrderList));
    setOrderCount(updatedOrderList.length);
    setShowOrderListButton(true);
    goToOrderListPage();
    
    // Enviar interacción al servidor
    fetch('http://localhost:5001/order_placed', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({userId: userId, product_id: productId})
    }).then(response => response.json())
      .then(data => console.log("Add to order interaction saved:", data,fetchRecommendations()))
      .catch(error => console.error("Error saving add to order interaction:", error));
  };


    const goToOrderListPage = () => {
      navigate('/orderList');
    };

    return (
      <div className={styles.productDetailsContainer}> {/* Cambio de nombre de clase */}
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
        <button onClick={orderPaced} className={styles.finalizeOrderBtn}>Finalizar Pedido</button>             )}
      <span className={styles.orderCount}>Items en tu pedido: {orderCount}</span> 
              </div>
      </div>
    );
  }

  export default ProductDetailsPage;
