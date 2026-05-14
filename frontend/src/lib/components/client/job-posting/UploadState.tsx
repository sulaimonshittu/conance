import { Loader2, Mic2 } from "lucide-react";

interface UploadStateProps {
    message?: string;
}

const UploadState = ({ message = "Processing your voice..." }: UploadStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-10 gap-5">
            <div className="relative">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mic2 size={28} className="text-primary" />
                </div>
                <Loader2 size={20} className="absolute -top-1 -right-1 text-primary animate-spin" />
            </div>
            <div className="text-center">
                <p className="text-b2 font-bold text-gray-900 mb-1">{message}</p>
                <p className="text-[12px] text-text-muted font-medium animate-pulse">
                    This may take a few seconds...
                </p>
            </div>
        </div>
    );
};

export default UploadState;
