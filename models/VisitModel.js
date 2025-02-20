const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
    visitId: { type: String, required: true, unique: true },
    visitDate: { type: Date, default: Date.now },

    tests: [
        {
            testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
            price: { type: Number, required: true },
            discount: { type: Number, default: 0, min: 0, max: 100 },
        }
    ],

    // Sample Collection & Verification Details
    sampleCollectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sampleCollectionDate: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verificationDate: { type: Date },

    // Status Tracking
    status: { 
        type: String, 
        enum: ["Pending", "Sample Collected", "Processing", "Verified", "Report Ready", "Sent"], 
        default: "Pending" 
    },

    // Payment Tracking
    paymentStatus: { 
        type: String, 
        enum: ["Unpaid", "Paid", "Partially Paid"], 
        default: "Unpaid" 
    },

    payments: [
        {
            amount: { type: Number, required: true },
            method: { type: String, enum: ["Cash", "Card", "Online"], required: true },
            status: { type: String, enum: ["Pending", "Completed"], default: "Completed" },
            transactionId: { type: String },
            date: { type: Date, default: Date.now }
        }
    ],

    // **Cancellation Status**
    cancellationStatus: {
        type: String,
        enum: ["Not Cancelled", "Cancelled"],
        default: "Not Cancelled"
    },
    cancellationReason: { type: String }, // Reason for cancellation
    cancelledAt: { type: Date }, // When it was cancelled

}, { timestamps: true });

// Modify Virtual Fields to Exclude Cancelled Visits
visitSchema.virtual("totalBill").get(function () {
    if (this.cancellationStatus === "Cancelled") return 0;  // Exclude cancelled visits from revenue
    return this.tests.reduce((total, test) => {
        return total + (test.price - (test.price * test.discount / 100));
    }, 0);
});

visitSchema.virtual("totalPaid").get(function () {
    if (this.cancellationStatus === "Cancelled") return 0;  
    return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
});

visitSchema.virtual("dueAmount").get(function () {
    return this.totalBill - this.totalPaid;
});

// Ensure virtuals are included in JSON output
visitSchema.set("toJSON", { virtuals: true });
visitSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Visit", visitSchema);
