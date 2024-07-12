import { prisma } from "@/lib/database";
import { strict_output } from "@/lib/gpt";
import {
    getQuestionsFromTranscript,
    getTranscript,
    searchYoutube,
} from "@/lib/youtube";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodyParser = z.object({
    chapterId: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {chapterId} = bodyParser.parse(body);
        const chapter = await prisma.chapter.findUnique({
            where: {
                id: chapterId,
            },
        });
        if (!chapter) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Chapter not found",
                },
                {status: 404}
            );
        }
        const videoId = await searchYoutube(chapter.youtubeSearchQuery);
        let transcript = await getTranscript(videoId);
        const maxLength = 300;
        transcript = transcript.split(" ").slice(0, maxLength).join(" ");

        const { summary } = await strict_output(
            "You are an AI assistant skilled at summarizing video transcripts concisely and accurately.",
            `Summarize the following transcript in 250 words or fewer. Focus only on the main topic and omit any sponsor mentions or irrelevant information. Do not provide an introduction; simply present the summary.

${transcript}`,
            { summary: "" }
        );

        const questions = await getQuestionsFromTranscript(
            transcript,
            chapter.name
        );

        await prisma.question.createMany({
            data: questions.map((question) => {
                let options = [
                    question.answer,
                    question.option1,
                    question.option2,
                    question.option3,
                ];
                options = options.sort(() => Math.random() - 0.5);
                return {
                    question: question.question,
                    answer: question.answer,
                    options: JSON.stringify(options),
                    chapterId: chapterId,
                };
            }),
        });

        await prisma.chapter.update({
            where: {id: chapterId},
            data: {
                videoId: videoId,
                summary: summary,
            },
        });


        console.log(transcript, summary, questions);
        return NextResponse.json({success: true});

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid body",
                },
                {status: 400}
            );
        } else {
            console.error(error);
            return NextResponse.json(
                {
                    success: false,
                    error: "Internal server error",
                },
                {status: 500}
            );
        }
    }
}