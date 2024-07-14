"use client";
import React, { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { createChaptersSchema } from "@/validators/course";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Plus, Trash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import SubscriptionAction from "@/components/SubscriptionAction";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";


type Props = {
    isPro: boolean;
};

type Input = z.infer<typeof createChaptersSchema>;

const CreateCourseForm = ({ isPro }: Props) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isButtonEnabled, setButtonEnabled] = useState(false);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { mutate: createChapters, isLoading } = useMutation({
        mutationFn: async ({ title, units, educationLevel }: Input) => {
            const response = await axios.post("/api/course/createChapters", {
                title,
                units,
                educationLevel,
            });
            return response.data;
        },
        onSuccess: ({ courseId }) => {
            toast({
                title: "Success",
                description: "Course created successfully",
            });
            setButtonEnabled(true);
            setDialogOpen(false);
            router.push(`/create/${courseId}`);
        },
        onError: (error) => {
            console.error(error);
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            });
            setButtonEnabled(true);
            setDialogOpen(false);
        },
    });

    const form = useForm<Input>({
        resolver: zodResolver(createChaptersSchema),
        defaultValues: {
            title: "",
            units: ["", "", ""],
            educationLevel: "gcse", // Set a default value if needed
        },
    });

    function onSubmit(data: Input) {
        if (data.units.some((unit) => unit === "")) {
            toast({
                title: "Error",
                description: "Please fill all the units",
                variant: "destructive",
            });
            return;
        }
        setDialogOpen(true);
        setButtonEnabled(false);
        createChapters(data);
    }

    form.watch();

    return (
        <div className="w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full mt-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => {
                            return (
                                <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                                    <FormLabel className="flex-[1] text-xl">Title</FormLabel>
                                    <FormControl className="flex-[6]">
                                        <Input
                                            placeholder="Enter the main topic of the course"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="educationLevel"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                                <FormLabel className="flex-[1] text-xl mr-2">
                                    Education
                                </FormLabel>
                                <FormControl className="flex-[6]">
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="gcse">GCSEs</SelectItem>
                                            <SelectItem value="alevel">A Levels</SelectItem>
                                            <SelectItem value="undergraduate">Undergraduate</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <AnimatePresence>
                        {form.watch("units").map((_, index) => {
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{
                                        opacity: { duration: 0.2 },
                                        height: { duration: 0.2 },
                                    }}
                                >
                                    <FormField
                                        key={index}
                                        control={form.control}
                                        name={`units.${index}`}
                                        render={({ field }) => {
                                            return (
                                                <FormItem className="flex flex-col items-start w-full sm:items-center sm:flex-row">
                                                    <FormLabel className="flex-[1] text-xl">
                                                        Unit {index + 1}
                                                    </FormLabel>
                                                    <FormControl className="flex-[6]">
                                                        <Input
                                                            placeholder="Enter subtopic of the course"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    <div className="flex items-center justify-center mt-4">
                        <Separator className="flex-[1]" />
                        <div className="mx-4">
                            <Button
                                type="button"
                                variant="secondary"
                                className="font-semibold"
                                onClick={() => {
                                    form.setValue("units", [...form.watch("units"), ""]);
                                }}
                            >
                                Add Unit
                                <Plus className="w-4 h-4 ml-2 text-green-500" />
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                className="font-semibold ml-2"
                                onClick={() => {
                                    form.setValue("units", form.watch("units").slice(0, -1));
                                }}
                            >
                                Remove Unit
                                <Trash className="w-4 h-4 ml-2 text-red-500" />
                            </Button>
                        </div>
                        <Separator className="flex-[1]" />
                    </div>
                    <Button
                        disabled={isLoading}
                        type="submit"
                        className="w-full mt-6"
                        size="lg"
                    >
                        Lets Go!
                    </Button>
                </form>
            </Form>
            {!isPro && (
                <SubscriptionAction/>
            )}

            <AlertDialog open={isDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Creating Course...</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please wait while we create your course.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <Progress value={isLoading ? 50 : 100} />
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDialogOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={!isButtonEnabled}
                            onClick={() => {
                                setDialogOpen(false);
                                setButtonEnabled(false);
                            }}
                        >
                            Done
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default CreateCourseForm;

