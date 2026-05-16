import Input from "@/lib/components/common/Input"
import Button from "@/lib/components/common/Button"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useState } from "react"
import { toast } from "sonner"

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const { role, requestOtp, verifyOtp, isLoading } = useAuth()
    
    const [step, setStep] = useState<1 | 2>(1)
    const [phoneNumber, setPhoneNumber] = useState("")

    const onPhoneSubmit = async (data: any) => {
        if (!role) {
            toast.error("Please select a role first.")
            return
        }
        const success = await requestOtp(data.phoneNumber)
        if (success) {
            setPhoneNumber(data.phoneNumber)
            setStep(2)
            toast.success("OTP sent to your phone!")
        }
    }

    const onOtpSubmit = async (data: any) => {
        if (role) {
            await verifyOtp(phoneNumber, data.otp, role)
        }
    }

    return (
        <section className="min-h-screen px-s4 py-s5 flex flex-col gap-s3">

            <div className="flex justify-between">
                <Button variant="outline" onClick={() => step === 2 ? setStep(1) : navigate("/")}>
                    <ArrowLeft />
                </Button>
            </div>

            <h1 className="text-h1 font-bold">
                {step === 1 ? `Create ${role === "artisan" ? "Artisan" : "Client"} Account` : "Enter OTP"}
            </h1>
            
            {step === 1 ? (
                <form onSubmit={handleSubmit(onPhoneSubmit)} className="flex flex-col gap-s3">
                    <Input 
                        type="tel" 
                        placeholder="+2348000000000" 
                        {...register("phoneNumber", { required: "Phone number is required" })} 
                        label="Phone Number" 
                        error={errors.phoneNumber?.message as string} 
                    />
                    <Button type="submit" isLoading={isLoading} loadingText="Sending OTP...">Get OTP</Button>
                </form>
            ) : (
                <form onSubmit={handleSubmit(onOtpSubmit)} className="flex flex-col gap-s3">
                    <p className="text-sm text-text-muted">Enter the 6-digit code sent to {phoneNumber}</p>
                    <Input 
                        type="text" 
                        placeholder="123456" 
                        maxLength={6}
                        {...register("otp", { required: "OTP is required", minLength: { value: 6, message: "Must be 6 digits" } })} 
                        label="One-Time Password" 
                        error={errors.otp?.message as string} 
                    />
                    <Button type="submit" isLoading={isLoading} loadingText="Creating Account...">Verify & Create Account</Button>
                </form>
            )}
            
            <p className="text-text-muted text-center">
                By signing up with phone you agree to our
                <a href="#" className="text-primary underline ml-1">Terms of Use</a> and <a href="#" className="text-primary underline ml-1">Policies</a>
            </p>
            <p className="text-center mt-auto">Already have an account? <Link to="/login" className="text-primary underline">Login</Link></p>
        </section>
    )
}

export default SignUp