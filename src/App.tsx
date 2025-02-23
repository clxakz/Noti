import { useSidebar } from "@/components/ui/sidebar";
import { useNotes } from "@/components/note-provider";
import { useEffect } from "react";

function App() {
   const { setOpen } = useSidebar();
   const { activeTab, editorText, changeEditorText, canCloseSidebar, toggleSettings } = useNotes();

   // Handle keyboard shortcuts
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.ctrlKey && event.key === ",") {
            event.preventDefault();
            toggleSettings();
         }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, []);

   // Handle saving
   useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
         if ((event.ctrlKey) && event.key === "s" && activeTab != '') {
            event.preventDefault(); 
            window.api.saveNote(activeTab, editorText);
         }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
   }, [activeTab, editorText]);

   return (
      <main className="flex flex-col absolute inset-0 overflow-y-hidden" onMouseEnter={() => {if (canCloseSidebar) { setOpen(false) } }}>
         {/* Titlebar */}
         <div id="titlebar" className="h-8.5 w-full border-b-1 z-50"/>

         {/* Text editor area */}
         <div className="ml-13 h-full">
            <textarea value={editorText} onChange={(e) => changeEditorText(e.target.value)} wrap="off" className="h-full w-full resize-none outline-none border-none"/>
         </div>
      </main>
   );
}

export default App;
