import { Outlet } from "react-router";

import { Sidebar } from "../components/Sidebar";

export function AppLayout (){
    return(
        <div>
            <main>
                <Sidebar />
                <div>
                    <Outlet />
                </div>
            </main>
        </div>
    )
}