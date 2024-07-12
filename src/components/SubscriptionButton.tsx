'use client'
import React from 'react';
import {Button} from "@/components/ui/button";
import axios from "axios";

type Props = {
    isPro: boolean;
};

const SubscriptionButton = ({isPro}: Props) => {
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
        <Button disabled={loading} onClick={handleSubscribe} className={"font-bold transition bg-gradient-to-tr from-green-400 to-blue-800 hover:from-green-500 to-blue-800"}>
            {isPro ? 'Manage Subscription' : 'Upgrade'}
        </Button>
    );
};

export default SubscriptionButton;