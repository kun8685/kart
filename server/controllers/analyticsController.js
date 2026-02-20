const { VisitorLog, ClickEvent } = require('../models/VisitorLog');

// @desc    Track user activity (page enter/leave)
// @route   POST /api/analytics/track
// @access  Public
const trackActivity = async (req, res) => {
    try {
        const { sessionId, action, path, pageName, deviceInfo, userId } = req.body;
        if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

        let log = await VisitorLog.findOne({ sessionId });

        if (!log) {
            if (action === 'leave') return res.status(200).send();
            log = new VisitorLog({
                sessionId,
                user: userId || null,
                deviceType: deviceInfo?.deviceType || 'Unknown',
                browser: deviceInfo?.browser || 'Unknown',
                os: deviceInfo?.os || 'Unknown',
                sessionStart: new Date(),
                pages: [{ path, pageName, enteredAt: new Date() }]
            });
        } else {
            if (action === 'enter') {
                if (log.pages.length > 0) {
                    const lastPage = log.pages[log.pages.length - 1];
                    if (!lastPage.leftAt) {
                        lastPage.leftAt = new Date();
                        lastPage.durationSeconds = Math.max(0, Math.floor((lastPage.leftAt - lastPage.enteredAt) / 1000));
                    }
                }
                log.pages.push({ path, pageName, enteredAt: new Date() });
            } else if (action === 'leave') {
                if (log.pages.length > 0) {
                    const lastPage = log.pages[log.pages.length - 1];
                    if (lastPage.path === path && !lastPage.leftAt) {
                        lastPage.leftAt = new Date();
                        lastPage.durationSeconds = Math.max(0, Math.floor((lastPage.leftAt - lastPage.enteredAt) / 1000));
                    }
                }
            }
            if (userId && !log.user) log.user = userId;
        }

        log.exitPage = path;
        log.sessionEnd = new Date();
        log.totalDurationSeconds = Math.max(0, Math.floor((log.sessionEnd - log.sessionStart) / 1000));

        await log.save();
        res.status(200).json({ success: true });
    } catch (error) {
        // Ignore duplicate key errors (race conditions between requests)
        if (error.code === 11000) {
            return res.status(200).json({ success: true });
        }
        console.error('Analytics Tracker Error:', error.message);
        res.status(200).json({ success: false }); // Return 200 so client doesn't crash
    }
};

// @desc    Track button/action click events
// @route   POST /api/analytics/event
// @access  Public
const trackEvent = async (req, res) => {
    try {
        const { sessionId, event, page, label } = req.body;
        if (!sessionId || !event) return res.status(400).json({ message: 'sessionId and event required' });

        await ClickEvent.create({ sessionId, event, page, label });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Event Tracker Error:', error);
        res.status(500).json({ success: false });
    }
};

// @desc    Get analytics statistics
// @route   GET /api/analytics/stats
// @access  Private/Admin
const getAnalyticsStats = async (req, res) => {
    try {
        const logs = await VisitorLog.find({});
        let totalTime = 0, bounces = 0;
        const pathStats = {}, exitStats = {};

        logs.forEach(log => {
            totalTime += log.totalDurationSeconds;
            if (log.pages.length <= 1) bounces++;

            log.pages.forEach(p => {
                if (!pathStats[p.path]) pathStats[p.path] = { visits: 0, time: 0, path: p.path };
                pathStats[p.path].visits++;
                pathStats[p.path].time += p.durationSeconds;
            });

            if (log.exitPage) exitStats[log.exitPage] = (exitStats[log.exitPage] || 0) + 1;
        });

        const totalSessions = logs.length;
        const avgSessionDuration = totalSessions > 0 ? Math.floor(totalTime / totalSessions) : 0;
        const bounceRate = totalSessions > 0 ? ((bounces / totalSessions) * 100).toFixed(1) : 0;

        const topPages = Object.values(pathStats)
            .map(p => ({ path: p.path, visits: p.visits, avgTime: Math.floor(p.visits > 0 ? p.time / p.visits : 0) }))
            .sort((a, b) => b.visits - a.visits).slice(0, 10);

        const topExitPages = Object.keys(exitStats)
            .map(k => ({ path: k, exits: exitStats[k] }))
            .sort((a, b) => b.exits - a.exits).slice(0, 10);

        // Gather click event stats
        const clickEvents = await ClickEvent.find({});
        const eventCounts = {};
        clickEvents.forEach(e => {
            eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
        });
        const clickStats = Object.keys(eventCounts)
            .map(k => ({ event: k, count: eventCounts[k] }))
            .sort((a, b) => b.count - a.count);

        res.json({ summary: { totalSessions, avgSessionDuration, bounceRate }, topPages, topExitPages, clickStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error in Analytics' });
    }
};

module.exports = { trackActivity, trackEvent, getAnalyticsStats };
