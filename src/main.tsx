import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Spinner } from "@/components/ui/spinner.tsx";
import ThemeProvider from "@/components/theme-provider.tsx";

const App = lazy(() => import("./App.tsx"));
const Layout = lazy(() => import("./layout.tsx"));

ReactDOM.createRoot(document.getElementById("root")!).render(
   <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
         <Suspense fallback={ <div className="flex items-center justify-center h-screen w-screen"><Spinner size={"small"}/></div>}>
            <Layout>
               <App />
            </Layout>
         </Suspense>
      </ThemeProvider>
   </React.StrictMode>
);
