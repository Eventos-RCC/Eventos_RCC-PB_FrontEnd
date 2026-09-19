import { HeaderBar } from "@/components/custom-components/HeaderBar";

export function LandingPage() {
    return (
        <>
            <HeaderBar />
            <div
                className={`flex relative h-[600px] w-full items-center justify-center bg-[url('/assets/rcc-landing-img.png')] from-transparent to-white bg-cover bg-center bg-no-repeat`}
            >
                <div className="flex flex-col absolute items-center justify-center">
                    <img
                        src="/assets/rccpb-04.png"
                        alt="logo-register-rccpb"
                        className="w-1/5 h-auto object-cover filter brightness-0 invert"
                        draggable="false"
                    />
                    <h1 className="text-white text-4xl font-bold text-center">
                        Encontre e participe de eventos da Renovação<br />Carismática Católica da Paraíba
                    </h1>
                </div>
            </div>
        </>
    )
}