import { Footer } from "@/components/custom-components/Footer";
import { HeaderBar } from "@/components/custom-components/HeaderBar";
import { LoginCard } from "@/components/custom-components/LoginCard";

export function LoginPage() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            <HeaderBar />
            <LoginCard />
            <Footer />
        </div>
    )
}