import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import IndexPage from './pages/index'
import SignupPage from './pages/signup'
import LoginPage from './pages/login'
import ForBusinessPage from './pages/for-business'
import ForConsumersPage from './pages/for-consumers'
import ForTeamsPage from './pages/for-teams'
import HowItWorksPage from './pages/how-it-works'

export default function App() {
    return (
        <BrowserRouter>
            <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<IndexPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/how-it-works" element={<HowItWorksPage />} />
                        <Route path="/for-consumers" element={<ForConsumersPage />} />
                        <Route path="/for-teams" element={<ForTeamsPage />} />
                        <Route path="/for-business" element={<ForBusinessPage />} />
                        <Route path="/for-merchants" element={<ForBusinessPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>
    )
}
