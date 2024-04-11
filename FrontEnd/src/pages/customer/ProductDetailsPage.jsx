import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './ProductDetailsPage.css';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode';


function ProductDetailsPage() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  // Utiliza el useState para inicializar el rating con el valor almacenado en localStorage si existe
  const [rating, setRating] = useState(localStorage.getItem(`rating-${productId}`) ? parseInt(localStorage.getItem(`rating-${productId}`)) : null);
  const [hover, setHover] = useState(null);
  const { authToken } = useAuth();
  let userId = null;

  if (authToken) {
    const decodedToken = jwtDecode(authToken);
    userId = decodedToken.sub;
  }


  useEffect(() => {
    fetch(`http://localhost:4948/products/${productId}`)
      .then(response => response.json())
      .then(data => setProduct(data))
      .catch(error => console.error("Error fetching product details:", error));
  }, [productId]);

  const recordRatingInteraction = (ratingValue) => {
    localStorage.setItem(`rating-${productId}`, ratingValue);
    fetch('http://localhost:3030/interacciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: userId,
        id_producto: productId,
        tipo: 'rating',
        rating: ratingValue,
        timestamp: new Date().toISOString(),
      }),
    })
    .then(response => response.json())
    .then(data => console.log('Rating interaction recorded:', data))
    .catch(error => console.error('Error recording rating interaction:', error));
  };

  const recordAddToListInteraction = (productToAdd) => {
    fetch('http://localhost:3030/interacciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_usuario: userId,
        id_producto: productToAdd.id,
        tipo: 'añadido_a_lista',
        timestamp: new Date().toISOString(),
      }),
    })
    .then(response => response.json())
    .then(data => console.log('Add to list interaction recorded:', data))
    .catch(error => console.error('Error recording add to list interaction:', error));
  };

  const orderProductDirectly = () => {
    console.log("Pedido directo del producto:", product.name);
    alert("Producto pedido directamente!");
    // Considera agregar una llamada a una función para grabar esta interacción si es necesario
  };

  const addProductToOrderList = (productToAdd) => {
    let orderList = JSON.parse(localStorage.getItem("orderList")) || [];
    orderList.push(productToAdd);
    localStorage.setItem("orderList", JSON.stringify(orderList));
    alert("Producto añadido a la lista de pedidos");
    recordAddToListInteraction(productToAdd); // Grabar la interacción al añadir a la lista
  };

  return (
    <div className="product-details-container">
      <Navbar />
      <h1>{product?.name}</h1>
      <img src={product?.imageUrl} alt={product?.name} className="product-image" />
      <p>{product?.description}</p>
      <strong>${product?.price}</strong>
      <div className="star-rating-container">
        {[...Array(5)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => {
                  setRating(ratingValue);
                  recordRatingInteraction(ratingValue); // Grabar la interacción de rating
                }}
                style={{ display: 'none' }}
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
      <div className="product-action-buttons">
        <button onClick={orderProductDirectly} className="order-directly-btn">Pedir Producto</button>
        <button onClick={() => addProductToOrderList(product)} className="add-to-order-list-btn">Añadir a una Lista de Pedidos</button>
      </div>
    </div>
  );
}

export default ProductDetailsPage;

