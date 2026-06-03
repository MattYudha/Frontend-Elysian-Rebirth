import Link from "next/link";
import { BoltIcon } from "@heroicons/react/24/solid";
import { GitHubLogo } from "@/components/elysian/logos/github";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="text-[#dcdcdc] font-['Inter'] py-12 md:py-16 border-solid border-b-0 border-l-0 border-r-0 border-t border-white/10 bg-[#050507]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col items-start col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center border-solid border-1 border-sky-400 rounded-full p-1">
                <BoltIcon className="w-4 h-4 text-sky-400" />
              </div>
              <span className="text-2xl font-bold text-sky-400 tracking-tight">Elysian Rebirth</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-solid border-sky-400/30 text-sky-400 bg-sky-400/5 font-mono">v3.0</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
              {t.landing.footer.description}
            </p>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <a
                href="https://github.com/MattYudha/Backend-Elysian-"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-sky-400 transition-colors flex items-center gap-1.5 no-underline"
              >
                <GitHubLogo className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>

          {/* Column 2: Core Technologies */}
          <div className="flex flex-col items-start">
            <div className="text-sm font-semibold uppercase tracking-wider text-[#eeeeee] mb-4">
              {t.landing.footer.solutions.title}
            </div>
            <ul className="space-y-2 list-none pl-0 text-sm">
              <li className="text-gray-400 hover:text-sky-400 transition-colors cursor-default">
                {t.landing.footer.solutions.items.docs}
              </li>
              <li className="text-gray-400 hover:text-sky-400 transition-colors cursor-default">
                {t.landing.footer.solutions.items.security}
              </li>
              <li className="text-gray-400 hover:text-sky-400 transition-colors cursor-default">
                {t.landing.footer.solutions.items.scale}
              </li>
              <li className="text-gray-400 hover:text-sky-400 transition-colors cursor-default">
                {t.landing.footer.solutions.items.custom}
              </li>
            </ul>
          </div>

          {/* Column 3: Exploration */}
          <div className="flex flex-col items-start">
            <div className="text-sm font-semibold uppercase tracking-wider text-[#eeeeee] mb-4">
              {t.landing.footer.support.title}
            </div>
            <ul className="space-y-2 list-none pl-0 text-sm">
              <li>
                <FooterLink href="/docs/">{t.landing.footer.support.items.help}</FooterLink>
              </li>
              <li>
                <FooterLink href="https://sepolia.etherscan.io/">{t.landing.footer.support.items.api}</FooterLink>
              </li>
              <li>
                <FooterLink href="https://sepolia.etherscan.io/">{t.landing.footer.support.items.status}</FooterLink>
              </li>
              <li>
                <FooterLink href="https://github.com/MattYudha/Backend-Elysian-">{t.landing.footer.support.items.community}</FooterLink>
              </li>
              <li>
                <FooterLink href="/about/">{t.landing.footer.support.items.sales}</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-solid border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>
            {t.landing.footer.legal.copyright} &middot; {t.landing.footer.contact.address}
          </div>
          <div className="flex gap-4">
            <FooterLink href="/privacy">{t.landing.footer.legal.privacy}</FooterLink>
            <FooterLink href="/terms">{t.landing.footer.legal.terms}</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const FooterLink = ({ href, children, ...props }: FooterLinkProps) => (
  <Link
    href={href}
    className="text-gray-400 hover:text-sky-400 text-sm transition-colors duration-200 no-underline"
    {...props}
  >
    {children}
  </Link>
);
