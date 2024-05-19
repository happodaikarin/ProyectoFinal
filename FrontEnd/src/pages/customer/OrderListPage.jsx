import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode'; // Correct import statement for jwt-decode
import styles from './OrderListPage.module.scss';
import Navbar from '../../components/Navbar';

function OrderListPage({ showOrderListButton }) {
  const { authToken } = useAuth();
  const [orderList, setOrderList] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const loadedOrderList = JSON.parse(sessionStorage.getItem("orderList")) || [];
    const groupedProducts = groupProducts(loadedOrderList);
    setOrderList(groupedProducts);

    if (authToken) {  
      try {
        const decoded = jwtDecode(authToken);
        setNickname(decoded.nickname);
      } catch (error) {
        console.error("Error decoding the token:", error);
      }
    }
  }, [authToken]);

  const groupProducts = (products) => {
    const productMap = {};
    products.forEach(product => {
      const productId = product.id;
      if (!productMap[productId]) {
        productMap[productId] = { ...product, quantity: 1 };
      } else {
        productMap[productId].quantity++;
      }
    });
    return Object.values(productMap);
  };

  const removeProductFromOrderList = (productId) => {
    const updatedOrderList = orderList.map(product => {
      if (product.id === productId && product.quantity > 1) {
        return { ...product, quantity: product.quantity - 1 };
      } else if (product.id === productId) {
        return null;
      }
      return product;
    }).filter(Boolean);
    sessionStorage.setItem("orderList", JSON.stringify(updatedOrderList));
    setOrderList(updatedOrderList);
  };

  const socket = new WebSocket(`${import.meta.env.VITE_REACT_APP_API_URL2}:1231`);

  const handlePlaceOrderClick = () => {
    const total = calculateTotalPrice();
    let tableNum = tableNumber ? parseInt(tableNumber) : null;
    if (isNaN(tableNum)) {
      tableNum = null;
    }
  
    const orderData = {
      tableNumber: tableNum, // Asegúrate de que es null si es necesario
      customerNickname: nickname,
      totalPrice: total,
      orderList: orderList,
      createdAt: new Date().toISOString() // Agregar marca de tiempo
    };
  
    const orderJson = JSON.stringify(orderData);
    socket.send(orderJson);
    console.log("Pedido enviado:", orderJson);
  
    alert("Pedido realizado con éxito!");
    setOrderList([]);
    sessionStorage.removeItem("orderList");
  };
  
  

  const calculateTotalPrice = () => {
    return orderList.reduce((acc, product) => acc + (product.price * product.quantity), 0);
  };

  return (
    <div className={styles['order-list-page']}>
      <Navbar showOrderListButton={showOrderListButton} />
      <h1>Lista de Pedidos</h1>
      <input
            type="number"
            placeholder="Número de Mesa (opcional)"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className={styles['input-number']}
        />
      {orderList.length > 0 ? (
        <>
          <ul>
            {orderList.map((product, index) => (
              <li key={index}>
                <img src={product.imageUrl} alt={product.name} style={{ width: "50px" }} />
                {product.name} - {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(product.price)} x {product.quantity}
                <button onClick={() => removeProductFromOrderList(product.id)}>Reducir</button>
              </li>
            ))}
          </ul>
          <p>Total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(calculateTotalPrice())}</p>
          <button onClick={handlePlaceOrderClick} className="place-order-btn">Realizar Pedido</button>
        </>
      ) : (
        <p>No hay productos en tu lista de pedidos.</p>
      )}
    </div>
  );
}

export default OrderListPage;
