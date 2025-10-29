import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSmartDiagramType } from "../../utils/imageGenerator";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { message, profile, language: selectedLanguage,} = await req.json();

    const language = selectedLanguage || 'english';

    const prompt = `
# MENTORMIND AI - PROFESSIONAL TUTOR PROTOCOL

## STUDENT PROFILE:
- Name: ${profile?.name || "Student"}
- Topic: ${profile?.topic || "General Learning"}
- Confidence Level: ${profile?.confidence || 3}/5
- Language Preference: ${language}

## CONTEXT ANALYSIS:
Message: "${message}"
Message Type: ${getMessageType(message)}

## RESPONSE GUIDELINES:

### FOR SIMPLE MESSAGES (Greetings, Short questions):
- Keep responses concise (1-2 lines)
- Friendly but professional tone
- No unnecessary explanations
- Example: "Hello" → "Hello [Name]! How can I assist you with [Topic] today?"

### FOR TOPIC REQUESTS & EXPLANATIONS:
- Use STEP-BY-STEP format when explaining concepts:
  **Step 1:** [Title]
  [Explanation]
  
  **Step 2:** [Title]
  [Explanation]
  
- Break complex topics into digestible steps
- Include practical examples after each step
- Use analogies relevant to Pakistani context when helpful
- End with a quick comprehension check question

### FOR FOLLOW-UPS:
- Build on previous context
- Progressive learning approach
- Check understanding before moving forward
- Adapt difficulty based on student responses

### FORMATTING RULES:
- Use **bold** for key concepts and step titles
- Use emojis strategically (🎯 for goals, 💡 for tips, ✅ for checkpoints)
- Use # for main headers, ## for subheaders, ### for sub-sections
- Clear paragraph breaks between steps
- Use numbered lists (1., 2., 3.) for sequences
- Use bullet points (-, •) for related items
- Use backticks for code or technical terms
- Use --- for horizontal dividers when separating major sections
- Professional yet approachable tone
- IMPORTANT: Format your response as markdown for better readability

### ADAPTIVE TEACHING:
- Match explanation depth to confidence level (${profile?.confidence || 3}/5)
- For beginners: Use simple language, more examples
- For advanced: Include technical details, challenges

## CURRENT RESPONSE:
Respond in ${language}. Match the message intent and length appropriately.

Message: "${message}"
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    let reply = result.response.text();

    const prefersImages = profile?.formatPreferences?.includes('images');
    const isExplanationRequest = getMessageType(message) === "TOPIC_REQUEST" || 
                                  getMessageType(message) === "DETAILED_QUERY";
    
    let imageUrl = null;
    
    // Auto-generate AI-powered image for visual learners on explanation requests
    if (prefersImages && isExplanationRequest) {
      try {
        // Determine the best diagram type based on the question
        const diagramType = getSmartDiagramType(profile?.topic || '', message);
        
        // Generate AI-powered educational diagram using Gemini
        const imageResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-image`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: message.substring(0, 100),
            topic: profile?.topic || 'Learning',
            diagramType
          })
        });
        
        const imageData = await imageResponse.json();
        imageUrl = imageData.imageUrl;
        
        console.log('🖼️ AI-Generated diagram type:', diagramType);
        
        // Add note about visual aid in response
        reply += `\n\n---\n\n🖼️ **AI-Generated Visual Learning Aid:** An educational ${diagramType} diagram has been generated using AI to help you visualize these concepts.`;
      } catch (imageError) {
        console.error('AI image generation error:', imageError);
        // Continue without image on error
        imageUrl = null;
      }
    }

    return NextResponse.json({ reply, imageUrl });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again." },
      { status: 500 }
    );
  }
}

// Helper function to determine message type
function getMessageType(message: string): string {
  const msg = message.toLowerCase().trim();
  
  if (msg.match(/^(hello|hi|hey|salam|hola)/)) return "GREETING";
  if (msg.match(/(explain|what is|tell me about|define)/)) return "TOPIC_REQUEST";
  if (msg.match(/(summary|brief|short|overview)/)) return "SUMMARY_REQUEST";
  if (msg.match(/(example|example do|for example)/)) return "EXAMPLE_REQUEST";
  if (msg.length < 20) return "SHORT_MESSAGE";
  
  return "DETAILED_QUERY";
}