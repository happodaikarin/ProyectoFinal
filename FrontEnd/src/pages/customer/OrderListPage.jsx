import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importa el contexto de autenticación
import { jwtDecode } from 'jwt-decode';
import './OrderListPage.css'; // Importa el archivo CSS
import Navbar from '../../components/Navbar';


function OrderListPage() {
  const { authToken } = useAuth(); // Obtén el contexto de autenticación
  const [orderList, setOrderList] = useState([]);
  const [tableNumber, setTableNumber] = useState('');
  const [nickname, setNickname] = useState(''); // Agrega el estado para el nickname

  useEffect(() => {
    // Cargar la lista de pedidos desde el almacenamiento local al cargar la página
    const loadedOrderList = JSON.parse(localStorage.getItem("orderList")) || [];
    setOrderList(loadedOrderList);

    // Obtener el nickname del contexto de autenticación al cargar la página
    if (authToken) {
      try {
        const decoded = jwtDecode(authToken);
        setNickname(decoded.nickname);
      } catch (error) {
        console.error("Error decoding the token:", error);
      }
    }
  }, [authToken]); // Asegúrate de incluir authToken en la lista de dependencias

  const removeProductFromOrderList = (indexToRemove) => {
    // Eliminar un producto de la lista de pedidos
    const filteredOrderList = orderList.filter((_, index) => index !== indexToRemove);
    setOrderList(filteredOrderList);
    localStorage.setItem("orderList", JSON.stringify(filteredOrderList));
  };

  const handlePlaceOrder = () => {
    // Crear un nuevo pedido y enviarlo al servidor a través de WebSocket
    const orderData = JSON.stringify({
      orderList,
      totalPrice: calculateTotalPrice().toString(),
      tableNumber: tableNumber || null,
      orderId: `order_${new Date().getTime()}`,
      // Include the nickname in the order data
      customerNickname: nickname
    });

    const socket = new WebSocket("ws://localhost:1231");
    socket.onopen = () => {
      socket.send(orderData);
      console.log("Pedido enviado:", orderData);
      alert("Pedido realizado con éxito!");
      setOrderList([]); // Limpiar la lista de pedidos después de enviar el pedido
      localStorage.removeItem("orderList"); // Limpiar el almacenamiento local
    };
  };

  const calculateTotalPrice = () => {
    // Calcular el precio total de los productos en la lista de pedidos
    return orderList.reduce((acc, product) => acc + product.price, 0);
  };

  const handleTableNumberChange = (e) => {
    // Validar el número de mesa entre 1 y 10
    const value = e.target.value;
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 10)) {
      setTableNumber(value);
    }
  };

  return (
    <div className="order-list-page">
      <Navbar />
      <h1>Lista de Pedidos</h1>
      <input  
        type="number"
        placeholder="Número de Mesa (opcional)"
        value={tableNumber}
        onChange={handleTableNumberChange} // Usa la función de validación
        style={{ margin: "10px 0", padding: "8px" }}
      />
      {orderList.length > 0 ? (
        <>
          <ul>
            {orderList.map((product, index) => (
              <li key={index}>
                <img src={product.imageUrl} alt={product.name} style={{ width: "50px" }} />
                {product.name} - {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(product.price)}
                <button onClick={() => removeProductFromOrderList(index)}>Borrar</button>
              </li>
            ))}
          </ul>
          <p>Total: {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(calculateTotalPrice())}</p>
          <button onClick={handlePlaceOrder} className="place-order-btn">Realizar Pedido</button>
        </>
      ) : (
        <p>No hay productos en tu lista de pedidos.</p>
      )}
    </div>
  );
}

export default OrderListPage;
