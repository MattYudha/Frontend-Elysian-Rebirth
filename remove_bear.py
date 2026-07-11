import os

login_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\login\page.tsx'

if os.path.exists(login_file):
    with open(login_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove import
    content = content.replace("import RiveLoginAvatar from '@/components/ui/rive-login-avatar';", "")

    # Remove RiveLoginAvatar block (mobile)
    block1 = """                    {/* Rive Avatar - Adjusted size for Mobile */}
                    <div className="w-[260px] h-[260px] pointer-events-none -mb-10 drop-shadow-xl z-20 flex justify-center items-center">
                        <RiveLoginAvatar
                            emailValue={emailValue || ""}
                            isEmailFocused={isEmailFocused}
                            isPasswordFocused={isPasswordFocused}
                            submitStatus={submitStatus}
                        />
                    </div>"""
    content = content.replace(block1, "")
    
    block1_alt = """                {/* Rive Avatar */}
                <div className="w-[240px] h-[240px] pointer-events-none mb-[-2.5rem] z-20 flex justify-center items-center relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500/5 blur-[30px]" />
                    <RiveLoginAvatar
                        emailValue={emailValue || ""}
                        isEmailFocused={isEmailFocused}
                        isPasswordFocused={isPasswordFocused}
                        submitStatus={submitStatus}
                    />
                </div>"""
    content = content.replace(block1_alt, "")

    # Remove RiveLoginAvatar block (desktop)
    block2 = """                    <div className="h-[260px] w-full flex items-end justify-center pb-0 pointer-events-none">
                        <RiveLoginAvatar
                            emailValue={emailValue || ""}
                            isEmailFocused={isEmailFocused}
                            isPasswordFocused={isPasswordFocused}
                            submitStatus={submitStatus}
                        />
                    </div>"""
    content = content.replace(block2, "")
    
    # Let's also force dark mode on the whole layout
    # Layout file is:
    layout_file = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\(auth)\layout.tsx'
    if os.path.exists(layout_file):
        with open(layout_file, 'r', encoding='utf-8') as lf:
            layout_content = lf.read()
        
        # force dark class on the main wrapper
        layout_content = layout_content.replace('className="min-h-screen', 'className="dark min-h-screen')
        
        with open(layout_file, 'w', encoding='utf-8') as lf:
            lf.write(layout_content)

    with open(login_file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Bear removed and layout forced to dark mode!")
