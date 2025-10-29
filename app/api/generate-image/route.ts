import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { prompt, topic, diagramType = "mindmap" } = await req.json();

    // Use Gemini to generate an SVG diagram based on the topic and concept
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const diagramPrompt = `
You are an educational diagram generator. Create a detailed SVG diagram for the following:

Topic: ${topic}
Concept: ${prompt}
Diagram Type: ${diagramType}

Generate a complete, valid SVG code (not just a description) that visualizes this concept.
The SVG should:
- Be 800x600 pixels
- Use clear, readable fonts (14-18px)
- Have a clean, educational style with colors like #4F46E5(blue), #7C3AED (purple), #10B981 (green)
- Include labels, arrows, and text to explain the concept
- Be suitable for learning and understanding ${topic}

Provide ONLY the SVG code, starting with <svg> and ending with </svg>. No explanations, just the code.
`;

    const result = await model.generateContent(diagramPrompt);
    const svgCode = result.response.text();

    // Extract SVG if wrapped in code blocks
    let cleanSvg = svgCode.trim();
    if (cleanSvg.includes("```")) {
      cleanSvg = cleanSvg
        .replace(/```svg\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
    }

    // Validate it's actually SVG
    if (!cleanSvg.includes("<svg")) {
      throw new Error("Generated content is not valid SVG");
    }

    // Convert SVG to data URL
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(
      cleanSvg
    ).toString("base64")}`;

    return NextResponse.json({
      success: true,
      imageUrl: svgDataUrl,
      description: `AI-generated ${diagramType} diagram for ${topic}: ${prompt}`,
      topic,
      diagramType,
      message: "AI-powered diagram generated using Gemini",
    });
  } catch (error) {
    console.error("AI Image generation error:", error);

    // Fallback: Generate a simple text-based SVG as backup
    const { prompt, topic } = await req.json();
    const fallbackSvg = generateFallbackSVG(topic, prompt);
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(
      fallbackSvg
    ).toString("base64")}`;

    return NextResponse.json({
      success: true,
      imageUrl: svgDataUrl,
      description: `Fallback diagram for ${topic}`,
      topic,
      message: "Fallback diagram generated (AI unavailable)",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Fallback SVG generator
function generateFallbackSVG(topic: string, concept: string): string {
  return `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <rect width="800" height="600" fill="#1F2937"/>
  
  <!-- Main topic circle -->
  <circle cx="400" cy="200" r="80" fill="url(#grad)" stroke="#fff" stroke-width="3"/>
  <text x="400" y="205" font-family="Arial" font-size="18" fill="white" text-anchor="middle" font-weight="bold">${topic.substring(
    0,
    20
  )}</text>
  
  <!-- Concept boxes -->
  <rect x="150" y="350" width="180" height="80" rx="10" fill="#4F46E5" stroke="#fff" stroke-width="2"/>
  <text x="240" y="395" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Key Concept</text>
  
  <rect x="470" y="350" width="180" height="80" rx="10" fill="#7C3AED" stroke="#fff" stroke-width="2"/>
  <text x="560" y="395" font-family="Arial" font-size="14" fill="white" text-anchor="middle">Application</text>
  
  <!-- Connecting lines -->
  <line x1="400" y1="280" x2="240" y2="350" stroke="#10B981" stroke-width="2"/>
  <line x1="400" y1="280" x2="560" y2="350" stroke="#10B981" stroke-width="2"/>
  
  <!-- Title -->
  <text x="400" y="50" font-family="Arial" font-size="24" fill="#fff" text-anchor="middle" font-weight="bold">Learning: ${concept.substring(
    0,
    30
  )}</text>
  
  <!-- AI Badge -->
  <rect x="650" y="20" width="130" height="30" rx="15" fill="#10B981"/>
  <text x="715" y="40" font-family="Arial" font-size="12" fill="white" text-anchor="middle">AI Generated</text>
</svg>
`.trim();
}
