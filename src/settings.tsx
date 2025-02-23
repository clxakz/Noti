import { ReactNode } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useNotes } from "@/components/note-provider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/theme-provider";

export default function Settings({ children }: {children: ReactNode}) {
    const { toggleSettings, isSettingsOpen } = useNotes();
    const { setTheme, theme } = useTheme()

    function toggleTheme() {
        setTheme(theme === "light" ? "dark" : "light")
        console.log("theme")
    }

    return (
        <Dialog open={isSettingsOpen} onOpenChange={toggleSettings}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription>Appearance</DialogDescription>

                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="theme">Dark Mode</Label>
                    <Switch defaultChecked={theme==="dark"} name="theme" onClick={toggleTheme}></Switch>
                </div>
            </DialogContent>
        </Dialog>
    )
}