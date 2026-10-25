import { HeaderBar } from "@/components/custom-components/HeaderBar";
import { 
    GroupAndMinisteriosCard 
} from "@/components/custom-components/GroupAndMinisteriosCard";
import { Footer } from "@/components/custom-components/Footer";

export function GroupAndMinisteriosPage() {
    return (
        <div className="flex flex-col min-h-screen overflow-x-hidden">
            <HeaderBar />
            <GroupAndMinisteriosCard />
            <Footer />
        </div>
    )
}