import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import './SalesHistoryPage.css';

function SalesHistoryPage() {
    const [salesHistory, setSalesHistory] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
      axios.get('http://localhost:1231/api/sales-history')
          .then(response => {
              if (Array.isArray(response.data)) {
                  const groupedByDate = response.data.reduce((acc, order) => {
                      // Extrae la fecha, ignorando la hora
                      const date = new Date(order.createdAt).toLocaleDateString();

                      // Prepara los items del pedido
                      let orderItems = [];
                      if (order.orderData && order.orderData !== "null") {
                          try {
                              const parsedOrderData = JSON.parse(order.orderData);
                              if (Array.isArray(parsedOrderData)) {
                                  orderItems = parsedOrderData;
                              } else if (parsedOrderData && Array.isArray(parsedOrderData.orderList)) {
                                  orderItems = parsedOrderData.orderList;
                              } else if (parsedOrderData && Array.isArray(parsedOrderData.items)) {
                                  orderItems = parsedOrderData.items;
                              }
                          } catch (error) {
                              console.error(`Error al parsear orderData para el orderId ${order.orderId}:`, error);
                          }
                      }

                      // Agrupa los pedidos por fecha
                      if (!acc[date]) {
                          acc[date] = [];
                      }
                      acc[date].push({ ...order, orderData: orderItems });
                      return acc;
                  }, {});

                  setSalesHistory(groupedByDate);
              } else {
                  throw new Error('La respuesta del servidor no es un arreglo');
              }
          })
          .catch(error => {
              console.error('Error al recuperar el historial de ventas:', error);
              setError('Hubo un error al recuperar el historial de ventas.');
          });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Navbar />
            <h1>Historial de Ventas</h1>
            <div className="sales-history-container">
                {Object.entries(salesHistory).map(([date, orders]) => (
                    <div key={date} className="date-group">
                        <h2>Fecha: {date}</h2>
                        {orders.map((order, index) => (
                            <div key={index} className="order-card">
                                <h3>Pedido ID: {order.orderId}</h3>
                                <p>Mesa Número: {order.tableNumber}</p>
                                <p>Fecha del Pedido: {new Date(order.createdAt).toLocaleString()}</p>
                                <p>Total: ${order.totalPrice}</p>
                                <h4>Items del Pedido:</h4>
                                <ul>
                                    {order.orderData.length > 0 ? order.orderData.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                            {item.name} - Cantidad: {item.quantity} - Precio: ${item.price}
                                        </li>
                                    )) : <li>No hay items en este pedido.</li>}
                                </ul>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SalesHistoryPage;