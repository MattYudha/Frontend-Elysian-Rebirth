import os

# 1. Update layout.tsx
layout_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\layout.tsx'
if os.path.exists(layout_file):
    with open(layout_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Change green glow to blue glow
    content = content.replace('bg-[#00d992]/10', 'bg-blue-600/15')
    
    # Add border to right panel
    # Right panel starts with: className="hidden lg:flex lg:w-[60%] h-full relative bg-[#111111] items-center justify-center text-white overflow-hidden"
    right_panel_class = 'className="hidden lg:flex lg:w-[60%] h-full relative bg-[#111111] items-center justify-center text-white overflow-hidden"'
    right_panel_class_with_border = 'className="hidden lg:flex lg:w-[60%] h-full relative bg-[#111111] items-center justify-center text-white overflow-hidden border-l border-white/5"'
    
    content = content.replace(right_panel_class, right_panel_class_with_border)
    
    with open(layout_file, 'w', encoding='utf-8') as f:
        f.write(content)

# 2. Update login/page.tsx just in case there are green glows left
login_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\login\page.tsx'
if os.path.exists(login_file):
    with open(login_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('bg-[#00d992]/10', 'bg-blue-600/15')
    
    with open(login_file, 'w', encoding='utf-8') as f:
        f.write(content)

# 3. Update register/page.tsx just in case
register_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\register\page.tsx'
if os.path.exists(register_file):
    with open(register_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    content = content.replace('bg-[#00d992]/10', 'bg-blue-600/15')
    
    with open(register_file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Pembatas ditambahkan dan warna glow diubah ke biru!")
