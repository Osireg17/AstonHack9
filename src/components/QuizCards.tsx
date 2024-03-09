"use client";
import React from 'react';
import { Chapter, Question } from "@prisma/client";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

type Props = {
    chapter: Chapter & {
        questions: Question[];
    };
}

const QuizCards = ({ chapter }: Props) => {
    const [answers, setAnswers] = React.useState<Record<string, string>>({});
    const [questionState, setQuestionState] = React.useState<Record<string, boolean | null>>({});
    const [showCorrectAnswer, setShowCorrectAnswer] = React.useState<Record<string, boolean>>({});

    const checkAnswers = React.useCallback(() => {
        const newQuestionState = { ...questionState };
        const newShowCorrectAnswer = { ...showCorrectAnswer };

        chapter.questions.forEach((question) => {
            const answer = answers[question.id];
            if (!answer) return;

            const isCorrect = question.answer === answer;
            newQuestionState[question.id] = isCorrect;
            newShowCorrectAnswer[question.id] = !isCorrect;
        });

        setQuestionState(newQuestionState);
        setShowCorrectAnswer(newShowCorrectAnswer);
    }, [answers, questionState, showCorrectAnswer, chapter.questions]);

    return (
        <div className={"flex-1 mt-16 ml-8"}>
            <h1 className={"text-3xl font-bold"}>Quiz</h1>
            <div className={"mt-8"}>
                {chapter.questions.map((question) => {
                    const options = JSON.parse(question.options);
                    return (
                        <div key={question.id} className={cn("p-3 mt-4 border border-secondary rounded-b-lg", {
                            "bg-green-700": questionState[question.id] === true,
                            "bg-red-700": questionState[question.id] === false,
                            'bg-white': questionState[question.id] === null,
                        })}>
                            <h1 className={"text-xl"}>{question.question}</h1>
                            {showCorrectAnswer[question.id] && (
                                <div className="mt-2 text-white">
                                    Correct Answer: {question.answer}
                                </div>
                            )}
                            <div className={"mt-4"}>
                                <RadioGroup
                                    onValueChange={(e) => {
                                        setAnswers((prev) => {
                                            return {
                                                ...prev,
                                                [question.id]: e
                                            }
                                        })
                                    }}
                                >
                                    {options.map((option, index) => (
                                        <div className="flex items-center space-x-2" key={index}>
                                            <RadioGroupItem
                                                value={option}
                                                id={question.id + index.toString()}
                                            />
                                            <Label htmlFor={question.id + index.toString()}>
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    )
                })}
            </div>
            <Button className={"w-full mt-2"} size={'lg'} onClick={checkAnswers}>
                Check Answer
                <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
        </div>
    );
};

export default QuizCards;