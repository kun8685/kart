import axios from 'axios';

// Silent event tracker — never throws, never blocks UI
const trackEvent = async (event, label = '', page = window.location.pathname) => {
    try {
        const sessionId = sessionStorage.getItem('analyticsSessionId');
        if (!sessionId) return;
        await axios.post('/api/analytics/event', { sessionId, event, page, label });
    } catch (_) {
        // silent fail - tracking should never break the app
    }
};

export default trackEvent;
