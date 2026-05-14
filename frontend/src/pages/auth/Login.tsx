import Input from "@lib/components/common/Input"
import Button from "@lib/components/common/Button"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import useAuthStore from "@lib/hooks/useAuthStore"

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { role, loginAsArtisan, loginAsClient } = useAuthStore()
    const onSubmit = (data: any) => {
        setIsLoading(true)
        setTimeout(() => {
            console.log(data)
            role === "artisan" ? loginAsArtisan({ password: data.password, email: data.email }) : loginAsClient({ password: data.password, email: data.email })
            setIsLoading(false)
            if (role === "artisan") navigate("/artisan")
            else navigate("/client")
        }, 2000)
    }
    return (
        <section className="min-h-screen px-s4 py-s5 flex flex-col gap-s3">

            <div className="flex justify-between">
                <Button variant="outline" onClick={() => navigate("/")}>
                    <ArrowLeft />
                </Button>
            </div>

            <h1 className="text-h1 font-bold">
                Welcome Back {role === "artisan" ? "Artisan" : "Client"}
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-s3">
                <Input type="text" placeholder="Email" {...register("email")} label="Email" required error={errors.email?.message as string} />
                <Input type="password" placeholder="Password" {...register("password")} label="Password" required error={errors.password?.message as string} />
                <Button type="submit" isLoading={isLoading} loadingText="Logging in...">Login</Button>
            </form>
            <p className="text-text-muted text-center">
                By signing up with email or social you agree to our
                <a href="#" className="text-primary underline">Terms of Use</a> and <a href="#" className="text-primary underline">Policies</a>
            </p>
            <p className="text-center mt-auto">Don't have an account? <Link to="/signup" className="text-primary underline">Sign Up</Link></p>
        </section>
    )
}

export default Login