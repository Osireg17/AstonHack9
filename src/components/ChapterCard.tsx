import React from "react";
import {Chapter} from "@prisma/client";

type Props = {
    chapter: Chapter;
    chapterIndex: number;
    completedChapters: Set<string>;
    setCompletedChapters: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export type ChapterCardHandler = {
    triggerLoad: () => void;
}

const ChapterCard = ({chapter, chapterIndex}: Props) => {
    const [success, setSuccess] = React.useState<boolean | null>(null);
    const { mutate: getChapterInfo, isLoading } = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/chapter/getInfo", {
                chapterId: chapter.id,
            });
            return response.data;
        },
    });
    return (
        <div key={chapter.id} className={
            "flex justify-between items-center p-3 border border-secondary-foreground/20 rounded-md " +
            (success === null ? "hover:bg-secondary-foreground/10 cursor-pointer" : "") +
            (success === true ? "bg-success/10" : "") +
            (success === false ? "bg-error/10" : "")
        }>
            <h5>
                {chapter.name}
            </h5>
        </div>
    )
}

export default ChapterCard;