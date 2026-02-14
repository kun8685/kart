const asyncHandler = require('express-async-handler');
const Content = require('../models/Content');

// @desc    Get site content (banners, etc)
// @route   GET /api/content
// @access  Public
const getContent = asyncHandler(async (req, res) => {
    // We assume there is only one content document for the site
    const content = await Content.findOne();
    if (content) {
        res.json(content);
    } else {
        // Return default structure if nothing exists yet
        res.json({
            heroSlides: [],
            dealOfTheDay: { title: 'Deals of the Day', bgImage: '' },
            adBanners: []
        });
    }
});

// @desc    Update site content
// @route   PUT /api/content
// @access  Private/Admin
const updateContent = asyncHandler(async (req, res) => {
    let content = await Content.findOne();

    if (!content) {
        // Create new if doesn't exist
        content = new Content({});
    }

    content.heroSlides = req.body.heroSlides || content.heroSlides;
    content.dealOfTheDay = req.body.dealOfTheDay || content.dealOfTheDay;
    content.adBanners = req.body.adBanners || content.adBanners;

    const updatedContent = await content.save();
    res.json(updatedContent);
});

module.exports = {
    getContent,
    updateContent
};
