import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NoteProvider } from "@/components/note-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <NoteProvider>
         <SidebarProvider>
            <div className="flex flex-col h-screen">
               {/* Titlebar */}
               <div id="titlebar" className="h-8 w-screen border-b-1"/>

               <div className="relative flex grow">
                  <AppSidebar/>

                  {/* Main Content */}
                  <main className="absolute ml-12 inset-0">
                     {children}
                  </main>
               </div>
            </div>
         </SidebarProvider>
      </NoteProvider>
   );
}
