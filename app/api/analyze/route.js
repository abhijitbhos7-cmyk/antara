import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { audioUrl } = await req.json();
    
    
    const audioRes = await fetch(audioUrl);
    const audioBlob = await audioRes.blob();
    
    
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.webm');
    formData.append('model', 'whisper-large-v3');
    
    const transcribeRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
      body: formData
    });
    
    const transcribeData = await transcribeRes.json();
    const transcript = transcribeData.text;

    if (!transcript) {
        return NextResponse.json({ 
            message: "I couldn't quite hear that. Take a deep breath and try recording again.", 
            suggestedTopic: "Calm" 
        });
    }

    
    const chatRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are an empathetic mindfulness guide. Read the user's journal transcript. 
            1. Write a short, comforting 1-2 sentence response validating their feelings.
            2. Recommend exactly ONE of these topics based on their mood: "Focus", "Calm", "Sleep", "Confidence", "Self-love".
            Format your response EXACTLY as a JSON object: {"message": "your response", "suggestedTopic": "Topic"}`
          },
          { role: 'user', content: transcript }
        ],
        response_format: { type: "json_object" }
      })
    });

    const chatData = await chatRes.json();
    const analysis = JSON.parse(chatData.choices[0].message.content);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
        { message: "It seems you might need a moment of peace right now. Let's try this session.", suggestedTopic: "Calm" }, 
        { status: 200 }
    );
  }
}