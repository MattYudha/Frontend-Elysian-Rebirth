import os
import re

# Fix slider colors
slider_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\src\components\auth\login-slider.tsx'
if os.path.exists(slider_file):
    with open(slider_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Change green to blue
    content = content.replace('bg-[#00d992]', 'bg-blue-500')
    content = content.replace('bg-[#00d992]/10', 'bg-blue-500/15')
    
    with open(slider_file, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix login labels and borders
login_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\login\page.tsx'
if os.path.exists(login_file):
    with open(login_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # The labels have `text-slate-600 dark:text-slate-300` or `text-slate-600 dark:text-slate-400`
    # Let's just make them all text-slate-400 without dark: to ensure they are visible
    content = re.sub(r'text-slate-600 dark:text-slate-\d+', 'text-slate-400', content)
    content = content.replace('text-slate-600', 'text-slate-400')
    
    # Also "ATAU MASUK MANUAL" which was text-slate-400 uppercase tracking-wider
    # Let's ensure it's text-slate-400
    
    # Borders on inputs: dark:border-white/20 is a bit bright. Let's make it border-white/10
    content = content.replace('dark:border-white/20', 'dark:border-white/10')
    content = content.replace('border-white/20', 'border-white/10')
    
    # Focus rings: focus:ring-white/10 -> focus:ring-blue-500/20 to give it that Elysian feel on focus
    content = content.replace('focus:ring-white/10', 'focus:ring-blue-500/20')
    
    with open(login_file, 'w', encoding='utf-8') as f:
        f.write(content)

# Fix register labels and borders
register_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\register\page.tsx'
if os.path.exists(register_file):
    with open(register_file, 'r', encoding='utf-8') as f:
        content = f.read()

    content = re.sub(r'text-slate-600 dark:text-slate-\d+', 'text-slate-400', content)
    content = content.replace('text-slate-600', 'text-slate-400')
    content = content.replace('text-slate-500', 'text-slate-400')
    
    content = content.replace('dark:border-white/20', 'dark:border-white/10')
    content = content.replace('border-white/20', 'border-white/10')
    content = content.replace('focus:ring-white/10', 'focus:ring-blue-500/20')
    
    with open(register_file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Fixed colors!")
