const https = require('https');

const localizarTienda = (lat, lng, res) => {
    
    const GOOGLE_MAPS_API_KEY = 'AIzaSyBTNcNEQK4tEAooh5SDsTs-e54F300Si7E';
    const nearbySearchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=KFC&key=${GOOGLE_MAPS_API_KEY}`;

    https.get(nearbySearchUrl, (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            
            const response = JSON.parse(data);
            const lugares = response.results;

            if (lugares.length === 0) {
                return res.json([]);
            }

            const lugarDetallesPromises = lugares.map(lugar => {
                return new Promise((resolve, reject) => {
                    const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${lugar.place_id}&key=${GOOGLE_MAPS_API_KEY}`;

                    https.get(placeDetailsUrl, (resp) => {
                        let detailsData = '';

                        resp.on('data', (chunk) => {
                            detailsData += chunk;
                        });

                        resp.on('end', () => {
                            const detailsResponse = JSON.parse(detailsData);
                            const detalles = detailsResponse.result;
                            resolve({
                                nombre: lugar.name,
                                direccion: lugar.vicinity,
                                ubicacion: lugar.geometry.location,
                                telefono: detalles.formatted_phone_number || 'No disponible',
                                enlace: `https://www.google.com/maps/place/?q=place_id:${lugar.place_id}`
                            });
                        });

                    }).on("error", (err) => {
                        reject(err);
                    });
                });
            });

            Promise.all(lugarDetallesPromises)
                .then(resultados => res.json(resultados))
                .catch(error => {
                    console.error(error);
                    res.status(500).json({ error: 'Error al obtener los detalles de los lugares' });
                });
        });

    }).on("error", (err) => {
        console.error(err.message);
        res.status(500).json({ error: 'Error al buscar lugares' });
    });
}

module.exports = {
    localizarTienda
}

