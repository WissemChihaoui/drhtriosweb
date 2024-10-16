import { useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { Button } from "primereact/button";
import ApplicationLogo from "@/Components/ApplicationLogo";
export default function Welcome(props) {
    const [value, setValue] = useState(2);
    return (
        <>
            <Head title="Welcome" />
            <div className="relative sm:flex sm:justify-center sm:items-center min-h-screen bg-dots-darker bg-center bg-gray-100 dark:bg-dots-lighter dark:bg-gray-900 selection:bg-red-500 selection:text-white">
                <div className="max-w-7xl mx-auto p-6 lg:p-8">
                    <div className="flex justify-center">
                        <ApplicationLogo />
                    </div>
                    <h3 className="font-bold text-6xl text-gray-800 dark:text-white">
                        Bienvenue à DRH
                    </h3>
                    <div className="flex w-full gap-6 justify-center mt-4">
                        {props.auth.user ? (
                            <Link href={route("dashboard")}>
                                <Button>Tableau de bord</Button>
                            </Link>
                        ) : (
                            <>
                                <Link href={route("login")}>
                                    <Button>S'inscrire</Button>
                                </Link>

                                <Link href={route("register")}>
                                    {" "}
                                    <Button> S'enregistrer</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .bg-dots-darker {
                    background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(0,0,0,0.07)'/%3E%3C/svg%3E");
                }
                @media (prefers-color-scheme: dark) {
                    .dark\\:bg-dots-lighter {
                        background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.22676 0C1.91374 0 2.45351 0.539773 2.45351 1.22676C2.45351 1.91374 1.91374 2.45351 1.22676 2.45351C0.539773 2.45351 0 1.91374 0 1.22676C0 0.539773 0.539773 0 1.22676 0Z' fill='rgba(255,255,255,0.07)'/%3E%3C/svg%3E");
                    }
                }
            `}</style>
        </>
    );
}
