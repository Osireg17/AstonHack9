"use client";
import { cn } from "@/lib/utils";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useToast } from "./ui/use-toast";

type Props = {
    chapter: Chapter;
    chapterIndex: number;
    completedChapters: Set<string>;
    setCompletedChapters: React.Dispatch<React.SetStateAction<Set<string>>>;
};

export type ChapterCardHandler = {
    triggerLoad: () => void;
};

const ChapterCard = React.forwardRef<ChapterCardHandler, Props>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ chapter, chapterIndex, setCompletedChapters, completedChapters }, ref) => {
        const { toast } = useToast();
        const [success, setSuccess] = React.useState<boolean | null>(null);

        const { mutate: getChapterInfo} = useMutation({
            mutationFn: async () => {
                const response = await axios.post("/api/chapter/getInfo", {
                    chapterId: chapter.id,
                });
                return response.data;
            },
        });

        const addChapterIdToSet = React.useCallback(() => {
            setCompletedChapters((prev) => {
                const newSet = new Set(prev);
                newSet.add(chapter.id);
                return newSet;
            });
        }, [chapter.id, setCompletedChapters]);

        React.useEffect(() => {
            if (chapter.videoId) {
                setSuccess(true);
                addChapterIdToSet;
            }
        }, [chapter, addChapterIdToSet]);

        React.useImperativeHandle(ref, () => ({
            async triggerLoad() {
                if (chapter.videoId) {
                    addChapterIdToSet();
                    return;
                }
                getChapterInfo(undefined, {
                    onSuccess: () => {
                        setSuccess(true);
                        addChapterIdToSet();
                    },
                    onError: (error) => {
                        console.error(error);
                        setSuccess(false);
                        toast({
                            title: "Error",
                            description: "There was an error loading your chapter",
                            variant: "destructive",
                        });
                        addChapterIdToSet();
                    },
                });
            },
        }));
        return (
            <div
                key={chapter.id}
                className={cn("px-4 py-2 mt-2 rounded flex justify-between", {
                    "bg-secondary": success === null,
                    "bg-red-500": success === false,
                    "bg-green-500": success === true,
                })}
            >
                <h5>{chapter.name}</h5>
            </div>
        );
    }
);

ChapterCard.displayName = "ChapterCard";

export default ChapterCard;