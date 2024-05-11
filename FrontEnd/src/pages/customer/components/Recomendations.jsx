import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Link } from 'react-router-dom';
import ResponsiveImage2 from './ResponsiveImage2';
import styles from './Recommendations.module.scss';

function Recommendations({ userId }) {
  const [recommendations, setRecommendations] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  useEffect(() => {
    const fetchRecommendationsAndProductDetails = async () => {
      try {
        const resRecommendations = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:5009/api/recommendations?user_id=${userId}`);
        const recommendationsData = await resRecommendations.json();
        console.log("Recommendations Data:", recommendationsData);  // Diagnóstico
        setRecommendations(recommendationsData);

        const resProducts = await fetch(`${import.meta.env.VITE_REACT_APP_API_URL}:4948/products`);
        const productsData = await resProducts.json();
        const detailsMap = productsData.reduce((map, product) => {
          map[product.id] = product;
          return map;
        }, {});
        setProductDetails(detailsMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchRecommendationsAndProductDetails();
  }, [userId]);

  return (
    <div className={styles['recommendations-container']}>
      <h2>Productos recomendados para ti</h2>
      <div className={styles['products-container']}>
        {recommendations.length > 0 ? (
          <Swiper
            spaceBetween={50}
            slidesPerView={3}
            className={styles.swiperContainer}
            breakpoints={{
              320: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 50
              }
            }}
          >   
            {recommendations.map((rec, index) => (
              <SwiperSlide key={`${rec.RecommendationID}-${index}`} className={styles['product-card']}>
                {productDetails[rec.RecommendationID] ? (
                  <Link to={`/productDetails/${rec.RecommendationID}`} className={styles['product-card-link']}>
                    <ResponsiveImage2 src={productDetails[rec.RecommendationID]?.imageUrl} alt={productDetails[rec.RecommendationID]?.name} />
                    <h2>{productDetails[rec.RecommendationID]?.name}</h2>
                  </Link>
                ) : (
                  <p>Loading product details...</p>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p>No hay recomendaciones disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default Recommendations;
