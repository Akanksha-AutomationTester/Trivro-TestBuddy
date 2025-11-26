import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `
You are Trivro TestBuddy, an elite Senior QA Architect & Test Automation Lead with 15+ years of experience.
Your output must be exhaustive, highly technical, and ready for enterprise-level deployment.

STRICT RULES FOR CONTENT GENERATION:

1. **TEST CASES**:
   - NEVER generate generic steps like "Check if it works".
   - MUST provide specific data inputs (e.g., "Enter 'user@domain.com'", "Enter '<script>alert(1)</script>'").
   - MUST cover: Happy Paths, Negative Scenarios, Boundary Values, Edge Cases, Security Inputs (SQLi, XSS), and Performance aspects.
   - Steps must be granular (e.g., "1. Click 'Login'. 2. Wait for spinner. 3. Observe error toast.").

2. **BUG REPORTS**:
   - Must follow IEEE-829 standard strictly.
   - "Root Cause Analysis" must provide a technical hypothesis (e.g., "Likely a 500 error due to unhandled null pointer in backend payload").
   - "Steps to Reproduce" must be impossible to misunderstand.

3. **TONE**:
   - Critical, Precise, No Fluff.
   - Assume the reader is a developer who needs exact reproduction steps.

4. **FORMATTING**:
   - Use clear Markdown tables for test cases.
   - Use bold headers for bug reports.
`;

export const generateTextQA = async (prompt: string, images: string[] = []): Promise<string> => {
  try {
    const parts: any[] = [{ text: prompt }];

    images.forEach(img => {
      // Robust base64 extraction
      const base64Data = img.split(',')[1];
      const mimeMatch = img.match(/^data:(image\/[a-z]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      
      if (base64Data) {
        parts.push({
          inlineData: {
            mimeType: mimeType,
            data: base64Data
          }
        });
      }
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.4, 
      },
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error: ${(error as Error).message}. Please checks your API Key.`;
  }
};

export const analyzeScreenFrame = async (base64Image: string, contextPrompt?: string): Promise<string> => {
  try {
    // Robust base64 extraction for canvas images
    const base64Data = base64Image.split(',')[1];
    
    // Default to jpeg if not specified in base64 string, but canvas usually gives full data uri
    const mimeMatch = base64Image.match(/^data:(image\/[a-z]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg';

    const prompt = contextPrompt || `
      Analyze this screen as a Senior QA Lead.
      1. Detect Visual/UI Bugs (Alignment, Spacing, Colors, Typos).
      2. Identify Usability/UX Issues (Flow, Accessibility).
      3. Suggest 3-5 Critical, Non-Obvious Test Cases for what is visible.
      4. If an error is visible, write a Bug Report draft.
      
      Format the output clearly with headers. Be extremely critical.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini Vision API Error:", error);
    return `Error analyzing screen: ${(error as Error).message}`;
  }
};