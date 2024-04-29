import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import ResponsiveImage2 from './ResponsiveImage2';
import styles from './PopularProducts.module.scss';

function PopularProducts() {
  const [popularProducts, setPopularProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await fetch('http://localhost:5002/api/popular-products');
        const data = await response.json();
        setPopularProducts(data.slice(0, 10));
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };

    const fetchProductDetails = async () => {
      try {
        const response = await fetch('http://localhost:4948/products');
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
  return (
    <div className={styles['popular-products']}>
      <h2>Productos Populares</h2>
      <div className={styles['popular-products-container']}>
      <Swiper
  spaceBetween={50}
  slidesPerView={3} // predeterminado para pantallas más grandes
  className={styles.swiperContainer}
  breakpoints={{
    // Cuando el ancho de la ventana es >= 320px
    320: {
      slidesPerView: 2, // 2 slides en vez de 3 para pantallas pequeñas
      spaceBetween: 20  // Puedes ajustar el espacio entre slides si es necesario
    },
    // Cuando el ancho de la ventana es >= 768px
    768: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    // Cuando el ancho de la ventana es >= 1024px
    1024: {
      slidesPerView: 3,
      spaceBetween: 50
    }
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
