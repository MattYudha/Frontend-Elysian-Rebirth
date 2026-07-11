import os

login_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\login\page.tsx'

if os.path.exists(login_file):
    with open(login_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change card wrapper background if any (mobile and desktop)
    # The desktop doesn't have a card wrapper, it's just a div.
    # The mobile has a card wrapper:
    content = content.replace('bg-white/90 dark:bg-slate-900/90', 'bg-transparent dark:bg-transparent')
    content = content.replace('border border-slate-200/60 dark:border-slate-800/60', 'border-none')
    content = content.replace('shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]', 'shadow-none')
    
    # Change Inputs (mobile and desktop)
    # Desktop input: bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700
    # Make them sleek dark: bg-white/5 dark:bg-white/5 border-white/10
    content = content.replace('bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800', 
                              'bg-transparent dark:bg-transparent border-slate-300 dark:border-white/20 focus:bg-white/5 dark:focus:bg-white/5')
    
    # Another input variant if it exists:
    content = content.replace('bg-white/50 dark:bg-slate-900/50', 'bg-transparent dark:bg-transparent')
    
    # Label and Text Colors: make sure they are crisp
    content = content.replace('text-slate-600 dark:text-slate-400', 'text-slate-600 dark:text-slate-300')
    content = content.replace('text-slate-900 dark:text-white', 'text-slate-900 dark:text-white')
    
    # Make sure we don't have blue rings on the inputs if we want it professional
    content = content.replace('focus:ring-blue-500/10', 'focus:ring-white/10')
    
    # Button: Make sure it's Elysian Blue
    # The button is already blue: bg-blue-600 hover:bg-blue-700
    # But let's make it look sharper
    content = content.replace('shadow-lg shadow-blue-500/25', 'shadow-none')

    with open(login_file, 'w', encoding='utf-8') as f:
        f.write(content)

# Do the same for register
register_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\register\page.tsx'
if os.path.exists(register_file):
    with open(register_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change Inputs
    content = content.replace('bg-white/50 border-slate-200 focus:bg-white', 'bg-transparent dark:bg-transparent border-slate-200 dark:border-white/20 focus:bg-white/5 dark:focus:bg-white/5')
    content = content.replace('bg-slate-50 border-slate-200', 'bg-transparent dark:bg-transparent border-slate-200 dark:border-white/20')
    content = content.replace('focus:ring-blue-500/10', 'focus:ring-white/10')

    with open(register_file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Inputs and layouts made sleeker and less blue!")
