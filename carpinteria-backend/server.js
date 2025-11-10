import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = process.env.PLACE_ID;

app.get("/api/reviews", async (req, res) => {
    try {
        // Pedimos reviews y fotos del negocio en español
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=name,rating,reviews,user_ratings_total,photos&key=${API_KEY}&language=es`
        );
        const data = await response.json();

        if (data.status !== "OK") {
            return res.status(400).json({ error: "Error en la respuesta de Google", data });
        }

        // Fotos del negocio (si hay)
        const businessPhotos = data.result.photos
            ? data.result.photos.map(
                (p) =>
                    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${p.photo_reference}&key=${API_KEY}`
            )
            : [];

        // Asigna fotos solo si existen (una por reseña, sin repetir)
        const reviews = data.result.reviews.map((r, index) => ({
            author_name: r.author_name,
            author_url: r.author_url,
            profile_photo_url: r.profile_photo_url,
            rating: r.rating,
            text: r.text,
            relative_time_description: r.relative_time_description,
            photo_url:
                businessPhotos.length > 0 && businessPhotos[index]
                    ? businessPhotos[index]
                    : null,
        }));

        res.json(reviews);
    } catch (err) {
        console.error("Error al obtener reseñas:", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend corriendo en el puerto ${PORT}`));
