import { HeaderBar } from "@/components/custom-components/HeaderBar";
import { AddressCard } from "@/components/custom-components/AddressCard";
import { Footer } from "@/components/custom-components/Footer";

export function AddressPage() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            <HeaderBar />
            <AddressCard />
            <Footer />
        </div>
    )
}