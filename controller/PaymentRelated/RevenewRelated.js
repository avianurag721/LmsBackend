const Visit = require("../../models/VisitModel");

exports.getAdminDashboard = async (req, res) => {
  try {
    // Match only non-cancelled visits
    const matchCondition = { cancellationStatus: "Not Cancelled" };

    // Total Revenue & Discounts
    const revenue = await Visit.aggregate([
      { $match: matchCondition },
      { $unwind: "$tests" },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $subtract: [
                "$tests.price",
                {
                  $multiply: [
                    "$tests.price",
                    { $divide: ["$tests.discount", 100] },
                  ],
                },
              ],
            },
          },
          totalDiscount: {
            $sum: {
              $multiply: [
                "$tests.price",
                { $divide: ["$tests.discount", 100] },
              ],
            },
          },
        },
      },
    ]);

    // Total Payments Collected (Grouped by Method)
    const payments = await Visit.aggregate([
      { $match: matchCondition },
      { $unwind: "$payments" },
      {
        $group: {
          _id: "$payments.method",
          totalCollected: { $sum: "$payments.amount" },
        },
      },
    ]);

    // Outstanding Dues
    const totalIncome = revenue.length > 0 ? revenue[0].totalIncome : 0;
    const totalDiscount = revenue.length > 0 ? revenue[0].totalDiscount : 0;
    const totalPaid = payments.reduce((sum, p) => sum + p.totalCollected, 0);
    const totalDue = totalIncome - totalPaid;

    // Total Visits & Tests Count
    const totalVisits = await Visit.countDocuments(matchCondition);
    const totalTests = await Visit.aggregate([
      { $match: matchCondition },
      { $unwind: "$tests" },
      { $count: "testCount" },
    ]);
    const totalTestsConducted =
      totalTests.length > 0 ? totalTests[0].testCount : 0;

    // Monthly Revenue Report
    const monthlyRevenue = await Visit.aggregate([
      { $match: matchCondition },
      { $unwind: "$tests" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$visitDate" } },
          totalIncome: {
            $sum: {
              $subtract: [
                "$tests.price",
                {
                  $multiply: [
                    "$tests.price",
                    { $divide: ["$tests.discount", 100] },
                  ],
                },
              ],
            },
          },
          totalDiscount: {
            $sum: {
              $multiply: [
                "$tests.price",
                { $divide: ["$tests.discount", 100] },
              ],
            },
          },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Monthly Payment Breakdown
    const monthlyPayments = await Visit.aggregate([
      { $match: matchCondition },
      { $unwind: "$payments" },
      {
        $group: {
          _id: {
            month: {
              $dateToString: { format: "%Y-%m", date: "$payments.date" },
            },
            method: "$payments.method",
          },
          totalCollected: { $sum: "$payments.amount" },
        },
      },
      { $sort: { "_id.month": -1 } },
    ]);

    // Monthly Test Count
    const monthlyTests = await Visit.aggregate([
      { $match: matchCondition },
      { $unwind: "$tests" },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$visitDate" } },
          totalTests: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    // Respond with all aggregated data
    res.status(200).json({
      totalIncome,
      totalDiscount,
      totalPaid,
      totalDue,
      totalVisits,
      totalTestsConducted,
      paymentBreakdown: payments, // Breakdown by method
      monthlyRevenue,
      monthlyPayments,
      monthlyTests,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data.", error });
  }
};

exports.totalRevenue = async (req, res) => {
  const totalRevenue = await Visit.aggregate([
    { $match: { cancellationStatus: "Not Cancelled" } }, // Exclude cancelled visits
    { $unwind: "$tests" }, // Deconstruct array to process each test
    {
      $group: {
        _id: null,
        totalIncome: {
          $sum: {
            $subtract: [
              "$tests.price",
              {
                $multiply: [
                  "$tests.price",
                  { $divide: ["$tests.discount", 100] },
                ],
              },
            ],
          },
        },
      },
    },
  ]);
  const totalIncome = totalRevenue.length > 0 ? totalRevenue[0].totalIncome : 0;
  console.log("Total Income:", totalIncome);
};
