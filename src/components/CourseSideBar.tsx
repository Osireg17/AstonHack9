import React from 'react';
import { Chapter, Course, Unit } from "@prisma/client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type Props = {
    course: Course & {
        units: (Unit & {
            chapters: Chapter[];
        })[];
    };
    currentChapterId: string;
};

const CourseSideBar = async ({ course, currentChapterId }: Props) => {
    return (
        <div className="w-[400px] absolute top-1/2 -translate-y-1/2 p-8 rounded-r-2xl bg-slate-800 shadow-lg">
            <h2 className="text-3xl font-bold text-white">
                {course.name}
            </h2>
            <Separator className="my-4 border-gray-600" />
            {course.units.map((unit, unitIndex) => (
                <div key={unit.id} className="mt-6">
                    <h3 className="text-lg uppercase text-gray-400">
                        Unit {unitIndex + 1}
                    </h3>
                    <h4 className="text-xl font-semibold text-gray-200 mt-1">
                        {unit.name}
                    </h4>
                    {unit.chapters.map((chapter, chapterIndex) => (
                        <div key={chapter.id} className="mt-2">
                            <Link
                                href={`/course/${course.id}/${unitIndex}/${chapterIndex}`}
                                className={cn(
                                    "text-gray-400 hover:text-gray-200 transition-colors duration-200 ease-in-out",
                                    {
                                        "text-green-400 font-bold":
                                            chapter.id === currentChapterId,
                                    }
                                )}
                            >
                                {chapter.name}
                            </Link>
                        </div>
                    ))}
                    <Separator className="my-4 border-gray-600" />
                </div>
            ))}
        </div>
    );
};

export default CourseSideBar;