import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {

    return (
        <div className="flex min-h-screen w-full">
            <main className="flex-1 px-4 py-6 md:px-8 md:py-8 max-w-3xl mx-auto w-full">
                <Outlet />
            </main>
        </div>
    );
}

export default AuthLayout;