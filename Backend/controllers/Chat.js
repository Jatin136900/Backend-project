import groq from "../utils/Groq.js";   // SAME NAME



export async function chatAI(req, res) {
  try {
    const { message } = req.body;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",   
      messages: [
        {
          role: "system",
          content: "You are a friendly ecommerce support assistant. Keep replies short and helpful.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    return res.status(200).json({
      reply: completion.choices[0].message.content,
    });
  } catch (error) {
    console.log("AI ERROR:", error);
    return res.status(500).json({ message: "Chat Failed" });
  }
}


export async function listModels(req, res) {
  try {
    const data = await groq.models.list();
    return res.status(200).json(data.data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to list models" });
  }
}