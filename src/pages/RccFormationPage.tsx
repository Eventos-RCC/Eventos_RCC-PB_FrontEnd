import { HeaderBar } from "@/components/custom-components/HeaderBar";
import { RccFormationCard } from "@/components/custom-components/RccFormationCard";
import { Footer } from "@/components/custom-components/Footer";

export function RccFormationPage() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            <HeaderBar />
            <RccFormationCard />
            <Footer />
        </div>
    )
}