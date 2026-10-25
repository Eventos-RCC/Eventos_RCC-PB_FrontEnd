import { Footer } from "@/components/custom-components/Footer";
import { HeaderBar } from "@/components/custom-components/HeaderBar";
import { RegisterCard } from "@/components/custom-components/RegisterCard";

export function RegisterPage() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            <HeaderBar />
            <RegisterCard />
            <Footer />
        </div>
    )
}