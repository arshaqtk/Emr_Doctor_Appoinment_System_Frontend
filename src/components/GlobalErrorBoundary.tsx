import { useRouteError, useNavigate } from 'react-router-dom';

export const GlobalErrorBoundary = () => {
    const error = useRouteError() as any;
    const navigate = useNavigate();

    console.error('Application Error:', error);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-3 rounded-full">
                        <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                    Something went wrong
                </h1>

                <p className="mt-4 text-base leading-7 text-gray-600">
                    We've encountered an unexpected error. Don't worry, your data is safe.
                </p>

                <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200 text-left overflow-hidden">
                    <p className="text-xs font-mono text-red-600 break-words">
                        {error?.message || 'Unknown runtime error'}
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                    >
                        Reload Page
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                    >
                        Go back to Login &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};
