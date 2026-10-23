import { useState } from 'react';

export default function MiniaturaImagen({ src, alt }) {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <span className="badge bg-secondary text-wrap miniatura-vacia">
                Sin foto
            </span>
        );
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className="rounded miniatura" 
            onError={() => setError(true)} 
        />
    );
}