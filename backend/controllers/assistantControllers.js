// controllers/assistantController.js
export const chatWithAssistant = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Placeholder for actual AI integration
    const response = `🤖 Assistant: You said "${prompt}" — here's a sample response.`;

    res.status(200).json({ message: response });
  } catch (err) {
    res.status(500).json({ message: "Error from assistant", error: err.message });
  }
};
