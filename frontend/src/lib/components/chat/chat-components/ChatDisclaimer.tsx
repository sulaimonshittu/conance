import { ShieldAlert } from "lucide-react"

const ChatDisclaimer = () => {
    return (
        <div className="flex items-start gap-2 bg-[#FAF7F2] border border-[#F1E9DA] p-s3 rounded-2xl mx-s3 my-s2">
            <ShieldAlert size={16} className="text-primary mt-0.5 shrink-0" />
            <p className="text-[11px] text-text-muted font-medium leading-relaxed">
                <strong className="text-gray-900 block mb-0.5">Safety Notice</strong>
                This chat is monitored by Conance AI for safety, quality assurance, and dispute resolution purposes. Do not share sensitive payment information outside the platform.
            </p>
        </div>
    )
}

export default ChatDisclaimer
