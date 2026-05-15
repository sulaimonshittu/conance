import RoleBasedProfileLayout from "@/lib/components/profile/RoleBasedProfileLayout"

const ClientProfilePage = () => {
    return (
        <div className="min-h-screen bg-[#FCF9F6]">
            <RoleBasedProfileLayout role="client" />
        </div>
    )
}

export default ClientProfilePage
