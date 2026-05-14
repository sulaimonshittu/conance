import RequestCard from "@/lib/components/artisan/artisan-requests/RequestCard";
import { DETAILED_MOCK_REQUESTS } from "@/lib/utils/mockData";


const Requests = () => {
    return (
        <section className="flex flex-col gap-s2 w-full mt-s4 mb-24">


            <div className="flex flex-col gap-4">
                {DETAILED_MOCK_REQUESTS.map((request) => (
                    <RequestCard key={request.id} request={request} />
                ))}
            </div>
        </section>
    )
}

export default Requests