import SuspenseLoader from "@/components/wallet/SuspenseLoader";
import { Suspense } from "react";

const RouteLoader = (Component: React.ElementType) => (props: any) => (
    <Suspense fallback={<SuspenseLoader />}>
        <Component {...props} />
    </Suspense>
);

export default RouteLoader;