const Visit = require("../../models/VisitModel");

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


// get all latest visits  which can be shown on mark as sample colleceted 
exports.getAllNewVisits = async (req, res) => {
  try {
    const visits = await Visit.find({ status: "Pending" ,paymentStatus: "Paid",cancellationStatus:"Not Cancelled"});

    if (!visits.length) {
      return res.status(404).json({ message: "No pending visits found." });
    }

    res
      .status(200)
      .json({ message: "Pending visits retrieved successfully.", visits });
  } catch (error) {
    console.error("Error fetching pending visits:", error);
    res.status(500).json({ message: "Error fetching pending visits.", error });
  }
};

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

    res.json({ message: "Sample collected successfully." });
  } catch (error) {
    console.error("Error collecting sample:", error);
    res.status(500).json({ message: "Error collecting sample.", error });
  }
};
exports.forResultFilling = async (req, res) => {
    try {
      const { visitId, sampleCollectedBy } = req.body;
  
      // Find and update visit with sample collection details
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
  
      // Find tests that do NOT have results
      const unfilledTests = visit.tests.filter(test => !test.results || !test.results.parameters || test.results.parameters.length === 0);
  
      res.json({
        message: "Sample collected successfully.",
        unfilledTests
      });
  
    } catch (error) {
      console.error("Error collecting sample:", error);
      res.status(500).json({ message: "Error collecting sample.", error });
    }
  };  


exports.addTestResults = async (req, res) => {
    try {
        const { visitId } = req.params;
        const { results } = req.body;  // Expecting multiple test results

        if (!Array.isArray(results) || results.length === 0) {
            return res.status(400).json({ message: "Results array is required." });
        }

        // Find the visit
        const visit = await Visit.findOne({ visitId });

        if (!visit) {
            return res.status(404).json({ message: "Visit not found." });
        }

        // Loop through each test result and update the corresponding test
        results.forEach(({ testId, technicianId, parameters }) => {
            let test = visit.tests.find(t => t.testId.toString() === testId);

            if (test) {
                test.results = {
                    technicianId,
                    recordedAt: new Date(),
                    parameters
                };
            }
        });

        await visit.save();
        return res.status(200).json({ message: "Results added successfully", visit });
    } catch (error) {
        console.error("Error adding test results:", error);
        res.status(500).json({ message: "Error adding test results.", error });
    }
};

// ✅ 5. Add Test Results (by Lab Technician)

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
