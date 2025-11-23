import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { role, cv, history, userMessage } = await request.json();
    if (!role || !cv) {
      return NextResponse.json(
        { error: "Role and CV are required" },
        { status: 400 }
      );
    }

    const modelName = process.env.AI_MODEL_NAME || "gemini-pro";

    const model = genAI.getGenerativeModel({ model: modelName });
    let aiResponse: string;

    if (!history || history.length === 0) {
      const prompt = `Kamu adalah Miku, seorang HRD yang sedang interview kandidat untuk posisi ${role}.

CV kandidat:
${cv}

Tugas kamu:
- Sapa kandidat dengan SINGKAT (1 kalimat saja, perkenalkan diri sebagai Miku)
- Langsung tanya SATU pertanyaan interview yang relevan dengan posisi dan CV mereka

PENTING: 
- Jangan pakai format markdown (###, **, *, dll)
- Jangan buat draft atau struktur - langsung bicara natural
- Maksimal 3-4 kalimat total
- Fokus ke 1 pertanyaan saja

Contoh yang BAIK:
"Halo! Saya Miku dari tim HRD. Saya lihat di CV kamu punya pengalaman dengan React.js. Bisa ceritakan project React yang paling berkesan?"

Contoh yang BURUK:
"### Salam
Halo, perkenalkan saya...
### Pertanyaan 1
..."`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiResponse = response.text();

      await prisma.interviewSession.create({
        data: {
          userRole: role,
          userCv: cv,
          chatHistory: [{ role: "ai", content: aiResponse }],
        },
      });
    } else {
      const conversationContext = history
        .map(
          (msg: any) =>
            `${msg.role === "user" ? "Kandidat" : "Miku"}: ${msg.content}`
        )
        .join("\n");

      const prompt = `Kamu adalah Miku, HRD yang sedang interview untuk posisi ${role}.

CV kandidat:
${cv}

Percakapan:
${conversationContext}

Jawaban kandidat terakhir:
${userMessage}

Tugas kamu:
- Beri feedback SINGKAT terhadap jawaban mereka (1 kalimat saja)
- Tanya SATU pertanyaan baru yang relevan

PENTING:
- Jangan pakai format markdown
- Jangan buat struktur atau numbering
- Maksimal 2-3 kalimat total
- Natural seperti chat biasa

Contoh yang BAIK:
"Wah menarik! Berarti kamu sudah familiar dengan state management ya. Kalau performance optimization di React, kamu biasa pakai teknik apa?"

Contoh yang BURUK:
"### Feedback
Jawaban bagus...
### Pertanyaan selanjutnya
..."`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      aiResponse = response.text();

      const updatedHistory = [
        ...history,
        { role: "user", content: userMessage },
        { role: "ai", content: aiResponse },
      ];
      const session = await prisma.interviewSession.findFirst({
        where: { userRole: role, userCv: cv },
        orderBy: { createdAt: "desc" },
      });

      if (session) {
        await prisma.interviewSession.update({
          where: { id: session.id },
          data: { chatHistory: updatedHistory },
        });
      }
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Interview API Error:", error);
    return NextResponse.json(
      { error: "Failed to process interview request", details: error.message },
      { status: 500 }
    );
  }
}
