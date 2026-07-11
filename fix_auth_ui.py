import os

def fix_ui(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Main container
    content = content.replace('dark min-h-screen w-full bg-[#050507] text-slate-100', 'min-h-screen w-full bg-white text-slate-900')
    content = content.replace('bg-[#050507]', 'bg-white')
    
    # Dot pattern
    content = content.replace('dotColor="rgba(255, 255, 255, 0.15)"', 'dotColor="rgba(0, 0, 0, 0.05)"')
    
    # Auth card
    content = content.replace('bg-[#0d0d12]/90', 'bg-white/90')
    content = content.replace('shadow-[0_8px_32px_rgba(0,0,0,0.6)]', 'shadow-[0_8px_32px_rgba(0,0,0,0.08)]')
    content = content.replace('border-white/[0.08]', 'border-slate-200')
    content = content.replace('border border-white/[0.08]', 'border border-slate-200')
    
    # Text colors
    content = content.replace('text-white', 'text-slate-900')
    content = content.replace('text-slate-300', 'text-slate-700')
    content = content.replace('text-slate-400', 'text-slate-500')
    
    # Input
    content = content.replace('bg-black/40', 'bg-slate-50')
    content = content.replace('border-white/10', 'border-slate-200')
    content = content.replace('placeholder:text-slate-600', 'placeholder:text-slate-400')
    
    # Button (ensure the Masuk button stays blue)
    # The button uses text-white, but we replaced text-white with text-slate-900 globally above! Let's fix that.
    content = content.replace('bg-blue-600 hover:bg-blue-500 text-slate-900', 'bg-blue-600 hover:bg-blue-500 text-white')
    
    # Links
    content = content.replace('hover:text-slate-300', 'hover:text-slate-700')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_path = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)'
fix_ui(os.path.join(base_path, 'login', 'page.tsx'))
fix_ui(os.path.join(base_path, 'register', 'page.tsx'))
fix_ui(os.path.join(r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\src\components\auth', 'social-auth.tsx'))

print("Auth UI updated to light mode!")
