import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './OrderNotificationsPage.module.scss';
import Navbar from '../../components/Navbar';
import axios from 'axios';

function OrderNotificationsPage() {
  const { authToken, nickname } = useAuth();
  const [orders, setOrders] = useState(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders'));
    return savedOrders || [];
  });

  const [clickedOrders, setClickedOrders] = useState(new Set());
  const [unreadOrders, setUnreadOrders] = useState([]);
  const [savedOrders, setSavedOrders] = useState(() => {
    const saved = localStorage.getItem('savedOrders');
    return new Set(saved ? JSON.parse(saved) : []);
  }); 
  
  useEffect(() => {
    const client = new WebSocket('ws://localhost:1231');
    client.onopen = () => {
      console.log('Conexión WebSocket establecida.');
    };
    client.onmessage = (message) => {
      const order = JSON.parse(message.data);
      setOrders((prevOrders) => {
        const updatedOrders = [order, ...prevOrders];
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        setUnreadOrders((prevUnreadOrders) => prevUnreadOrders.map(index => index + 1).concat(0));
        return updatedOrders;
      });
    };
    return () => {
      client.close();
      console.log('Conexión WebSocket cerrada.');
    };
  }, []);

  const handleNotificationClick = (index) => {
    setClickedOrders(prev => new Set(prev).add(index));
  };

  const handleRemoveNotification = (index) => {
    setOrders(prev => {
      const updatedOrders = prev.filter((_, i) => i !== index);
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      return updatedOrders;
    });
    setClickedOrders(prev => {
      const newClicked = new Set(prev);
      newClicked.delete(index);
      return newClicked;
    });
    setUnreadOrders(prev => prev.filter(id => id !== index));
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
    <div className={styles['notification-container']}>
      <Navbar />
      <h1 className={styles['notifications-title']}>Notificaciones de Pedidos</h1>
      <p className={styles['welcome-message']}>Bienvenido, {nickname}.</p>
      {orders.map((order, index) => (
        <div key={index} className={`${styles['notification']} ${clickedOrders.has(index) ? styles['clicked'] : ''} ${unreadOrders.includes(index) ? styles['unread'] : ''} ${savedOrders.has(order.orderId) ? styles['saved'] : ''}`} onClick={() => handleNotificationClick(index)}>
          <div className={styles['notification-content']}>
            <div className={styles['notification-header']}>
              <span className={styles['notification-title']}>Pedido ID: {order.orderId}</span>
              <span className={styles['notification-details']}>Mesa Número: <span>{order.tableNumber}</span></span>
            </div>
            <div className={styles['notification-details']}>
              <span>Cliente:</span> {order.customerNickname || nickname}
            </div>
            <div className={styles['notification-details']}>
              <span>Fecha del Pedido:</span> {new Date(order.createdAt).toLocaleString()}
            </div>
            <div className={styles['notification-details']}>
              <span>Total:</span> ${order.totalPrice}
            </div>
            <ul className={styles['order-list']}>
              {order.orderList?.map((item, itemIndex) => (
                <li key={itemIndex} className={styles['order-item']}>
                  {item.name} - Cantidad: {item.quantity} - Precio: ${item.price}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles['notification-footer']}>
            {!savedOrders.has(order.orderId) && (
              <button onClick={(e) => {
                e.stopPropagation();
                handleSaveToSalesHistory(order);
              }} className={styles['save-button']}>Guardar en Historial de Ventas</button>
            )}
            <button onClick={(e) => {
              e.stopPropagation();
              handleRemoveNotification(index);
            }} className={styles['delete-button']} style={{ marginLeft: '10px' }}>Eliminar Notificación</button>
          </div>
        </div>
      ))}
    </div>
  );

}

export default OrderNotificationsPage;
