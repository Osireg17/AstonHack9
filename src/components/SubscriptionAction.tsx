'use client'
import React from 'react';
import {useSession} from "next-auth/react";
import {Progress} from "@/components/ui/progress";
import {Button} from "@/components/ui/button";
import {Zap} from "lucide-react";
import axios from "axios";



const SubscriptionAction = () => {
    const {data} = useSession()
    const [loading, setLoading] = React.useState<boolean>(false)

    async function handleSubscribe() {
        setLoading(true)
        try {
            const response =  await axios.get('/api/stripe')
            window.location.href = response.data.url
        }catch (error){
            console.error(error)
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className={"flex flex-col items-center w-1/2 p-4 mx-auto mt-4 rounded-md bg-slate-800 text-white"}>
            {data?.user.credits} / 10 Free Generations
            <Progress className={"mt-2"} value={data?.user.credits ? ((data?.user.credits / 10) * 100) : 0}/>
            <Button disabled={loading} onClick={handleSubscribe} className={"mt-3 font-bold transition bg-gradient-to-tr from-green-400 to-blue-800 hover:from-green-500 to-blue-800"}>
                Upgrade
                <Zap className={"fill-white ml-2"}/>
            </Button>
        </div>
    );
};

export default SubscriptionAction;