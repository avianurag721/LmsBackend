const Visit =require("../models/VisitModel")

exports.addPayment = async (req, res) => {
    try {
        const { visitId, amount, method, transactionId } = req.body;

        const visit = await Visit.findOne({ visitId });
        if (!visit) {
            return res.status(404).json({ message: "Visit not found." });
        }

        // Create new payment record
        const newPayment = {
            amount,
            method,
            transactionId,
            status: "Completed",
            date: new Date()
        };

        visit.payments.push(newPayment);
        
        // Update payment status
        const totalPaid = visit.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalBill = visit.tests.reduce((total, test) => total + (test.price - (test.price * test.discount / 100)), 0);
        visit.paymentStatus = totalPaid >= totalBill ? "Paid" : "Partially Paid";

        await visit.save();

        res.status(200).json({ message: "Payment added successfully.", visit });
    } catch (error) {
        console.error("Error adding payment:", error);
        res.status(500).json({ message: "Error adding payment.", error });
    }
};

exports.getDueAmount = async (req, res) => {
    try {
        const { visitId } = req.params;

        const visit = await Visit.findOne({ visitId });

        if (!visit) {
            return res.status(404).json({ message: "Visit not found." });
        }

        res.status(200).json({ 
            totalBill: visit.totalBill, 
            totalPaid: visit.totalPaid, 
            dueAmount: visit.dueAmount 
        });
    } catch (error) {
        console.error("Error fetching due amount:", error);
        res.status(500).json({ message: "Error fetching due amount.", error });
    }
};
