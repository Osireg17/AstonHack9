import { NextResponse } from "next/server";
import { createChaptersSchema } from "@/validators/course";
import { ZodError } from "zod";
import { strict_output } from "@/lib/gpt";
import { getUnsplashImage } from "@/lib/unsplash";
import { prisma } from "@/lib/database";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, units, educationLevel } = createChaptersSchema.parse(body);

        type OutputUnits = {
            title: string;
            chapters: {
                youtube_search_query: string;
                chapter_title: string;
            }[];
        }[];

        const outputUnits: OutputUnits = await strict_output(
            `You are an AI assistant tasked with curating course content for the education level "${educationLevel}". For the given course title "${title}", please create an array of units. Each unit should have a title and an array of chapters. For each chapter, provide a relevant YouTube search query and a chapter title that accurately represents the content of the educational video that would be found using that search query. The content should be tailored for the "${educationLevel}" education level.`,
            new Array(units.length).fill(
                `It is your job to create a course about ${title} for the ${educationLevel} education level. The user has requested to create chapters for each of the units. Then, for each chapter, provide a detailed youtube search query that can be used to find an informative educational video for each chapter. Each query should give an educational informative course in youtube, tailored for the ${educationLevel} education level.`
            ),
            {
                title: "title of the unit",
                chapters:
                    "an array of chapters, each chapter should have a youtube_search_query and a chapter_title key in the JSON object",
            }
        );

        const imageSearchTerm = await strict_output(
            `You are an AI assistant skilled in finding relevant images for a given topic. Please suggest a concise and suitable image search term for the course title "${title}" for the "${educationLevel}" education level. This search term will be used to retrieve an appropriate image from the Unsplash API, so it should be descriptive and accurately represent the course content suitable for the "${educationLevel}" education level.`,
            `Please provide a good image search term for the title of a course about ${title} for the ${educationLevel} education level. This search term will be fed into the unsplash API, so make sure it is a good search term that will return good results`,
            {
                image_search_term: "a good search term for the title of the course",
            }
        );

        const courseImage = await getUnsplashImage(imageSearchTerm.image_search_term);

        const course = await prisma.course.create({
            data: {
                name: title,
                image: courseImage,
            },
        });

        for (const unit of outputUnits) {
            const prismaUnit = await prisma.unit.create({
                data: {
                    name: unit.title,
                    courseId: course.id,
                },
            });

            const chapters = unit.chapters.map(chapter => ({
                name: chapter.chapter_title,
                youtubeSearchQuery: chapter.youtube_search_query,
                unitId: prismaUnit.id,
            }));

            await prisma.chapter.createMany({ data: chapters });
        }

        return new NextResponse(
            JSON.stringify({ success: true, courseId: course.id }),
            { status: 200 }
        );
    } catch (e) {
        if (e instanceof ZodError) {
            return new NextResponse(JSON.stringify({ errors: e.errors }), { status: 400 });
        } else {
            console.error(e as Error);
            return new NextResponse(JSON.stringify({ error: (e as Error).message || "An error occurred" }), { status: 500 });
        }
    }
}
