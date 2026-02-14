import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash, Image as ImageIcon, Link as LinkIcon, Monitor } from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const SiteSettingsScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [content, setContent] = useState({
        heroSlides: [],
        dealOfTheDay: { bgImage: '', title: '' },
        adBanners: []
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const { data } = await axios.get('/api/content');
                setContent(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchContent();
    }, []);

    const handleChange = (section, index, field, value) => {
        const newContent = { ...content };
        if (section === 'heroSlides' || section === 'adBanners') {
            newContent[section][index][field] = value;
        } else if (section === 'dealOfTheDay') {
            newContent.dealOfTheDay[field] = value;
        }
        setContent(newContent);
    };

    const addSlide = () => {
        setContent({
            ...content,
            heroSlides: [...(content.heroSlides || []), { image: '', title: '', url: '' }]
        });
    };

    const removeSlide = (index) => {
        const newSlides = content.heroSlides.filter((_, i) => i !== index);
        setContent({ ...content, heroSlides: newSlides });
    };

    const saveHandler = async () => {
        setSaving(true);
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.put('/api/content', content, config);
            alert('Settings Updated Successfully');
            setSaving(false);
        } catch (error) {
            alert('Update Failed');
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading settings...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
                    <p className="text-gray-500 text-sm">Manage homepage banners and content.</p>
                </div>
                <button
                    onClick={saveHandler}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-600 transition disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Hero Slides Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Monitor size={20} className="text-blue-500" /> Hero Slider
                    </h2>
                    <button onClick={addSlide} className="text-sm flex items-center gap-1 text-primary font-bold hover:underline">
                        <Plus size={16} /> Add Slide
                    </button>
                </div>

                <div className="space-y-6">
                    {content.heroSlides?.map((slide, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group transition hover:shadow-md">
                            <button
                                onClick={() => removeSlide(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                                title="Remove Slide"
                            >
                                <Trash size={14} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Image URL</label>
                                    <div className="flex items-center gap-2">
                                        <ImageIcon size={16} className="text-gray-400" />
                                        <input
                                            type="text"
                                            value={slide.image}
                                            onChange={(e) => handleChange('heroSlides', index, 'image', e.target.value)}
                                            className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Link URL</label>
                                    <div className="flex items-center gap-2">
                                        <LinkIcon size={16} className="text-gray-400" />
                                        <input
                                            type="text"
                                            value={slide.url}
                                            onChange={(e) => handleChange('heroSlides', index, 'url', e.target.value)}
                                            className="flex-1 bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                                            placeholder="/products/category"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Preview */}
                            {slide.image && (
                                <div className="mt-4 rounded overflow-hidden border border-gray-200 h-32 w-full bg-gray-100 flex items-center justify-center">
                                    <img src={slide.image} alt="Preview" className="h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>
                    ))}
                    {content.heroSlides?.length === 0 && (
                        <p className="text-center text-gray-400 italic py-4">No slides added yet. Click "Add Slide" to begin.</p>
                    )}
                </div>
            </div>

            {/* Deal of the Day Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-6 border-b pb-4">Deals of the Day Section</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Section Title</label>
                        <input
                            type="text"
                            value={content.dealOfTheDay?.title || ''}
                            onChange={(e) => handleChange('dealOfTheDay', null, 'title', e.target.value)}
                            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteSettingsScreen;
