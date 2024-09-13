
import "../css/app.css";
import "../css/tabler-icons.css";
import "../css/additional-styles/flatpickr.css";
import React from 'react';
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { PrimeReactProvider } from "primereact/api";
import { BrowserRouter as Router } from "react-router-dom";

import ThemeProvider from "./utils/ThemeContext";

const appName =
    window.document.getElementsByTagName("title")[0]?.innerText || "DRH";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <React.StrictMode>
                <div className="font-inter antialiased bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 sidebar-expanded">
                    <Router>
                        <PrimeReactProvider>
                            <ThemeProvider>
                                <App {...props} />
                            </ThemeProvider>
                        </PrimeReactProvider>
                    </Router>
                </div>
            </React.StrictMode>
        );
    },
    progress: {
        color: "#4B5563",
    },
});
