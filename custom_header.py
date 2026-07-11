import os

# 1. Update SocialAuth to be dark
social_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\src\components\auth\social-auth.tsx'
if os.path.exists(social_file):
    with open(social_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Change social buttons from white to dark
    # Old: bg-white border border-slate-200 shadow-sm text-slate-900 ... hover:bg-slate-50
    content = content.replace('bg-white border border-slate-200 shadow-sm text-slate-900 font-bold hover:bg-slate-50 hover:ring-4 hover:ring-blue-500/10 hover:border-blue-300', 
                              'bg-[#1a1a1a] border border-[#333333] shadow-sm text-white font-semibold hover:bg-[#222222] hover:border-[#444444]')
    content = content.replace('text-slate-900', 'text-white') # just in case for span text
    
    with open(social_file, 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Update Login page to use VoltOps style header
login_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\login\page.tsx'
if os.path.exists(login_file):
    with open(login_file, 'r', encoding='utf-8') as f:
        content = f.read()

    voltops_header = """                    <div className="flex flex-col items-center justify-center text-center w-full">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full border-2 border-[#00d992] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#00d992]">
                                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="text-[28px] font-bold tracking-tight text-[#00d992]">elysian</span>
                            <span className="text-[28px] font-medium text-slate-300">OS</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-8 font-medium">
                            Monitor, deploy, and scale AI agents from any framework
                        </p>
                        <h1 className="text-xl font-bold text-white mb-6">
                            Sign in to your account
                        </h1>
                    </div>"""

    # Mobile Header
    mobile_header_old = """                    <div className="text-center mb-6">
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Selamat Datang Kembali</h1>
                        <p className="text-slate-400 text-xs font-medium mt-1">Masukkan kredensial Anda untuk mengakses fitur.</p>
                    </div>"""
    content = content.replace(mobile_header_old, voltops_header)
    
    # Remove the absolute logo on mobile
    absolute_logo = """            {/* Brand Logo - Fixed Top */}
            <div className="absolute top-8 left-8 z-50">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <ElysianTextLogo />
                </Link>
            </div>"""
    content = content.replace(absolute_logo, "")

    # Desktop Header
    desktop_header_old = """                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Selamat Datang Kembali
                        </h1>
                        <p className="text-slate-400 text-sm">
                            Masukkan kredensial Anda untuk mengakses ruang kerja.
                        </p>
                    </div>"""
    content = content.replace(desktop_header_old, voltops_header)

    # Remove the desktop logo
    desktop_logo_old = """                {/* Brand Logo (Flex Flow - No Overlap) */}
                <div className="mb-8 w-full max-w-[380px]">
                    <Link href="/">
                        <ElysianTextLogo />
                    </Link>
                </div>"""
    content = content.replace(desktop_logo_old, "")

    with open(login_file, 'w', encoding='utf-8') as f:
        f.write(content)

# 3. Update Register page to use VoltOps style header
register_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\register\page.tsx'
if os.path.exists(register_file):
    with open(register_file, 'r', encoding='utf-8') as f:
        content = f.read()

    register_voltops_header = """                    <div className="flex flex-col items-center justify-center text-center w-full">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full border-2 border-[#00d992] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-[#00d992]">
                                    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="text-[28px] font-bold tracking-tight text-[#00d992]">elysian</span>
                            <span className="text-[28px] font-medium text-slate-300">OS</span>
                        </div>
                        <p className="text-sm text-slate-400 mb-8 font-medium">
                            Create an account to start building your AI workforce
                        </p>
                        <h1 className="text-xl font-bold text-white mb-6">
                            Create your account
                        </h1>
                    </div>"""

    # Mobile Header
    mobile_header_old_reg = """                    <div className="flex flex-col items-center gap-3 mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="p-0">
                            <ElysianTextLogo className="scale-110" />
                        </div>
                        <div className="text-center mt-2">
                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Create Account</h1>
                            <p className="text-slate-400 text-xs font-medium">Join Elysian today</p>
                        </div>
                    </div>"""
    content = content.replace(mobile_header_old_reg, register_voltops_header)

    # Desktop Header
    desktop_header_old_reg = """                    <div className="text-center lg:text-left space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h1>
                        <p className="text-slate-400 text-sm">Start your 14-day free trial with Elysian.</p>
                    </div>"""
    content = content.replace(desktop_header_old_reg, register_voltops_header)
    
    desktop_logo_old_reg = """                {/* Brand Logo */}
                <div className="mb-8 w-full max-w-[420px] mx-auto">
                    <Link href="/">
                        <ElysianTextLogo />
                    </Link>
                </div>"""
    content = content.replace(desktop_logo_old_reg, "")

    with open(register_file, 'w', encoding='utf-8') as f:
        f.write(content)

print("VoltOps header applied!")
