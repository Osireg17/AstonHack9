"use client";
import React from "react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Plus, Trash } from "lucide-react";
import { createChaptersSchema } from "@/validators/course";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";
import {Separator} from "@/components/ui/separator";
import {Button} from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {};

type Input = z.infer<typeof createChaptersSchema>;

const CreateCourseForm = (props: Props) => {
    const router = useRouter();
    // @ts-ignore
    const { mutate: createChapters, isLoading } = useMutation({
        mutationFn: async ({ title, units }: Input) => {
            const response = await axios.post("/api/course/createChapters", {
                title,
                units,
            });
            return response.data;
        },
    });


  const form = useForm<Input>({
    resolver: zodResolver(createChaptersSchema),
    defaultValues: {
      title: "",
      units: ["", "", "", ""],
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
    createChapters(data, {
        onSuccess: ({course_id}) => {
            toast({
            title: "Success",
            description: "Course created successfully",
            variant: "default",
            });
            router.push(`/create/${course_id}`)
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onError: (error) => {
            toast({
            title: "Error",
            description: "Something went wrong, unable to create course",
            variant: "destructive",
            });
        },
        });
    }

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
                <div className="flex items-center justify-center mt-4">
                <Button
                    disabled={isLoading}
                    type="submit"
                    className="w-full mt-6"
                    size="lg"
                >
                    {isLoading ? "Creating..." : "Create Course"}
                </Button>
            </div>
        </form>
      </Form>
    </div>
  );
};

export default CreateCourseForm;