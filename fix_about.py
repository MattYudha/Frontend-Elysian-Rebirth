import os

source_file = r'C:\Users\US3R\voltagent\website\src\components\about\index.tsx'
dest_client = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\about\about-client.tsx'
dest_page = r'C:\Users\US3R\Elysian\Frontend-Elysian-Rebirth\app\about\page.tsx'

with open(source_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix imports
content = content.replace('import { LinkedInLogo } from "../../../static/img/logos/linkedin";', 'import { Linkedin as LinkedInLogo } from "lucide-react";')
content = content.replace('import { XLogo } from "../../../static/img/logos/x";', 'import { Twitter as XLogo } from "lucide-react";')
content = content.replace('import { DotPattern } from "../ui/dot-pattern";', 'import { DotPattern } from "@/components/ui/dot-pattern";')

# Fix text/brand
content = content.replace('VoltAgent', 'Elysian')
content = content.replace('voltagent', 'elysian')

# The API URL might break if I change it to elysian.dev since it doesn't exist, let's leave the API URL as voltagent.dev
content = content.replace('love.elysian.dev', 'love.voltagent.dev')
content = content.replace('cdn.elysian.dev', 'cdn.voltagent.dev')
content = content.replace('github.com/Elysian', 'github.com/VoltAgent') # Revert Github links

# Fix colors
content = content.replace('main-emerald', 'sky-500')
content = content.replace('emerald-400', 'sky-400')
content = content.replace('emerald-600', 'sky-600')
content = content.replace('teal-400', 'sky-400')

# Rename component
content = content.replace('export function Manifesto()', 'export default function AboutClient()')

# Add 'use client'
client_content = '"use client";\n\n' + content

with open(dest_client, 'w', encoding='utf-8') as f:
    f.write(client_content)

page_content = '''import AboutClient from "./about-client";
import { LandingNavbar } from "@/components/LandingNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Elysian",
  description: "Why we built Elysian?",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#080f11d9]">
      <LandingNavbar forceDark={true} />
      <main className="flex-1 relative overflow-hidden py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
          <AboutClient />
        </div>
      </main>
    </div>
  );
}
'''

with open(dest_page, 'w', encoding='utf-8') as f:
    f.write(page_content)
print('Done!')
