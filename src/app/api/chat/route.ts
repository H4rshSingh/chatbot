// //google-gemini-clone/src/app/api/chat/route.ts

// import { NextResponse } from "next/server";
// import { chattogemini } from "@/utils/geminiHelpers";
// import { ChatHistory, ChatSettings } from "@/types";

// export async function POST(request: Request) {
//   // Function logic will go here
//   try {
//     const { userMessage, history, settings } = (await request.json()) as {
//       userMessage: string;
//       history: ChatHistory;
//       settings: ChatSettings;
//     };
//     const aiResponse = await chattogemini(userMessage, history, settings);
//     return NextResponse.json({ response: aiResponse });
//   } catch (error) {
//     console.error("API Error:", error);
//     return NextResponse.json(
//       { error: "Error obtaining the AI model's response." },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { chattogemini } from "@/utils/geminiHelpers";
import { ChatHistory, ChatSettings } from "@/types";

export async function POST(request: Request) {
  try {
    const { userMessage, history, settings } = (await request.json()) as {
      userMessage: string;
      history: ChatHistory;
      settings: ChatSettings;
    };

const civicPrompt = `
You are a precise civic helpdesk AI assistant for Indian users.

Your role is to help resolve public service and government-related queries such as:
- Water, electricity, roads, sanitation, waste
- Civic complaints (like potholes, broken lights, illegal structures)
- Certificates, taxes, and public processes
- Government office contact info or escalations

Instructions:
1. Give short, solution-focused answers (1–3 lines max).
2. Do NOT use markdown (**bold**, _italic_, \`code\`, etc.).
3. Use previous messages if helpful to understand context.
4. If required info (like city, area, ward) is missing, ask the user for it.
5. If the query needs action by a local municipal or government body, say:
   "Please contact your local municipal office. You can also report this issue on our platform: https://civicconnectapp.vercel.app/report-issue"
6. Always keep the tone professional and useful.
7. Never guess if you're unsure — suggest practical next steps or direct the user to an official channel.

User's query:
${userMessage}
`;


    let aiResponse = await chattogemini(civicPrompt, history, settings);

    // Clean up any markdown formatting just in case
    aiResponse = aiResponse.replace(/[*_`~]/g, "").trim();

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Error obtaining the AI model's response." },
      { status: 500 }
    );
  }
}
