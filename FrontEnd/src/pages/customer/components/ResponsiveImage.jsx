  import React, { useState, useEffect, useRef } from 'react';

  function ResponsiveImage({ src, alt }) {
    const imgRef = useRef(null);
    const [height, setHeight] = useState('auto');

    useEffect(() => {
      const adjustHeight = () => {
        if (imgRef.current) {
          const width = imgRef.current.offsetWidth;
          setHeight(`${width}px`); // Esto hará que la altura sea igual al ancho, ajustando la imagen a un cuadrado
        }
      };

      window.addEventListener('resize', adjustHeight);
      adjustHeight(); // Llamarlo inicialmente

      return () => {
        window.removeEventListener('resize', adjustHeight);
      };
    }, []);

    return (
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        style={{ width: '100%', height: height, objectFit: 'cover' }}
      />
    );
  }

  export default ResponsiveImage;