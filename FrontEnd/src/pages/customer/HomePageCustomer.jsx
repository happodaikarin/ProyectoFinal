import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './HomePageCustomer.css';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {jwtDecode} from 'jwt-decode'; // Corrije la importación si es necesario

function HomePageCustomer() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { authToken } = useAuth();
  let userId = null;

  if (authToken) {
    const decodedToken = jwtDecode(authToken);
    userId = decodedToken.sub;
  }

  useEffect(() => {
    fetch('http://localhost:4948/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error("Error fetching products:", error));
  }, []);

  const guardarInteraccion = (idProducto) => {
    const interaccion = {
      id_usuario: userId,
      id_producto: idProducto,
      tipo: "visualizacion",
      timestamp: new Date().toISOString(),
    };

    fetch('http://localhost:3030/interacciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interaccion),
    })
    .then(response => response.json())
    .then(data => console.log('Interacción guardada:', data))
    .catch(error => console.error('Error al guardar interacción:', error));
  };

  const guardarInteraccionCategoria = (categoria) => {
    const interaccion = {
      id_usuario: userId,
      id_producto: null,
      tipo: `navegacion_categoria de ${categoria}`, // Asegúrate de usar backticks aquí
      timestamp: new Date().toISOString(),
    };
  
    fetch('http://localhost:3030/interacciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(interaccion),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save interaction');
      }
      return response.json();
    })
    .then(data => console.log('Categoría navegación interacción guardada:', data))
    .catch(error => console.error('Error al guardar interacción de categoría:', error));
  };
  

  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  return (
    <div className="home-page-customer">
      <Navbar />
      <h1>Home Page Customer</h1>
      {Object.entries(productsByCategory).map(([category, products]) => (
        <div key={category} className="category-section">
          <h2>
            {category}
            <button 
              onClick={() => {
                guardarInteraccionCategoria(category);
                navigate(`/category/${encodeURIComponent(category)}`);
              }} 
              style={{ marginLeft: '10px' }}
            >
              Ver más
            </button>
          </h2>
          <Swiper spaceBetween={50} slidesPerView={3}>
            {products.slice(0, 5).map((product) => (
              <SwiperSlide key={product.id} onClick={() => {
                guardarInteraccion(product.id);
                navigate(`/productDetails/${product.id}`);
              }}>
                <Link to={`/productDetails/${product.id}`} className="product-card-link">
                  <img src={product.imageUrl} alt={product.name} className="product-image" />
                  <div className="product-info">
                    <strong>{product.name}</strong> - ${product.price}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ))}
    </div>
  );
}

export default HomePageCustomer;
