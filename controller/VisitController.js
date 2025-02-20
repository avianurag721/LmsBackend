const Visit = require("../models/VisitModel");
const Patient = require("../models/PatientModel");
const Test = require("../models/TestModel");

// ✅ 1. Register a New Visit
exports.registerVisit = async (req, res) => {
  try {
    const { patientId, tests } = req.body;

    if (!patientId || !Array.isArray(tests) || tests.length === 0) {
      return res
        .status(400)
        .json({ message: "Patient ID and at least one test are required." });
    }

    const visit = new Visit({
      patientId,
      visitId: `VISIT-${Date.now()}`,
      tests,
    });

    await visit.save();
    res.status(201).json({ message: "Visit registered successfully.", visit });
  } catch (error) {
    console.error("Error registering visit:", error);
    res.status(500).json({ message: "Error registering visit.", error });
  }
};
exports.updatePayment = async (req, res) => {
  try {
    const { visitId } = req.params; // Get visitId from URL params
    const { amount, method, transactionId } = req.body; // Get payment details from request body

    if (!amount || !method) {
      return res
        .status(400)
        .json({ message: "Amount and payment method are required." });
    }

    // Find the visit
    const visit = await Visit.findOne({ visitId });

    if (!visit) {
      return res.status(404).json({ message: "Visit not found." });
    }

    // Check if the bill is already fully paid
    const totalPaid = visit.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    if (totalPaid >= visit.totalBill) {
      return res
        .status(400)
        .json({
          message: "Total bill is already paid. No further payments allowed.",
        });
    }

    // Add payment details
    visit.payments.push({
      amount,
      method,
      status: "Completed",
      transactionId,
      date: new Date(),
    });

    // Recalculate total paid amount
    const updatedTotalPaid = visit.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Calculate remaining amount
    const remainingAmount = Math.max(visit.totalBill - updatedTotalPaid, 0);

    // Update payment status based on total paid vs total bill
    if (updatedTotalPaid >= visit.totalBill) {
      visit.paymentStatus = "Paid";
    } else if (updatedTotalPaid > 0) {
      visit.paymentStatus = "Partially Paid";
    } else {
      visit.paymentStatus = "Unpaid";
    }

    // Save the updated visit
    await visit.save();

    res.status(200).json({
      message: "Payment updated successfully.",
      visit,
      remainingAmount, // Include remaining amount in response
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Error updating payment.", error });
  }
};

exports.cancelVisit = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { cancellationCharge, cancellationReason } = req.body;

    // Validate input
    if (!cancellationCharge || cancellationCharge < 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Cancellation charge is required and must be non-negative.",
        });
    }

    // Find the visit
    const visit = await Visit.findOne({ visitId });
    if (!visit) {
      return res
        .status(404)
        .json({ success: false, message: "Visit not found." });
    }

    // Check if already cancelled
    if (visit.cancellationStatus === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "Visit is already cancelled." });
    }

    // Update cancellation details
    visit.cancellationStatus = "Cancelled";
    visit.cancellationCharge = cancellationCharge;
    visit.cancellationReason = cancellationReason;
    visit.cancelledAt = new Date();

    // Calculate total amount paid so far
    const totalPaid = visit.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Determine refund amount (if applicable)
    let refundedAmount = 0;
    if (totalPaid > cancellationCharge) {
      refundedAmount = totalPaid - cancellationCharge; // Refund the extra paid amount
    }

    // Update refund amount in visit
    visit.refundedAmount = refundedAmount;

    // Set new payment status
    if (totalPaid >= cancellationCharge) {
      visit.paymentStatus = "Paid"; // If cancellation charge is fully covered
    } else if (totalPaid > 0) {
      visit.paymentStatus = "Partially Paid"; // If some amount is covered
    } else {
      visit.paymentStatus = "Unpaid"; // If no payment was made
    }

    // Save updated visit
    await visit.save();

    res.status(200).json({
      success: true,
      message: "Visit cancelled successfully.",
      visit,
      refundedAmount: refundedAmount > 0 ? refundedAmount : 0,
      remainingDue:
        cancellationCharge - totalPaid > 0 ? cancellationCharge - totalPaid : 0,
    });
  } catch (error) {
    console.error("Error cancelling visit:", error);
    res
      .status(500)
      .json({ success: false, message: "Error cancelling visit.", error });
  }
};

// ✅ 2. Update Visit Status (e.g., Sample Collection, Processing, Verified)
exports.updateVisitStatus = async (req, res) => {
  try {
    const { visitId, status } = req.body;

    if (!visitId || !status) {
      return res
        .status(400)
        .json({ message: "Visit ID and new status are required." });
    }

    const visit = await Visit.findOneAndUpdate(
      { visitId },
      { status },
      { new: true }
    );
    if (!visit) return res.status(404).json({ message: "Visit not found." });

    res.json({ message: `Visit status updated to ${status}.`, visit });
  } catch (error) {
    console.error("Error updating visit status:", error);
    res.status(500).json({ message: "Error updating visit status.", error });
  }
};

// ✅ 3. Record Sample Collection
exports.collectSample = async (req, res) => {
  try {
    const { visitId, sampleCollectedBy } = req.body;

    const visit = await Visit.findOneAndUpdate(
      { visitId },
      {
        sampleCollectedBy,
        sampleCollectionDate: new Date(),
        status: "Sample Collected",
      },
      { new: true }
    );

    if (!visit) return res.status(404).json({ message: "Visit not found." });

    res.json({ message: "Sample collected successfully.", visit });
  } catch (error) {
    console.error("Error collecting sample:", error);
    res.status(500).json({ message: "Error collecting sample.", error });
  }
};

// ✅ 4. Verify Test
exports.verifyTest = async (req, res) => {
  try {
    const { visitId, verifiedBy } = req.body;

    const visit = await Visit.findOneAndUpdate(
      { visitId },
      { verifiedBy, verificationDate: new Date(), status: "Verified" },
      { new: true }
    );

    if (!visit) return res.status(404).json({ message: "Visit not found." });

    res.json({ message: "Test verified successfully.", visit });
  } catch (error) {
    console.error("Error verifying test:", error);
    res.status(500).json({ message: "Error verifying test.", error });
  }
};

// ✅ 5. Add Test Results (by Lab Technician)
exports.addTestResults = async (req, res) => {
  try {
    const { visitId } = req.params;
    const { testId, technicianId, parameters } = req.body;

    const visit = await Visit.findOne({ visitId });
    if (!visit) return res.status(404).json({ message: "Visit not found." });

    visit.results.push({
      testId,
      technicianId,
      recordedAt: new Date(),
      parameters,
    });

    await visit.save();
    return res
      .status(200)
      .json({ message: "Results added successfully", visit });
  } catch (error) {
    console.error("Error adding test results:", error);
    res.status(500).json({ message: "Error adding test results.", error });
  }
};

// ✅ 6. Update Test Results
exports.updateTestResults = async (req, res) => {
  try {
    const { visitId, resultId } = req.params;
    const { parameters } = req.body;

    const visit = await Visit.findOne({ visitId });
    if (!visit) return res.status(404).json({ message: "Visit not found." });

    const result = visit.results.id(resultId);
    if (!result) return res.status(404).json({ message: "Result not found." });

    result.parameters = parameters;
    result.recordedAt = new Date();

    await visit.save();
    return res
      .status(200)
      .json({ message: "Results updated successfully", visit });
  } catch (error) {
    console.error("Error updating test results:", error);
    res.status(500).json({ message: "Error updating test results.", error });
  }
};

// ✅ 7. Get Results for a Visit
exports.getTestResults = async (req, res) => {
  try {
    const { visitId } = req.params;

    const visit = await Visit.findOne({ visitId })
      .populate("results.testId", "testName")
      .populate("results.technicianId", "name email")
      .populate("results.parameters.parameterId", "parameterName unit");

    if (!visit) return res.status(404).json({ message: "Visit not found." });

    return res.status(200).json({ results: visit.results });
  } catch (error) {
    console.error("Error fetching test results:", error);
    res.status(500).json({ message: "Error fetching test results.", error });
  }
};

// ✅ 8. Delete Test Result
exports.deleteTestResult = async (req, res) => {
  try {
    const { visitId, resultId } = req.params;

    const visit = await Visit.findOne({ visitId });
    if (!visit) return res.status(404).json({ message: "Visit not found." });

    visit.results = visit.results.filter(
      (result) => result._id.toString() !== resultId
    );
    await visit.save();

    return res
      .status(200)
      .json({ message: "Test result deleted successfully", visit });
  } catch (error) {
    console.error("Error deleting test result:", error);
    res.status(500).json({ message: "Error deleting test result.", error });
  }
};

// ✅ 9. Generate Report
exports.generateReport = async (req, res) => {
  try {
    const { visitId } = req.body;

    const visit = await Visit.findOneAndUpdate(
      { visitId },
      { reportGeneratedAt: new Date(), status: "Report Ready" },
      { new: true }
    );

    if (!visit) return res.status(404).json({ message: "Visit not found." });

    res.json({ message: "Report generated successfully.", visit });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ message: "Error generating report.", error });
  }
};

// ✅ 10. Send Report to Patient
exports.sendReport = async (req, res) => {
  try {
    const { visitId, reportSentBy } = req.body;

    const visit = await Visit.findOneAndUpdate(
      { visitId },
      { reportSentBy, reportSentAt: new Date(), status: "Sent" },
      { new: true }
    );

    if (!visit) return res.status(404).json({ message: "Visit not found." });

    res.json({ message: "Report sent to patient successfully.", visit });
  } catch (error) {
    console.error("Error sending report:", error);
    res.status(500).json({ message: "Error sending report.", error });
  }
};

// ✅ 11. Update Payment Status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { visitId, paymentStatus } = req.body;

    if (!["Unpaid", "Paid", "Partially Paid"].includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status." });
    }

    const visit = await Visit.findOneAndUpdate(
      { visitId },
      { paymentStatus },
      { new: true }
    );
    if (!visit) return res.status(404).json({ message: "Visit not found." });

    res.json({ message: `Payment status updated to ${paymentStatus}.`, visit });
  } catch (error) {
    console.error("Error updating payment status:", error);
    res.status(500).json({ message: "Error updating payment status.", error });
  }
};
