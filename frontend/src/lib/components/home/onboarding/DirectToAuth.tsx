import Button from "../../common/Button"
import onBoarding from "../../../../assets/onboardingImage.png"
import { useNavigate } from "react-router-dom"
import useAuthStore from "../../../hooks/useAuthStore"

const DirectToAuth = () => {
    const navigate = useNavigate()
    const { setRole } = useAuthStore()
    const handleGetStarted = () => {
        navigate("/signup")
    }
    const handleLoginAsArtisan = () => {
        setRole("artisan")
        navigate("/login")
    }
    const handleLoginAsClient = () => {
        setRole("client")
        navigate("/login")
    }
    return (
        <section className="bg-[#FFF3EE] w-full min-h-screen  flex flex-col items-center justify-center gap-s5 ">
            <div className="flex w-full pt-s3 pb-s5 px-10 text-primary justify-center">
                <h4 className="text-2xl font-bold">Conance</h4>
            </div>
            <div className="w-full">
                <img src={onBoarding} alt="on boardidng image" />
            </div>
            <div className="flex flex-col items-center text-b1 font-bold">
                <p>Trusted Jobs</p>
                <p>Secure Payments</p>
                <p className="text-b3 text-[#757575] font-normal">Nigeria’s financial trust layer for artisans and clients.</p>
            </div>


            <div className="flex flex-col gap-s1 w-full px-10">
                <Button className="" fullWidth variant="primary" onClick={handleGetStarted}>Get Started</Button>
                <Button className="" fullWidth variant="secondary" onClick={handleLoginAsArtisan}>Log In as Artisan</Button>
                <Button className="" fullWidth variant="outline" onClick={handleLoginAsClient}>Log In as Client</Button>
            </div>
        </section>
    )
}

export default DirectToAuth