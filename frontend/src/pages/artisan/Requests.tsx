import Requests from "@lib/components/artisan/artisan-requests/Requests"


const RequestsPage = () => {
    return (
        <section>
            <div className="flex flex-col items-center gap-s1">
                <h1 className="font-bold text-h1 text-gray-900">
                    Job Requests
                </h1>
                <p className="text-b2 text-gray-600">
                    Check new requests from clients
                </p>
            </div>
            <Requests />
        </section>
    )
}

export default RequestsPage