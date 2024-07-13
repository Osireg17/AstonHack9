import { getAuthSession } from '@/lib/auth'
import React from 'react'
import { redirect } from "next/navigation";
import { InfoIcon } from 'lucide-react';
import CreateCourseForm from '@/components/CreateCourseForm';
import {checkSubscription} from "@/lib/subscription";

type Props = {}

const CreatePage = async (props: Props) => {
    const session = await getAuthSession()
    if (!session?.user) {
        return redirect("/gallery");
    }
    const isPro =  await checkSubscription()
    return (
        <div className='flex flex-col items-start max-w-xl px-8 mx-auto my-24'>
            <h1 className="self-center text-3xl font-bold text-center sm:text-6xl">
                Create a new course
            </h1>
            <div className="flex p-4 mt-5 border-none bg-secondary">
                <InfoIcon className="w-12 h-12 mr-3 text-blue-400"  />
                <p className='text-lg'>
                    To create a new course, please enter a title for the subject you want to learn. Then provide a list of subtopics within the subject, and we will gemnerate some material for you to learn.
                </p>
            </div>

            <CreateCourseForm isPro={isPro}/>
        </div>
    )

}

export default CreatePage