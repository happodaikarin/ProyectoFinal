import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ResponsiveImage from './components/ResponsiveImage';
import styles from './SearchPage.module.scss';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      // Asegúrate de que esta URL es correcta y apunta a tu servicio de Flask
      const response = await fetch(`http://localhost:5005/search?q=${query}`);
      if (!response.ok) {
        throw new Error(`Error al obtener los productos: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length === 0) {
        setError('No se encontraron productos');
      }
      setProducts(data);
    } catch (error) {
      setError('Error al buscar productos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['search-container']}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        className={styles['search-input']}
      />
      <button onClick={handleSearch} className={styles['search-button']}>Buscar</button>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}
      <div className={styles['products-container']}>
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className={styles['product-card']}>
              <Link to={`/productDetails/${product.id}`}>
                <ResponsiveImage src={product.image_url} alt={product.name} />
                <h2>{product.name}</h2>
                <p>Precio: ${product.price}</p>
              </Link>
            </div>
          ))
        ) : (!loading && <p>No se encontraron productos con el término de búsqueda.</p>)}
      </div>
    </div>
  );
};

export default SearchPage;
