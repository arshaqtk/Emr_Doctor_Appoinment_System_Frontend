import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/auth.store';

export const RootRedirect = () => {
    const { user } = useAuthStore();

    if (user?.role === 'DOCTOR') {
        return <Navigate to="/appointments/my" replace />;
    }

    return <Navigate to="/appointments" replace />;
};
