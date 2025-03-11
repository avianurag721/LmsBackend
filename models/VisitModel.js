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
            results: {
                technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
                recordedAt: { type: Date }, 
                parameters: [
                    {
                        name: { type: String, required: true },  // e.g., "Glucose Level"
                        value: { type: String, required: true }  // e.g., "110 mg/dL"
                    }
                ]
            }
        }
    ]
,
    // Sample Collection & Verification Details
    sampleCollectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    sampleCollectionDate: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    verificationDate: { type: Date },

    // Status Tracking
    status: { 
        type: String, 
        enum: ["Pending", "Sample Collected", "Processing", "Verified", "Report Ready", "Sent", "Cancelled"], 
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
    cancellationCharge: { type: Number, default: 0 }, // Charge applied upon cancellation
    refundedAmount: { type: Number, default: 0 }, // Refund amount if applicable
    cancellationReason: { type: String }, // Reason for cancellation
    cancelledAt: { type: Date }, // Timestamp when cancelled

}, { timestamps: true });

// **Modify Virtual Fields to Exclude Cancelled Visits from Revenue**
visitSchema.virtual("totalBill").get(function () {
    if (this.cancellationStatus === "Cancelled") return 0;  // **Exclude from revenue**
    return this.tests.reduce((total, test) => {
        return total + (test.price - (test.price * test.discount / 100));
    }, 0);
});

visitSchema.virtual("totalPaid").get(function () {
    return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
});

visitSchema.virtual("dueAmount").get(function () {
    if (this.cancellationStatus === "Cancelled") {
        return this.cancellationCharge - this.totalPaid; // **Only consider cancellation charge**
    }
    return this.totalBill - this.totalPaid;
});

// Ensure virtuals are included in JSON output
visitSchema.set("toJSON", { virtuals: true });
visitSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Visit", visitSchema);
