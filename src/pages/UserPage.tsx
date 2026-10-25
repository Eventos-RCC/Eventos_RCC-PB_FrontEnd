import { CreateEventCard } from "@/components/custom-components/CreateEventCard";
import { EventCard } from "@/components/custom-components/EventCard";
import { UserHeaderBar } from "@/components/custom-components/UserHeaderBar";
import { AppSidebar } from "@/components/custom-components/UserSideBar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useEvents } from "@/hooks/events-hooks";
import { getFirstName } from "@/utils/manipulateNames";
import { SquarePen } from "lucide-react";
import { useState, useEffect } from "react";

export function UserPage({ children }: { children: React.ReactNode }) {

  const { events, getEvents } = useEvents();
  const [userName, setUserName] = useState<string>("");
  const [sideBarOption, setSideBarOption] = useState(0);
  const [showCreateEventCard, setShowCreateEventCard] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUserName(storedName);
    } else {
      console.warn("Nenhum nome de usuário encontrado na localStorage");
    }
  }, []);

  useEffect(() => {
    getEvents()
  }, [])

  const firstName = getFirstName(userName);

  function handleMenuClick(option: number) {
    setSideBarOption(option);
    if (option === 1) {
      setShowCreateEventCard(false);
    }
  }

  return (
    <>

      <div className="flex flex-row min-h-screen overflow-x-hidden">
        <SidebarProvider >
          <AppSidebar
            onMenuClick={handleMenuClick}
            activeOption={sideBarOption}
          />
          <SidebarTrigger className="hover:cursor-pointer" />
          <div className="flex flex-col w-full overflow-x-hidden">
            <UserHeaderBar />
            <div className="flex flex-col flex-1 p-8">
              {children}

              {sideBarOption === 0 && (
                <div className="flex flex-col items-center justify-start w-full h-full">
                  <h1
                    className="text-2xl text-center font-normal">
                    Olá {firstName}, seja bem-vindo ao site de eventos da Renovação Carismática Católica da Paraíba!
                  </h1>
                </div>
              )}

              {sideBarOption === 1 && (
                <div className="flex flex-col items-center justify-start gap-2 w-full h-full">
                  {showCreateEventCard ? (
                    <div className="flex justify-center w-full">
                      <CreateEventCard />
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-end w-full">
                        <Button
                          className="bg-green-600 w-48 hover:bg-green-700 hover:cursor-pointer
                        onclick:justify-center"
                          onClick={() => setShowCreateEventCard(true)}>
                          <SquarePen />
                          Criar evento
                        </Button>
                      </div>
                      {events.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                          {events.map((event) => (
                            <EventCard
                              key={event.id}
                              event={event}
                              onDeleted={() => getEvents()}
                              onUpdated={() => getEvents()}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex justify-center w-full text-center mt-8 text-gray-600">
                          <p>
                            No momento não há nenhum evento cadastrado.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}

// import { AskedQuestionsHandler } from "@/components/custom/AskedQuestions";
// import {
//     AssociateHandler,
//     RequestsHandler
// } from "@/components/custom/AssociateToCompany";
// import { BrowseBookings } from "@/components/custom/BrowseBookings";
// import { BrowseProducts } from "@/components/custom/BrowseProducts";
// import { NewProduct } from "@/components/custom/NewProduct";
// import { UserAccountManagement } from "@/components/custom/UserAccountManagement";
// import { BrowseNotifications } from "@/components/custom/UserNotifications";
// import { UserSidebar } from "@/components/custom/UserSidebar";
// import {
//     SidebarInset,
//     SidebarProvider,
//     SidebarTrigger
// } from "@/components/ui/sidebar";
// import { useState } from "react";

// export default function User() {

//     const [sidebarOption, setSidebarOption] = useState<number>(2);

//     function handleMenuClick(option: number) {
//         setSidebarOption(option);
//     }

//     return (
//         <SidebarProvider>
//             <UserSidebar
//                 onMenuClick={handleMenuClick}
//                 activeOption={sidebarOption}
//             />
//             <SidebarTrigger
//             className={`hover:cursor-pointer rotate-180`} 
//             />
//             <SidebarInset className="flex flex-col flex-1 overflow-x-hidden">
//                 {sidebarOption === 0 && (<UserAccountManagement />)}
//                 {sidebarOption === 1 && (<BrowseNotifications />)}
//                 {sidebarOption === 2 && (<BrowseProducts />)}
//                 {sidebarOption === 3 && (<BrowseBookings />)}
//                 {sidebarOption === 4 && (<NewProduct />)}
//                 {sidebarOption === 5 && (<AssociateHandler />)}
//                 {sidebarOption === 6 && (<AskedQuestionsHandler />)}
//                 {sidebarOption === 7 && (<RequestsHandler />)}
//             </SidebarInset>
//         </SidebarProvider>
//     )
// }

// export { User }