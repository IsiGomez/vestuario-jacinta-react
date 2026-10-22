import { useState } from 'react';

export default function MiniaturaImagen({ src, alt }) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <span className="badge bg-secondary text-wrap" style={{ width: '50px', fontSize: '10px' }}>
                Sin foto
            </span>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
            className="rounded" 
            onError={() => setError(true)} 
        />
    );
}