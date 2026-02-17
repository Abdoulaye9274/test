import express from "express";
import axios from "axios";

const router = express.Router();

// Proxy vers le service IA
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message requis" });
    }

    // En production (Docker), proxie vers ai-service:8000
    // En dev local, proxie vers localhost:8000
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://ai-service:8000";

    console.log(`📡 Appel IA service: ${aiServiceUrl}/chat`);

    const response = await axios.post(`${aiServiceUrl}/chat`, { message }, {
      timeout: 30000 // 30 secondes timeout
    });

    res.json({ response: response.data.response });
  } catch (error) {
    console.error("❌ Erreur IA service:", error.message);
    
    // Fallback - réponse par défaut si service IA indisponible
    res.status(503).json({
      response: "Service IA temporairement indisponible. Veuillez réessayer.",
      error: error.message
    });
  }
});

export default router;
