import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { topic, difficulty, questionCount, language, profile } = await req.json();

    const difficultyLevel = difficulty || profile?.priorKnowledge || 'beginner';
    const numQuestions = questionCount || 5;
    const quizLanguage = language || 'english';

    const prompt = `
# QUIZ GENERATION REQUEST

Generate a quiz for a student learning **${topic}**.

## Parameters:
- **Difficulty Level**: ${difficultyLevel}
- **Number of Questions**: ${numQuestions}
- **Language**: ${quizLanguage}
- **Student Confidence**: ${profile?.confidence || 3}/5

## Requirements:
1. Create ${numQuestions} multiple-choice questions
2. Each question should have 4 options (A, B, C, D)
3. Include clear explanations for correct answers
4. Match the difficulty level appropriately
5. Make questions practical and engaging
6. Respond ONLY in valid JSON format

## JSON Format (STRICT):
{
  "quizTitle": "Quiz title here",
  "topic": "${topic}",
  "difficulty": "${difficultyLevel}",
  "questions": [
    {
      "id": 1,
      "question": "Question text here",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctAnswer": "A",
      "explanation": "Detailed explanation why A is correct"
    }
  ]
}

Generate the quiz now in ${quizLanguage}:
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    let quizText = result.response.text();

    // Clean up the response - remove markdown code blocks if present
    quizText = quizText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the JSON response
    const quiz = JSON.parse(quizText);

    // Validate quiz structure
    if (!quiz.questions || !Array.isArray(quiz.questions)) {
      throw new Error('Invalid quiz structure');
    }

    return NextResponse.json({ 
      success: true,
      quiz 
    });

  } catch (error) {
    console.error("Quiz API Error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to generate quiz. Please try again.",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for quick quiz generation
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topic = searchParams.get('topic') || 'General Knowledge';
  const difficulty = searchParams.get('difficulty') || 'beginner';
  const questionCount = parseInt(searchParams.get('questions') || '5');

  return POST(new Request(req.url, {
    method: 'POST',
    body: JSON.stringify({ topic, difficulty, questionCount, language: 'english' })
  }));
}
