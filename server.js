import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const MONGODB_URI = 'mongodb+srv://alisayed1519_db_user:Ali15191519@mycafe.ygyrr4v.mongodb.net/menu_db?retryWrites=true&w=majority&appName=MyCafe';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// نموذج البيانات (Mongoose Schema)
const restaurantSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true },
    name: String,
    data: Object
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

// ==========================================
// API Routes
// ==========================================

// 1. جلب بيانات المطعم بالـ Slug
app.get('/api/restaurants/:slug', async (req, res) => {
    try {
        const cleanSlug = req.params.slug.replace(/[:]/g, '-');
        const restaurant = await Restaurant.findOne({ slug: cleanSlug });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        res.json(restaurant.data);
    } catch (error) {
        console.error('GET Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. حفظ أو تحديث بيانات المطعم
app.post('/api/restaurants/:slug', async (req, res) => {
    try {
        const cleanSlug = req.params.slug.replace(/[:]/g, '-');

        const updatedRestaurant = await Restaurant.findOneAndUpdate(
            { slug: cleanSlug },
            {
                slug: cleanSlug,
                data: req.body,
                name: req.body.name || 'Cafe'
            },
            { returnDocument: 'after', runValidators: true, upsert: true }
        );

        res.json({ success: true, message: 'Saved successfully', restaurant: updatedRestaurant });
    } catch (err) {
        console.error('POST Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// خدمة ملفات الـ Frontend (React Build)
// ==========================================
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ==========================================
// تشغيل السيرفر محلياً أو تصديره لـ Vercel
// ==========================================
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;