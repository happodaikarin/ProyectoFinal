import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import styles from './HomePageCustomer.module.scss';
import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import PopularProducts from './components/popularProducts'; 
import ResponsiveImage from './components/ResponsiveImage';
import Recommendations from './components/Recomendations';
import useRecommendations from './hooks/useRecommendations';


function HomePageCustomer() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { authToken } = useAuth();
  let userId = null;
  let userNickname = '';


  if (authToken) {
    const decodedToken = jwtDecode(authToken);
    userId = decodedToken.sub;
    userNickname = decodedToken.nickname;
  }
  const { recommendations, fetchRecommendations } = useRecommendations(userId);

  useEffect(() => {
    fetch('http://localhost:4948/products')
      .then(response => response.json())
      .then(data => {
        const productsWithTextIds = data.map(product => ({
          ...product,
          id: String(product.id)
        }));
        setProducts(productsWithTextIds);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setError(true);
      });
  }, []);
  if (error) {
    return <div>Error loading products. Please try again later.</div>;
  }
  
  const saveInteraction = (product) => {
    if (!product) {
      console.error("Product data is undefined.");
      return;
    }
    console.log("Saving interaction for", userId, userNickname, product.id, product.name, product.category);
    fetch('http://localhost:5001/interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        userNickname: userNickname,
        productId: product.id,
        productName: product.name,
        productCategory: product.category
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        fetchRecommendations();  // Actualizar recomendaciones tras guardar la interacción
      })
      .catch(error => console.error("Error saving interaction:", error));
  };

  const navigateToCategory = (category) => {
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  const saveCategoryInteraction = (category) => {
    console.log("Saving category interaction for", userId, userNickname, category);
    fetch('http://localhost:5001/interactions/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        userNickname: userNickname,
        category: category
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log("Category interaction saved:", data);
      fetchRecommendations();  // Considerar si aún necesitas actualizar las recomendaciones aquí
    })
    .catch(error => {
      console.error("Error saving category interaction:", error);
    });
  };
  return (
    <div className={styles.homePageCustomer}>
        <Navbar />
        <h1 className={styles.catalogTitle}>CATÁLOGO DE PRODUCTOS BEER & COFFEE COMPANY</h1>

        <Recommendations userId={userId} />
        <PopularProducts />
        {products.length > 0 ? (
            Object.entries(
                products.reduce((acc, product) => {
                    if (!acc[product.category]) {
                        acc[product.category] = [];
                    }
                    acc[product.category].push(product);
                    return acc;
                }, {})
            ).map(([category, products]) => (
                <div key={category} className={styles.categorySection}>
                    <h2 className={styles.categoryTitle}>
                        {category}
                        <button
                            className={styles.categoryButton}
                            onClick={() => {
                                saveCategoryInteraction(category);
                                navigateToCategory(category);
                            }}
                        >
                            Ver más
                        </button>
                    </h2>

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
>                        {products.slice(0, 5).map((product) => (
                            <SwiperSlide key={product.id}>
                                <Link
                                    to={`/productDetails/${product.id}`}
                                    className={styles.productCardLink}
                                    onClick={() => saveInteraction(product)}
                                >
                                    <ResponsiveImage src={product.imageUrl} alt={product.name} />
                                    <div className={styles.productInfo}>
                                        <strong>{product.name}</strong>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            ))
        ) : (
            <p className={styles.loadingText}>Loading products...</p>
        )}
    </div>
);

}

export default HomePageCustomer;
