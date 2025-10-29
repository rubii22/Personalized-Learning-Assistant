import { GoogleGenerativeAI } from "@google/generative-ai";

interface DiagramConfig {
  topic: string;
  concept: string;
  type?: 'flowchart' | 'mindmap' | 'comparison' | 'process' | 'chart';
}

/**
 * Generate AI-powered educational diagrams using Gemini
 * This replaces all hardcoded diagrams with AI-generated content
 */
export async function generateAIEducationalDiagram(config: DiagramConfig): Promise<string> {
  const { topic, concept, type = 'mindmap' } = config;
  
  try {
    // Call the API route to generate image
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: concept, topic, diagramType: type })
    });
    
    const data = await response.json();
    return data.imageUrl || '';
  } catch (error) {
    console.error('AI diagram generation failed:', error);
    return '';
  }
}

// Deprecated: kept for backward compatibility only
export function generateEducationalDiagram(config: DiagramConfig): string {
  console.warn('generateEducationalDiagram is deprecated. Use generateAIEducationalDiagram instead.');
  return '';
}

/**
 * Generate diagram based on topic keywords
 */
export function getSmartDiagramType(topic: string, message: string): 'flowchart' | 'mindmap' | 'comparison' | 'process' | 'chart' {
  const lowerMessage = message.toLowerCase();

  // Detect type based on keywords
  if (lowerMessage.includes('step') || lowerMessage.includes('process') || lowerMessage.includes('how to')) {
    return 'flowchart';
  }
  
  if (lowerMessage.includes('compare') || lowerMessage.includes('difference') || lowerMessage.includes('vs')) {
    return 'comparison';
  }
  
  if (lowerMessage.includes('progress') || lowerMessage.includes('learning path') || lowerMessage.includes('roadmap')) {
    return 'process';
  }

  // Default to mindmap for concept explanations
  return 'mindmap';
}
