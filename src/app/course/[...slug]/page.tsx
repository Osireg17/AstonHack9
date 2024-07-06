import React from 'react';
import { prisma } from "@/lib/database";
import { redirect } from "next/navigation";
import CourseSideBar from "@/components/CourseSideBar";
import MainVideoSummary from "@/components/MainVideoSummary";
import QuizCards from "@/components/QuizCards";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";


type Props = {
    params: {
        slug: string[];
    };
};
const CoursePage = async ({ params: { slug } }: Props) => {
    const [courseId, unitIdexParam, chapterIndexParam] = slug;
    const course = await prisma.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            units: {
                include: {
                    chapters: {
                        include: {
                            questions: true,
                        }
                    }
                },
            },
        },
    });

    if (!course) {
        return redirect("/gallery");
    }

    const unitIndex = parseInt(unitIdexParam);
    const chapterIndex = parseInt(chapterIndexParam);

    const unit = course.units[unitIndex];
    if (!unit) {
        return redirect('/gallery');
    }
    const chapter = unit.chapters[chapterIndex];
    if (!chapter) {
        return redirect('/gallery');
    }

    const nextChapter = unit.chapters[chapterIndex + 1];
    const prevChapter = unit.chapters[chapterIndex - 1];

    return (
        <div>
            <CourseSideBar course={course} currentChapterId={chapter.id} />
            <div>
                <div className={"ml-[400px] px-8"}>
                    <div className="flex">
                        <MainVideoSummary chapter={chapter} chapterIndex={chapterIndex} unit={unit} unitIndex={unitIndex} />
                        <QuizCards chapter={chapter} />
                    </div>
                    <div className={"mt-16 border-t border-secondary-foreground/20"} />
                    <div className={"flex pb-8"}>
                        {prevChapter && (
                            <Link className={"flex mt-4 mr-auto w-fit"} href={`/course/${course.id}/${unitIndex}/${chapterIndex - 1}`}>
                                <div className={"flex items-center"}>
                                    <ChevronLeft className={"flex items-center"} />
                                    <div className={"flex flex-col items-start"}>
                                        <span className={"text-sm text-secondary-foreground/60"}>Previous Chapter</span>
                                        <span className={"text-xl font-bold"}>{prevChapter.name}</span>
                                    </div>
                                </div>
                            </Link>
                        )}

                        {nextChapter && (
                            <Link className={"flex mt-4 ml-auto w-fit"} href={`/course/${course.id}/${unitIndex}/${chapterIndex + 1}`}>
                                <div className={"flex items-center"}>
                                    <div className={"flex flex-col items-end"}>
                                        <span className={"text-sm text-secondary-foreground/60"}>Next Chapter</span>
                                        <span className={"text-xl font-bold"}>{nextChapter.name}</span>
                                    </div>
                                    <ChevronLeft className={"flex items-center transform rotate-180"} />
                                </div>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoursePage;