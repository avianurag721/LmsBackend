const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true }, // Reference to Patient
    visitId: { type: String, required: true, unique: true }, // Unique Visit ID
    visitDate: { type: Date, default: Date.now }, // Date of visit

    // Tests Associated with the Visit
    tests: [
        {
            testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true }, // Link to Test
            price: { type: Number, required: true }, // Store price at the time of visit
            discount: { type: Number, default: 0, min: 0, max: 100 }, // Discount per test
        }
    ],

    // Sample Collection & Verification Details
    sampleCollectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Technician collecting sample
    sampleCollectionDate: { type: Date }, // Date of sample collection
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User verifying results
    verificationDate: { type: Date }, // Date of verification

    // Test & Report Status Tracking
    status: { 
        type: String, 
        enum: ["Pending", "Sample Collected", "Processing", "Verified", "Report Ready", "Sent"], 
        default: "Pending" 
    }, 

    // Test Results Data (Associates each test with recorded parameters)
    results: [
        {
            testId: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true }, // Link to Test
            technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Who entered the result
            recordedAt: { type: Date, default: Date.now }, // When was it recorded
            parameters: [
                {
                    parameterId: { type: mongoose.Schema.Types.ObjectId, ref: "Parameter", required: true }, // Link to Parameter
                    value: { type: String, required: true } // Recorded value
                }
            ]
        }
    ],

    // Report & Payment Tracking
    reportGeneratedAt: { type: Date }, // When report was generated
    reportSentAt: { type: Date }, // When report was sent
    reportSentBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who sent the report
    
    // Payment Status
    paymentStatus: { 
        type: String, 
        enum: ["Unpaid", "Paid", "Partially Paid"], 
        default: "Unpaid" 
    }, 

    // **NEW: Payment Transactions**
    payments: [
        {
            amount: { type: Number, required: true }, // Amount paid
            method: { type: String, enum: ["Cash", "Card", "Online"], required: true }, // Payment method
            status: { type: String, enum: ["Pending", "Completed"], default: "Completed" }, // Payment status
            transactionId: { type: String }, // Optional, for online payments
            date: { type: Date, default: Date.now } // Payment date
        }
    ],

}, { timestamps: true });

// Virtual field to auto-calculate total bill after discounts
visitSchema.virtual("totalBill").get(function () {
    return this.tests.reduce((total, test) => {
        return total + (test.price - (test.price * test.discount / 100));
    }, 0);
});

// Virtual field to calculate total paid amount
visitSchema.virtual("totalPaid").get(function () {
    return this.payments.reduce((sum, payment) => sum + payment.amount, 0);
});

// Virtual field to calculate due amount
visitSchema.virtual("dueAmount").get(function () {
    return this.totalBill - this.totalPaid;
});

// Ensure virtuals are included in JSON output
visitSchema.set("toJSON", { virtuals: true });
visitSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Visit", visitSchema);
