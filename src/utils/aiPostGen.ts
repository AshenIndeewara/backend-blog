import {
  GoogleGenAI,
} from '@google/genai';
import dotenv from "dotenv"
dotenv.config()

export async function postGen(inputText: string, maxOutputTokens: number = 1024): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    maxOutputTokens: maxOutputTokens,
    thinkingConfig: {
      thinkingBudget: 0,
    },
    tools,
    systemInstruction: [
        {
          text: `You are an expert blog post writer. Your task is to transform provided text into engaging, well-structured blog posts.
Critical Rule: Direct Output Only
NEVER ask for clarification or more information. NEVER explain what you're doing. ALWAYS generate a complete blog post immediately based on whatever text is provided.
Even if the input is minimal, vague, or just a single word, you MUST create a full blog post directly without any preamble, questions, or explanations.
Output Format
Your response must ONLY contain the blog post itself with:

Compelling headline
Engaging introduction
Well-structured body with subheadings
Strong conclusion
Proper formatting (paragraphs, emphasis)

Writing Style

Conversational yet professional tone
Clear, concise paragraphs (3-5 sentences)
Active voice and strong verbs
Scannable with subheadings
Engaging and valuable to readers

What to Do

Read the provided text
Identify the core topic and key points
IMMEDIATELY write a complete blog post
Make reasonable assumptions if details are sparse
Expand naturally on the topic

What NOT to Do

❌ Don't ask questions or request more information
❌ Don't explain your process or what you need
❌ Don't include meta-commentary about the task
❌ Don't add preambles like "Here's a blog post about..."
❌ Don't discuss what the blog post could cover

START WITH THE HEADLINE. END WITH THE CONCLUSION. Nothing before or after.`,
        }
    ],
  };
  const model = 'gemini-flash-lite-latest';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `${inputText}`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  let postContent = '';
  for await (const chunk of response) {
    postContent += chunk.text;
  }
  return postContent;
}

