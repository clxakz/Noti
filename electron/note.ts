import { PathLike } from "node:fs";
import path from "node:path";
import { promises as fs } from 'fs';
import { app } from 'electron'

export const savePath: PathLike = path.join(app.getPath("userData"), "notes.json");

export class Note {
    name: string;
    value?: string;
    
    constructor(name: string, value?: string) {
      this.name = name;
      this.value = value;
    }

    save() {
      const nam = this.name;
      const value = this.value;
  
      fs.readFile(savePath, 'utf-8')
      .catch(() => "{}")
      .then(data => {
        const notes = data ? JSON.parse(data) : {};
        notes[nam] = { value };
        return fs.writeFile(savePath, JSON.stringify(notes, null, 2), 'utf-8');
      })
      .then(() => console.log("Note appended successfully"))
      .catch(err => console.error("Error appending note:", err));
    }

    async returnValueByName() {
      try {
        const fileContent = await fs.readFile(savePath, "utf-8");
        const jsonData = JSON.parse(fileContent);
    
        return jsonData[this.name]?.value || null;
      } catch {
        console.error("no saved notes yet");
        return '';
      }
    }

    async delete() {
      try {
        const fileContent = await fs.readFile(savePath, "utf-8");
        const jsonData = JSON.parse(fileContent);
  
        if (jsonData[this.name]) {
          delete jsonData[this.name];
          await fs.writeFile(savePath, JSON.stringify(jsonData, null, 2), "utf-8");
          console.log("file deleted")
        }
      } catch (err) {
        console.error(err);
      }
    }

    async rename(newname: string) {
       try {
          const fileContent = await fs.readFile(savePath, "utf-8");
          const jsonData = JSON.parse(fileContent);

          if (jsonData[this.name]) {
             jsonData[newname] = jsonData[this.name];
             delete jsonData[this.name];

             await fs.writeFile(
                savePath,
                JSON.stringify(jsonData, null, 2),
                "utf-8"
             );
             console.log("Note renamed successfully");
          }
       } catch (err) {
          console.error("Error renaming note:", err);
       }
    }
}