const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

let buffer = '';

let opinion = {
    "version": "v2",
    "content": {
        "messages": [{
            "type":"text",
            "text": "ESTO ES EXPRESS HDSPTM"
        }]
    },
}

app.post('/localizacion', (req, res) => {
    
    const localizacionUsuario = req.query;
        
    req.on('data', info => {
        buffer += info.toString();
    });

    req.on('end', () => {
        /* const data = JSON.parse(buffer);
        console.log("OLA: ", data) */
        res.status(200);
    });

    console.log("TEST: ", localizacionUsuario.localizacion);
    let location = localizacionUsuario.localizacion.split(",");
    console.log(location);
    res.send(localizacionUsuario);
    
    /* console.log(`Latitud: ${latitud}, Longitud: ${longitud}`);
    res.send({ latitud, longitud }); */


});

app.get('/opinion', (req, res) => {
    console.log("llegó la peticion");
    console.log(req);
    res.json(opinion);
});

app.listen(PORT, () => {
    console.log(`Server vivo en http://localhost:${PORT}`);
});