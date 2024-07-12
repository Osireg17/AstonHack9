import React from 'react';
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";

const SettingsPage = async () => {
    const isPro = await checkSubscription();

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-white p-4">
            <h1 className="text-4xl font-bold mb-6">Settings</h1>
            <div className="w-full max-w-md p-6 bg-slate-800 rounded-lg shadow-lg">
                {isPro ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">You are a Pro User</h2>
                        <p className="text-gray-400 mb-4">Thank you for supporting us!</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-2">Free User</h2>
                        <p className="text-gray-400 mb-4">Upgrade to Pro to unlock all features</p>
                        <SubscriptionButton isPro={isPro}/>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;
