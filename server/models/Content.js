const mongoose = require('mongoose');

const contentSchema = mongoose.Schema({
    heroSlides: [
        {
            image: { type: String, required: true },
            title: { type: String },
            url: { type: String },
        }
    ],
    dealOfTheDay: {
        bgImage: { type: String },
        title: { type: String, default: 'Deals of the Day' },
    },
    adBanners: [
        {
            image: { type: String, required: true },
            url: { type: String },
        }
    ],
}, {
    timestamps: true,
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;
