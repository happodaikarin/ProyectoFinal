import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Link } from 'react-router-dom';
import ResponsiveImage2 from './ResponsiveImage2';
import styles from './Recommendations.module.scss';

function Recommendations({ userId, userNickname, fetchRecommendations }) {
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
        productId: product.id,
        productName: product.name,
        productCategory: product.category,
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
                  <Link
                    to={`/productDetails/${rec.RecommendationID}`}
                    className={styles['product-card-link']}
                    onClick={() => saveInteraction(productDetails[rec.RecommendationID])}
                  >
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
