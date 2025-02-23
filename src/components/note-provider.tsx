import { createContext, ReactNode, useContext, useState } from "react";

type noteContextType = {
    activeTab: string;
    changeActiveTab: (name: string) => void;
    editorText: string;
    changeEditorText: (value: string) => void;
    canCloseSidebar: boolean;
    changeCanCloseSidebar: (value: boolean) => void;
    isSettingsOpen: boolean;
    toggleSettings: () => void;
}

const NoteContext = createContext<noteContextType | undefined>(undefined);

export function NoteProvider({ children }: {children: ReactNode}) {
    const [activeTab, setActiveTab] = useState<string>('');
    const [editorText, setEditorText] = useState<string>('');
    const [canCloseSidebar, setCanCloseSidebar] = useState<boolean>(true)
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)
    
    const changeActiveTab = (name: string) => setActiveTab(name);
    const changeEditorText = (value: string) => setEditorText(value);
    const changeCanCloseSidebar = (value: boolean) => setCanCloseSidebar(value);
    const toggleSettings = () => setIsSettingsOpen((prev) => !prev);

    return (
        <NoteContext.Provider value={{activeTab, changeActiveTab, editorText, changeEditorText, canCloseSidebar, changeCanCloseSidebar, isSettingsOpen, toggleSettings}}>
            {children}
        </NoteContext.Provider>
    )
}


export function useNotes() {
    const context = useContext(NoteContext);
    if (!context) throw new Error("useNotes must be used within a NoteProvider");
    return context;
  }