import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="text-4xl flex flex-col items-center justify-center h-screen overflow-x-hidden">
            <h1>{(error as any).status}</h1>
            <span>{(error as any).statusText}</span>
            <span>{(error as any).message}</span>
            <span>{(error as any).data}</span>
        </div>
    );
}