import { Chapter, Course, Unit } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
    course: Course & {
        units: (Unit & {
            chapters: Chapter[];
        })[];
    };
};

const GalleryCourseCard = ({ course }: Props) => {
    const cardSizeClass = "h-[500px] w-[300px]";
    return (
        <div className={`border rounded-lg border-secondary ${cardSizeClass} flex flex-col`}>
            <div className="relative overflow-hidden rounded-t-lg flex-shrink-0">
                <Link href={`/course/${course.id}/0/0`}>
                    <div className="w-full h-2/3 cursor-pointer"> {/* Adjust the height ratio as needed */}
                        <Image
                            src={course.image || ""}
                            className="object-cover w-full max-h-[300px] rounded-t-lg"
                            width={300}
                            height={300}
                            alt="picture of the course"
                            objectFit={"fill"}
                            objectPosition={"center"}

                        />
                    </div>
                </Link>
            </div>
            <div className="p-4 flex-grow">
                <h4 className="text-sm text-secondary-foreground/60">Units</h4>
                <div className="space-y-1 overflow-auto">
                    {course.units.map((unit, unitIndex) => (
                        <Link href={`/course/${course.id}/${unitIndex}/0`} key={unit.id}>
                            <div className="block underline w-fit cursor-pointer">
                                {unit.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GalleryCourseCard;