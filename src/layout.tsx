import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { NoteProvider } from "@/components/note-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <NoteProvider>
         <SidebarProvider>
            <AppSidebar />
            {children}
         </SidebarProvider>
      </NoteProvider>
   );
}
