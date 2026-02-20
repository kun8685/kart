const mongoose = require('mongoose');

const pageVisitSchema = new mongoose.Schema({
    path: { type: String, required: true },
    pageName: { type: String },
    enteredAt: { type: Date, required: true },
    leftAt: { type: Date },
    durationSeconds: { type: Number, default: 0 }
});

const clickEventSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    event: { type: String, required: true },     // e.g. 'add_to_cart', 'remove_from_cart', 'coupon_applied'
    page: { type: String },                       // e.g. '/cart'
    label: { type: String },                      // e.g. product name
    timestamp: { type: Date, default: Date.now }
});

const visitorLogSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    deviceType: { type: String, default: 'Desktop' },
    browser: { type: String },
    os: { type: String },
    pages: [pageVisitSchema],
    sessionStart: { type: Date, required: true },
    sessionEnd: { type: Date },
    totalDurationSeconds: { type: Number, default: 0 },
    exitPage: { type: String }
}, {
    timestamps: true
});

const ClickEvent = mongoose.model('ClickEvent', clickEventSchema);
const VisitorLog = mongoose.model('VisitorLog', visitorLogSchema);

module.exports = { VisitorLog, ClickEvent };
