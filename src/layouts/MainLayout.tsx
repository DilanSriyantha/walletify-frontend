import { BottomNav } from "@/components/wallet/BottomNav";
import { DesktopSidebar } from "@/components/wallet/DesktopSidebar";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {

    return (
        <div className="flex min-h-screen w-full">
            <DesktopSidebar />
            <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-3xl mx-auto w-full">
                <Outlet />
                <BottomNav />
            </main>
        </div>
    );
}

export default MainLayout;