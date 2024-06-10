"use client"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const TrainAIButton = () => {
    const { toast } = useToast();

    const showErrorToast = (description: string) => {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description,
        });
    };

    const showSuccessToast = (description: string) => {
        toast({
            description,
        });
    };

    const [loading, setLoading] = useState(false);

    const handleTrain = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/api/train");
            //alert(response.data.message);
            if (response.status >= 200 && response.status < 300) {
                showSuccessToast("Success!");
            } else {
                showErrorToast("Something went wrong. Please try again.");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const { data } = error.response;
                const errorMessage = data?.error || "An error occurred during Trainning";
                showErrorToast(errorMessage);
            } {
                showErrorToast("An unexpected error occurred during Trainning");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleTrain} disabled={loading}>
            {loading ? "Training..." : "Train your chatbot"}
        </Button>
    )
}

export default TrainAIButton