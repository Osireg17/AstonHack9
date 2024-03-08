import React from 'react';
import {Chapter, Unit} from "@prisma/client";

type Props = {
    chapter: Chapter
    unit: Unit
    unitIndex: number
    chapterIndex: number
}

const MainVideoSummary = (
    {chapter, unit, unitIndex, chapterIndex}: Props
) => {
    return (
        <div className={"flex-[2] mt-16"}>

        </div>
    );
};

export default MainVideoSummary;