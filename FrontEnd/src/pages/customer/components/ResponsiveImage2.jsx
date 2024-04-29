import React from 'react';

function ResponsiveImage2({ src, alt }) {
    return (
        <img
            src={src}
            alt={alt}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} // Aseguramos que la imagen se ajuste dentro del espacio
        />
    );
}

export default ResponsiveImage2;
