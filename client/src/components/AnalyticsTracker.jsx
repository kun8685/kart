import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    if (userAgent.indexOf("Firefox") > -1) browser = "Mozilla Firefox";
    else if (userAgent.indexOf("SamsungBrowser") > -1) browser = "Samsung Internet";
    else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) browser = "Opera";
    else if (userAgent.indexOf("Trident") > -1) browser = "Microsoft Internet Explorer";
    else if (userAgent.indexOf("Edge") > -1) browser = "Microsoft Edge";
    else if (userAgent.indexOf("Chrome") > -1) browser = "Google Chrome";
    else if (userAgent.indexOf("Safari") > -1) browser = "Apple Safari";

    let os = "Unknown";
    if (userAgent.indexOf("Win") !== -1) os = "Windows";
    if (userAgent.indexOf("Mac") !== -1) os = "Macintosh";
    if (userAgent.indexOf("Linux") !== -1) os = "Linux";
    if (userAgent.indexOf("Android") !== -1) os = "Android";
    if (userAgent.indexOf("like Mac") !== -1) os = "iOS";

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    return {
        browser,
        os,
        deviceType: isMobile ? 'Mobile' : 'Desktop'
    };
};

const AnalyticsTracker = () => {
    const location = useLocation();
    const { userInfo } = useSelector((state) => state.auth);
    const sessionIdRef = useRef('');

    useEffect(() => {
        let sid = sessionStorage.getItem('analyticsSessionId');
        if (!sid) {
            sid = generateSessionId();
            sessionStorage.setItem('analyticsSessionId', sid);
        }
        sessionIdRef.current = sid;

        // Handle window close
        const handleBeforeUnload = () => {
            const data = {
                sessionId: sessionIdRef.current,
                action: 'leave',
                path: window.location.pathname,
                userId: userInfo ? userInfo._id : null
            };
            // Note: navigator.sendBeacon is better for unload events as they don't get cancelled
            navigator.sendBeacon('/api/analytics/track', JSON.stringify(data));
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [userInfo]);

    useEffect(() => {
        if (!sessionIdRef.current) return;

        // When path changes, record Enter
        const trackPageHit = async () => {
            try {
                // Ensure correct content type if we ever fallback to beacon
                await axios.post('/api/analytics/track', {
                    sessionId: sessionIdRef.current,
                    action: 'enter',
                    path: location.pathname,
                    pageName: document.title || 'Unknown',
                    deviceInfo: getDeviceInfo(),
                    userId: userInfo ? userInfo._id : null
                });
            } catch (error) {
                // Silent fail for analytics
            }
        };

        // Set a small timeout to let the page title update if needed
        const timeout = setTimeout(() => {
            trackPageHit();
        }, 500);

        return () => clearTimeout(timeout);
    }, [location.pathname, userInfo]);

    return null; // This component doesn't render anything
};

export default AnalyticsTracker;
