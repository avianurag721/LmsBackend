const Test = require("../models/TestModel"); // Adjust the path based on your project structure

// Create a new Test
exports.createTest = async (req, res) => {
  try {
    // Create a new Test document using the request body
    console.log(req.body)
    const test = new Test(req.body);
    const savedTest = await test.save();
    res.status(201).json(savedTest);
  } catch (err) {
    // Handle validation and duplicate key errors
    res.status(400).json({ error: err.message });
  }
};

// Retrieve all Tests
exports.getAllTests = async (req, res) => {
  try {
    // Find all tests and populate the 'parameters' field to include details from the referenced Parameter model
    const tests = await Test.find().populate("parameters");
    res.status(200).json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a single Test by its ID
exports.getTestById = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the test by ID and populate the 'parameters' field
    const test = await Test.findById(id).populate("parameters");
    if (!test) {
      return res.status(404).json({ error: "Test not found" });
    }
    res.status(200).json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an existing Test by its ID
exports.updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    // Find the Test by ID and update with the data from the request body
    // Options:
    //  - new: true returns the updated document
    //  - runValidators: true makes sure Mongoose validations are applied
    const updatedTest = await Test.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("parameters");

    if (!updatedTest) {
      return res.status(404).json({ error: "Test not found" });
    }
    res.status(200).json(updatedTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a Test by its ID
exports.deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTest = await Test.findByIdAndDelete(id);
    if (!deletedTest) {
      return res.status(404).json({ error: "Test not found" });
    }
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.searchTest = async (req, res) => {
  try {
    const query = req.query.query?.trim(); // Trim spaces from input
    if (!query) {
      return res.status(400).json({ message: "Search query is required." });
    }

    // Search patients by name or contact (case-insensitive)
    const Tests = await Test.find({
      $or: [
        { testName: new RegExp(query, "i") },
        { testCode: new RegExp(query, "i") },
      ],
    })
      .limit(10) // Limit results
      .lean().populate("parameters"); // Return plain objects for better performance
    res.status(200).json(Tests);
  } catch (error) {
    console.error("Error searching patients:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
