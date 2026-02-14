const responses = {
    'hello': 'Hello! How can I help you today?',
    'hi': 'Hi there! Welcome to GauryKart.',
    'price': 'Our prices vary depending on the product. Please check the product page for details.',
    'shipping': 'We offer shipping across India. Standard delivery takes 3-5 business days.',
    'return': 'You can return products within 7 days of delivery if they are damaged or incorrect.',
    'contact': 'You can contact us at support@gaurykart.com.',
    'default': 'I am an AI bot. I didn\'t quite understand that. An admin will be with you shortly.'
};

const getAIResponse = async (message) => {
    // Basic keyword matching
    const lowerMessage = message.toLowerCase();

    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key) && key !== 'default') {
            return response;
        }
    }

    // In a real scenario, this is where you would call OpenAI or Gemini API
    // const response = await axios.post('https://api.openai.com/v1/chat/completions', { ... });

    return responses['default'];
};

module.exports = { getAIResponse };
