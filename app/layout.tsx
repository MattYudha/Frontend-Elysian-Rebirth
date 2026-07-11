import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '@/styles/globals.css';
import { Providers } from '@/components/Providers';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/config';
import { GhostModeIndicator } from '@/components/admin/GhostModeIndicator';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const viewport = {
    themeColor: '#000000',
};

export const metadata: Metadata = {
    metadataBase: new URL('https://elysianlabs.web.id'),
    title: {
        default: 'Elysian | AI Workflow Intelligence Platform',
        template: '%s - Elysian'
    },
    description: 'Elysian delivers AI-driven workflow intelligence for modern enterprises — centralizing automation, operational visibility, and decision control into a unified execution layer.',
    keywords: [
        "Elysian Rahmat", "Rahmat Yudi Burhanudin", "Rahmat Yudi", "Rahmat Yudi pembuat Elysian", 
        "Elysian punya Rahmat", "Elysian AI Indonesia", "Founder Elysian", "CEO Elysian", 
        "Pembuat Elysian", "Elysian punya siapa", "Apa itu Elysian", "Platform AI Elysian",
        "Elysian Labs", "AI Workflow Intelligence", "Elysian by Rahmat", "Rahmat Yudi Elysian",
        "AI Pendeteksi Markup Anggaran", "AI Swarm", "Cognitive AI Swarm", "AI Swarm Indonesia", 
        "Elysian Markup Anggaran", "Teknologi AI Anggaran", "Pendeteksi Anggaran Elysian",
        "AI Pengawas Anggaran", "Pendeteksi Markup", "Elysian AI Swarm", "AI Anti Korupsi",
        "Sistem Deteksi Markup", "Kecerdasan Buatan Indonesia",
        "AI Pendeteksi Markup Anggaran Pemerintah", "AI Untuk Keamanan Data Nasional",
        "Pencegahan Korupsi AI", "AI Pendeteksi Korupsi", "Keamanan Data Nasional", "Korupsi Anggaran"
    ],
    authors: [{ name: 'Rahmat Yudi Burhanudin', url: 'https://github.com/MattYudha' }, { name: 'Elysian' }],
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: '/',
    },
    icons: {
        icon: [
            { url: '/favicon.svg', type: 'image/svg+xml' }
        ],
        apple: '/apple-touch-icon.png',
    },
    openGraph: {
        type: 'website',
        url: 'https://elysianlabs.web.id/',
        title: 'Elysian | AI Workflow Intelligence Platform',
        description: 'Elysian delivers AI-driven workflow intelligence for modern enterprises — centralizing automation, operational visibility, and decision control into a unified execution layer.',
        siteName: 'Elysian',
        images: [
            {
                url: '/og-logo.jpg',
                width: 1200,
                height: 630,
                alt: 'Elysian Logo',
            },
        ],
        locale: 'en_US',
        alternateLocale: ['id_ID'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Elysian | AI Workflow Intelligence Platform',
        description: 'Elysian delivers AI-driven workflow intelligence for modern enterprises — centralizing automation, operational visibility, and decision control into a unified execution layer.',
        images: ['/og-logo.jpg'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="id" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://api.fontshare.com" />
                <link
                    href="https://api.fontshare.com/v2/css?f[]=clash-display@200,300,400,500,600,700&display=swap"
                    rel="stylesheet"
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@graph": [
                                {
                                    "@type": "Organization",
                                    "@id": "https://elysianlabs.web.id/#organization",
                                    "name": "Elysian",
                                    "alternateName": ["Elysian AI", "Elysian Labs", "Platform Elysian"],
                                    "disambiguatingDescription": "Elysian is an AI Workflow Intelligence software platform for modern enterprises, not a physical location.",
                                    "url": "https://elysianlabs.web.id/",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "@id": "https://elysianlabs.web.id/#logo",
                                        "url": "https://elysianlabs.web.id/icon.png",
                                        "caption": "Elysian Logo"
                                    },
                                    "image": {
                                        "@id": "https://elysianlabs.web.id/#logo"
                                    },
                                    "description": "Elysian delivers AI-driven workflow intelligence for modern enterprises — centralizing automation, operational visibility, and decision control.",
                                    "foundingDate": "2025",
                                    "founder": {
                                        "@type": "Person",
                                        "name": "Rahmat Yudi Burhanudin",
                                        "jobTitle": "Founder & Emerging Systems Architect",
                                        "sameAs": [
                                            "https://github.com/MattYudha",
                                            "https://www.linkedin.com/in/rahmat-yudi-burhanudin"
                                        ]
                                    },
                                    "sameAs": [
                                        "https://github.com/MattYudha/Frontend-Elysian-Rebirth",
                                        "https://portofolio-matt.vercel.app/"
                                    ]
                                },
                                {
                                    "@type": "LocalBusiness",
                                    "@id": "https://elysianlabs.web.id/#localbusiness",
                                    "name": "Elysian",
                                    "image": "https://elysianlabs.web.id/icon.png",
                                    "telephone": "+6281398318839",
                                    "email": "dewarahmat12334@gmail.com",
                                    "url": "https://elysianlabs.web.id/",
                                    "address": {
                                        "@type": "PostalAddress",
                                        "streetAddress": "Tangerang",
                                        "addressLocality": "Tangerang",
                                        "addressRegion": "Banten",
                                        "postalCode": "15710",
                                        "addressCountry": "ID"
                                    },
                                    "geo": {
                                        "@type": "GeoCoordinates",
                                        "latitude": "-6.2088",
                                        "longitude": "106.8456"
                                    },
                                    "openingHoursSpecification": {
                                        "@type": "OpeningHoursSpecification",
                                        "dayOfWeek": [
                                            "Monday",
                                            "Tuesday",
                                            "Wednesday",
                                            "Thursday",
                                            "Friday"
                                        ],
                                        "opens": "09:00",
                                        "closes": "17:00"
                                    }
                                },
                                {
                                    "@type": "WebSite",
                                    "@id": "https://elysianlabs.web.id/#website",
                                    "url": "https://elysianlabs.web.id/",
                                    "name": "Elysian",
                                    "publisher": {
                                        "@id": "https://elysianlabs.web.id/#organization"
                                    },
                                    "potentialAction": {
                                        "@type": "SearchAction",
                                        "target": {
                                            "@type": "EntryPoint",
                                            "urlTemplate": "https://elysianlabs.web.id/help?q={search_term_string}"
                                        },
                                        "query-input": "required name=search_term_string"
                                    }
                                },
                                {
                                    "@type": "SoftwareApplication",
                                    "@id": "https://elysianlabs.web.id/#softwareapplication",
                                    "name": "Elysian",
                                    "applicationCategory": "BusinessApplication",
                                    "operatingSystem": "Web",
                                    "description": "AI workflow intelligence platform for enterprise automation, centralizing operational visibility and decision control.",
                                    "publisher": {
                                        "@id": "https://elysianlabs.web.id/#organization"
                                    }
                                },
                                {
                                    "@type": "SiteNavigationElement",
                                    "@id": "https://elysianlabs.web.id/#navigation",
                                    "name": [
                                        "Home",
                                        "About Us",
                                        "Pricing",
                                        "Blog",
                                        "Use Cases",
                                        "Documentation",
                                        "Help Center"
                                    ],
                                    "url": [
                                        "https://elysianlabs.web.id/",
                                        "https://elysianlabs.web.id/about",
                                        "https://elysianlabs.web.id/pricing",
                                        "https://elysianlabs.web.id/blog",
                                        "https://elysianlabs.web.id/usecases",
                                        "https://elysianlabs.web.id/docs",
                                        "https://elysianlabs.web.id/help"
                                    ]
                                },
                                {
                                    "@type": "FAQPage",
                                    "@id": "https://elysianlabs.web.id/#faq",
                                    "mainEntity": [
                                        {
                                            "@type": "Question",
                                            "name": "Apa itu Elysian?",
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": "Elysian adalah platform AI Workflow Intelligence tingkat enterprise yang memusatkan otomatisasi operasi dan pengambilan keputusan. Dirancang untuk efisiensi bisnis modern."
                                            }
                                        },
                                        {
                                            "@type": "Question",
                                            "name": "Siapa pembuat Elysian atau Elysian punya siapa?",
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": "Elysian dibangun, diarsiteki, dan dimiliki oleh Rahmat Yudi Burhanudin. Rahmat Yudi adalah kreator dan pengembang utama platform Elysian AI yang berbasis di Indonesia."
                                            }
                                        },
                                        {
                                            "@type": "Question",
                                            "name": "Apakah Elysian bisa digunakan untuk pemerintah sebagai pendeteksi markup dan pencegahan korupsi?",
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": "Sangat bisa. Elysian memiliki teknologi unggulan AI Pendeteksi Markup Anggaran Pemerintah. Dengan dukungan Cognitive AI Swarm, Elysian dapat mengawasi, mendeteksi markup, dan mencegah tindak korupsi atau kebocoran anggaran secara real-time dengan standar keamanan data nasional."
                                            }
                                        },
                                        {
                                            "@type": "Question",
                                            "name": "Apa peran Rahmat Yudi di Elysian?",
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": "Rahmat Yudi Burhanudin adalah pencipta, arsitek utama, dan pimpinan dari Elysian. Rahmat Yudi memimpin visi teknis, inovasi, dan pengembangan inti Elysian AI."
                                            }
                                        }
                                    ]
                                }
                            ]
                        })
                    }}
                />
            </head>
            <body className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans`}>
                <NuqsAdapter>
                    <Providers>
                        <GhostModeIndicator />
                        {children}
                    </Providers>
                </NuqsAdapter>
            </body>
        </html>
    );
}
