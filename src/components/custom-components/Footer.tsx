import { Separator } from "@/components/ui/separator";

export function Footer() {

    const thisYear: number = new Date().getFullYear();

    return (
        <div className="bg-green-600 flex flex-col justify-center items-center h-auto px-10 py-16 gap-6 overflow-hidden">
            <div className="flex justify-center items-center gap-4 max-[275px]:flex-col">
                <img
                    src="/assets/rccpb-04.png" 
                    alt="logo-ciencia-da-computacao"
                    className="h-36 w-64 shrink-0 filter brightness-0 invert"
                />
                <img
                    src="/assets/cc-logo-white.png" 
                    alt="logo-ciencia-da-computacao"
                    className="h-32 w-40 shrink-0"
                />
            </div>
            <Separator/>
            <p className="text-white">&copy; {thisYear} RCC - PB.</p>
        </div>
    )
}