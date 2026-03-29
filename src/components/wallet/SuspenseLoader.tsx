import { Wallet } from 'lucide-react';
import nProgress from 'nprogress';
import { useEffect } from 'react';

function SuspenseLoader() {

    useEffect(() => {
        nProgress.start();

        return () => {
            nProgress.done();
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
            <div className="h-14 w-14 rounded-xl wallet-gradient flex items-center justify-center animate-pulse">
                <Wallet className="h-7 w-7 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground animate-pulse">Loading…</p>
        </div>
    );
}

export default SuspenseLoader