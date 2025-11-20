import { Response } from "express";
import { AUthRequest } from "../middleware/auth";
import { postGen } from "../utils/aiPostGen";

export const generatePost = async (req: AUthRequest, res: Response) => {
  try {
    const { text, maxOutputTokens } = req.body;
    const generatedContent = await postGen(text, maxOutputTokens);
    res.status(200).json({
        message: "AI Generated Post",
        data: {
            title: `AI Post on ${text}`,
            content: generatedContent
        }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate post" });
  }
}