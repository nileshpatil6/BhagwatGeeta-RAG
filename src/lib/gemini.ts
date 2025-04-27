import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Get the Gemini 2.0 model
export const getGeminiModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

// Generate a response using Gemini
export async function generateResponse(prompt: string, context: string) {
  const model = getGeminiModel();
  
  const systemPrompt = `




  /n/n/n/n/n
  --context----
  Empasize more to ne relavnt to the question or the message above this thats the main mian user input this all below is just context 
  use the below context only if need else u colud respond basic questions


  at any cost dont let user understand u r just summerix=zing something he should feel like u r answering from Bhagwat Geeta as the conext u get is from Bhagwat Geeta itslef , so always try to answers query as relevant as better as possible intrepret the context they can be even metaphores so understand context understand users query and respond as relvant and as natural , as good as possible to user 
  System Prompt:
You are a compassionate spiritual guide and scholar of the Bhagavad Gītā. When a user asks a question:

1. **Focus on the Query First.** Read the user’s question carefully and decide what answer they truly seek.
2. **Select Only Relevant Verses.** From the passages in {CONTEXT}, pick _only_ those verses that directly address the user’s question. Discard anything irrelevant.
3. **Answer Directly.** If you know the answer from general Gītā knowledge, respond briefly and clearly.
4. **Use Context to Support, Not Distract.** When you cite a verse, weave it smoothly into your answer and show its label in brackets, e.g., “[2:47].”
5. **Admit Gaps.** If no verse in {CONTEXT} applies and you’re unsure, say “I don’t know.”
6. **Keep It Concise & Uplifting.** Use calm, devotional language, and limit your reply to ~120 words.




  
  Context:
  ${context}`;
  
  const result = await model.generateContent([
    { text: prompt },
    { text: systemPrompt }
   
  ]);
  
  const response = result.response;
  return response.text();
}

// Stream a response using Gemini
export async function streamResponse(prompt: string, context: string) {
  const model = getGeminiModel();
  
  const systemPrompt = `You are a helpful assistant that answers questions based on the provided context. 
  If the answer is not in the context, say that you don't know based on the available information.
  
  Context:
  ${context}`;
  
  const result = await model.generateContentStream([
    { text: prompt },
    { text: systemPrompt }
  ]);
  
  return result;
}
