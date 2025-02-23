import {
   Sidebar,
   SidebarContent,
   SidebarFooter,
   SidebarGroup,
   SidebarGroupAction,
   SidebarGroupLabel,
   SidebarHeader,
   SidebarMenu,
   SidebarMenuAction,
   SidebarMenuButton,
   SidebarMenuItem,
   useSidebar,
} from "@/components/ui/sidebar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Dialog,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog"
import { Cog, MoreHorizontal, Paperclip, Pencil, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNotes } from "@/components/note-provider";
import Settings from "@/settings";


interface Tab {
   name: string
}

export function AppSidebar() {
   const { setOpen } = useSidebar();
   const { activeTab, changeActiveTab, changeEditorText, changeCanCloseSidebar, editorText } = useNotes();
   const [newNoteName, setNewNoteName] = useState<string>('');
   const [newNoteDialogOpen, setNewNoteDialogOpen] = useState<boolean>(false);
   const [isRenaming, setIsRenaming] = useState<string>('')
   const renamingInputRef = useRef<HTMLInputElement>(null);
   const [ tabs, setTabs] = useState<Tab[]>([])


   // Load all note tabs on startup
   useEffect(() => {
      window.api.onLoadAllNoteNames((tab: string[]) => {
         tab.forEach((newTab) => {
            setTabs((prev) => {
              if (!prev.some((existingTab) => existingTab.name === newTab)) {
                return [...prev, { name: newTab }];
              }
              return prev;
            });
          });
      });
    }, []);


    // Handle Switching tabs and save current tab before switching
    function switchTab(tabname: string) {
      if (tabs.length > 0 && editorText != '') {
         window.api.saveNote(activeTab, editorText);
      }

      changeEditorText('');
      changeActiveTab(tabname);
      console.log("RENAMING")
    }


   // Handle renaming
   const handleKeyDownOnRename = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
         if (renamingInputRef.current) {
            window.api.renameNote(isRenaming, renamingInputRef.current?.value);
            setTabs((prevTabs) =>
               prevTabs.map((tab) =>
                 tab.name === isRenaming ? { ...tab, name: renamingInputRef.current?.value ?? '' } : tab
               )
             );
             changeActiveTab(renamingInputRef.current?.value);
             setIsRenaming('');
         }
      } else if (event.key === "Escape") {
         if (renamingInputRef.current) {
            setIsRenaming('');
         }
      }
   };
   
   useEffect(() => {
      renamingInputRef.current?.focus();
   }, [renamingInputRef.current])


   // Deny closing the sidebar when renaming
   useEffect(() => {
      if (isRenaming != '') {
         changeCanCloseSidebar(false);
      } else {
         changeCanCloseSidebar(true);
      }

   }, [isRenaming])

   // Handle deleting notes and corresponding tab
   function handleNoteDelete(tab: string) {
      window.api.deleteNote(tab);
      changeEditorText('');
      setTabs((prev) => prev.filter((_tab) => _tab.name !== tab));
   }


   // Set the editor text corresponding to the active tab
   useEffect(() => {
      async function handle() {
         const result = await window.api.loadNoteValue(activeTab);
         if (result != null) {
            changeEditorText(result);
         }
      }

      handle();
   }, [activeTab]) 


   function toggleNewNoteDialog() {
      setNewNoteDialogOpen((prev) => !prev);
   }

   // Handle keyboard shortcuts
   useEffect(() => {
      function handleKeyPress(event: any) {
         if (event.ctrlKey && event.key === "n" && !newNoteDialogOpen) {
            toggleNewNoteDialog();
         }
      }

      document.addEventListener("keydown", handleKeyPress);
      return () => {
         document.removeEventListener("keydown", handleKeyPress);
      };
   }, []);
    

   // Handle creating a new note when a create button is pressed
   async function createNote() {
      if (newNoteName != '') {
         const result = await window.api.createNote(newNoteName);
         
         if (!tabs.some(tab => tab.name === result)) {
            setTabs([...tabs, {name: result}])
            switchTab(result);
         }
      }
      toggleNewNoteDialog();
   }


   // Reset input field when dialog is closed
   useEffect(() => {
      if (!newNoteDialogOpen && newNoteName != '') {
         setNewNoteName('');
      }
   }, [newNoteDialogOpen])

   return (
      <Sidebar
         collapsible="icon"
         onMouseEnter={() => setOpen(true)}
         className="bg-background mt-8 overflow-hidden pb-8">
         <SidebarHeader className="m-0 p-0">
            <SidebarGroup>
               <SidebarGroupLabel>Your Notes</SidebarGroupLabel>
               <Dialog
                  open={newNoteDialogOpen}
                  onOpenChange={setNewNoteDialogOpen}>
                  <DialogTrigger asChild>
                     <SidebarGroupAction
                        title="Add a new note"
                        onClick={toggleNewNoteDialog}>
                        <Plus />
                     </SidebarGroupAction>
                  </DialogTrigger>

                  <DialogContent>
                     <DialogHeader>
                        <DialogTitle>New Note</DialogTitle>
                     </DialogHeader>

                     <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                           onKeyDown={(e) => {
                              if (e.key === "Enter") createNote();
                           }}
                           id="name"
                           value={newNoteName}
                           onChange={(e) =>
                              setNewNoteName(e.currentTarget.value)
                           }
                        />
                     </div>

                     <DialogFooter>
                        <Button onClick={createNote}>Create</Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            </SidebarGroup>
         </SidebarHeader>

         <SidebarContent>
            <SidebarGroup>
               <SidebarMenu>
                  {tabs.map((tab: Tab, index: number) => (
                     <SidebarMenuItem key={index}>
                        {isRenaming === tab.name ? (
                           <Input onKeyDown={handleKeyDownOnRename} ref={renamingInputRef} placeholder={tab.name}></Input>
                        ) : (
                           <>
                              <SidebarMenuButton onClick={() => switchTab(tab.name)} isActive={tab.name === activeTab}>
                                 <Paperclip />
                                 <span>{tab.name}</span>
                              </SidebarMenuButton>

                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <SidebarMenuAction>
                                       <MoreHorizontal />
                                    </SidebarMenuAction>
                                 </DropdownMenuTrigger>

                                 <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => setIsRenaming(tab.name)}>
                                       <Pencil />
                                       <span>Rename</span>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem onClick={() => { handleNoteDelete(tab.name) }}>
                                       <Trash2 />
                                       <span>Delete</span>
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </>
                        )}

                     </SidebarMenuItem>
                  ))}
               </SidebarMenu>
            </SidebarGroup>
         </SidebarContent>

         <SidebarFooter>
            <SidebarMenu>
               <SidebarMenuItem>
                  <Settings>
                     <SidebarMenuButton>
                        <Cog />
                        <span>Settings</span>
                     </SidebarMenuButton>
                  </Settings>
               </SidebarMenuItem>
            </SidebarMenu>
         </SidebarFooter>
      </Sidebar>
   );
}
