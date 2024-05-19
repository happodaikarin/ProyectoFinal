import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import ResponsiveImage2 from './ResponsiveImage2';
import styles from './PopularProducts.module.scss';

function PopularProducts({ userId, userNickname, fetchRecommendations }) {
  const [popularProducts, setPopularProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:5002/api/popular-products`);
        const data = await response.json();
        setPopularProducts(data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };

    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:4948/products`);
        const data = await response.json();
        const detailsMap = data.reduce((map, product) => {
          map[product.id] = product;
          return map;
        }, {});
        setProductDetails(detailsMap);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchPopularProducts();
    fetchProductDetails();
  }, []);

  const saveInteraction = (product) => {
    if (!product) {
      console.error("Product data is undefined.");
      return;
    }
    console.log("Saving interaction for", {
      userId,
      userNickname,
      productId: product.idProducto,
      productName: productDetails[product.idProducto]?.name,
      productCategory: productDetails[product.idProducto]?.category,
    });

    fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:5001/interactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        userNickname: userNickname,
        productId: product.idProducto,
        productName: productDetails[product.idProducto]?.name,
        productCategory: productDetails[product.idProducto]?.category,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Interaction saved:", data);
        fetchRecommendations(); // Actualizar recomendaciones tras guardar la interacción
      })
      .catch(error => console.error("Error saving interaction:", error));
  };

  return (
    <div className={styles['popular-products']}>
      <h2>Productos Populares</h2>
      <div className={styles['popular-products-container']}>
        <Swiper
          spaceBetween={50}
          slidesPerView={3} // predeterminado para pantallas más grandes
          className={styles.swiperContainer}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 3, spaceBetween: 50 }
          }}
        >
          {popularProducts.map(product => (
            <SwiperSlide key={product.idProducto} className={styles['popular-product-card']}>
              <Link to={`/productDetails/${product.idProducto}`} className={styles['popular-product-card-link']} onClick={() => saveInteraction(product)}>
                <ResponsiveImage2 src={productDetails[product.idProducto]?.imageUrl} alt={productDetails[product.idProducto]?.name} />
                <h2>{productDetails[product.idProducto]?.name}</h2>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default PopularProducts;
