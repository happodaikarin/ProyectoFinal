import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación
import './OrderNotificationsPage.css'; // Importa el archivo CSS
import Navbar from '../../components/Navbar';
import axios from 'axios';

function OrderNotificationsPage() {
  const { authToken, nickname } = useAuth(); // Obtiene el authToken y el nickname del contexto de autenticación
  const [orders, setOrders] = useState(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders'));
    return savedOrders || [];
  });

  const [clickedOrders, setClickedOrders] = useState([]);
  const [unreadOrders, setUnreadOrders] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]); // Agregar estado para historial de ventas

  useEffect(() => {
    const client = new WebSocket('ws://localhost:1231');

    client.onopen = () => {
      console.log('Conexión WebSocket establecida.');
    };

    client.onmessage = (message) => {
      const order = JSON.parse(message.data);
      console.log('Pedido recibido:', order);
      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders, order];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setUnreadOrders((prevUnreadOrders) => [...prevUnreadOrders, updatedOrders.length - 1]);
        return updatedOrders;
      });
    };

    return () => {
      client.close();
      console.log('Conexión WebSocket cerrada.');
    };
  }, []);

  const handleNotificationClick = (index) => {
    setClickedOrders((prevClickedOrders) => [...prevClickedOrders, index]);
    setUnreadOrders((prevUnreadOrders) => prevUnreadOrders.filter((item) => item !== index));
  };

  const handleSaveToSalesHistory = (order) => {
    console.log('Datos del pedido:', order);
  
    axios.post('http://localhost:1231/api/sales-history', {
      orderId: order.orderId,
      tableNumber: order.tableNumber,
      totalPrice: order.totalPrice,
      // Asegúrate de que esto sea un objeto o arreglo válido que se pueda convertir en JSON.
      orderData: order.orderList, // Suponiendo que orderList es el array o objeto que quieres guardar.
      customerNickname: order.customerNickname
    })
    .then((response) => {
      console.log('Respuesta del servidor:', response.data);
      console.log('Pedido guardado en el historial de ventas', response);
    })
    .catch((error) => {
      console.error('Error al guardar el pedido en el historial de ventas:', error);
    });
  };
  
  
  
  
  


  return (
    <div className="notification-container">
      <Navbar />
      <h1>Notificaciones de Pedidos</h1>
      <p>Bienvenido, {nickname}.</p> {/* Muestra el nickname del cliente */}
      {orders.map((order, index) => (
        <div key={index} className={`notification ${clickedOrders.includes(index) ? 'clicked' : ''} ${unreadOrders.includes(index) ? 'unread' : ''}`}>
          <div className="notification-content">
            <div className="notification-header">
              <span className="notification-title">Pedido ID: {order.orderId}</span>
              <span className="notification-details">Mesa Número: <span>{order.tableNumber}</span></span>
            </div>
            <div className="notification-details">
              <span>Cliente:</span> {order.customerNickname || nickname}
            </div>
            <div className="notification-details">
              <span>Fecha del Pedido:</span> {new Date(order.createdAt).toLocaleString()}
            </div>
            <div className="notification-details">
              <span>Total:</span> ${order.totalPrice}
            </div>
            <ul>
              {order.orderList.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {item.name} - Cantidad: {item.quantity} - Precio: ${item.price}
                </li>
              ))}
            </ul>
          </div>
          <div className="notification-footer">
            <button onClick={() => handleSaveToSalesHistory(order)}>Guardar en Historial de Ventas</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderNotificationsPage;
