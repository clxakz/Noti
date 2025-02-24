import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NoteProvider } from "@/components/note-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <NoteProvider>
         <SidebarProvider>
         <div className="flex flex-col h-screen w-screen">
            {/* titlebar */}
            <div id="titlebar" className="h-8 min-h-8 border-b-1"/>

            <div className="flex grow relative overflow-hidden">
               <AppSidebar />
               <main className="absolute ml-12 inset-0">
                  {children}
               </main>
            </div>
         </div>
      </SidebarProvider>
      </NoteProvider>
   );
}
