import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
    onNeedRefresh() {
        console.log('New content is available, please refresh.');
        alert('New content is available, please refresh.');
        updateSW(true);
    },
    onOfflineReady() {},
});

const router = createBrowserRouter(createRoutesFromElements(<Route path="*" element={<App />} />), {
    basename: import.meta.env.BASE_URL,
});

ReactDOM.createRoot(document.getElementById('root')!).render(
    // <React.StrictMode>
    <RouterProvider router={router} />,
    // </React.StrictMode>
);
