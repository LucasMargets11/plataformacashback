import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import IndexPage from './pages/index'
import SignupPage from './pages/signup'
import LoginPage from './pages/login'
import ForBusinessPage from './pages/for-business'
import ForConsumersPage from './pages/for-consumers'
import ForTeamsPage from './pages/for-teams'
import HowItWorksPage from './pages/how-it-works'
import AppLayout from './layouts/AppLayout'
import ProfilePage from './pages/profile/ProfilePage'
import StoresPage from './pages/stores/StoresPage'
import HomePage from './pages/home/HomePage'
import CauseDetailPage from './pages/causes/CauseDetailPage'
import PublicLayout from './layouts/PublicLayout'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
    return (
        <BrowserRouter>
            {/* Ensure each navigation starts at top */}
            <ScrollToTop />
            <Routes>
                {/* Public area with public header/footer */}
                <Route element={<PublicLayout />}>
                    <Route index element={<IndexPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/for-consumers" element={<ForConsumersPage />} />
                    <Route path="/for-teams" element={<ForTeamsPage />} />
                    <Route path="/for-business" element={<ForBusinessPage />} />
                    <Route path="/for-merchants" element={<ForBusinessPage />} />
                </Route>

                {/* Private app with private header */}
                <Route path="/app" element={<AppLayout />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<HomePage />} />
                    <Route path="dashboard" element={<ProfilePage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="stores" element={<StoresPage />} />
                    <Route path="causes/:slug" element={<CauseDetailPage />} />
                    {/* Placeholders for future */}
                    <Route path="causes" element={<div className="p-6">My Causes (próximamente)</div>} />
                    <Route path="settings" element={<div className="p-6">Settings (próximamente)</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
