const FAQ = require("../models/FAQmodel");

const createFAQ = async (req, res) => {
  const { Question,  Answer } = req.body;

  const newFAQ= new FAQ({
    Question,  Answer
  });

  try {
    const savedFAQ = await newFAQ.save();
    res.status(201).json(savedFAQ);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFAQs=async(req,res)=>{
  try {
    const FAQs = await FAQ.find();
    res.status(200).json({
      status:200,
      message:"All FAQ",
      data:FAQs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const updateFAQ = async (req, res) => {
  try {
    const updateData = req.body;
   
    const updatedBlog = await FAQ.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteFAQ=async(req,res)=>{
  try {
    await FAQ.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'FAQ deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}


module.exports = { createFAQ,getFAQs,updateFAQ,deleteFAQ};
