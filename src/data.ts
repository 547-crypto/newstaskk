import { Article, AppRecommendation } from './types';

export const ARTICLES: Article[] = [
  {
    id: '1',
    category: 'Tech Analysis',
    title: 'The Quantum Horizon: Why 2024 is the Year Silicon Meets Its Match',
    excerpt: 'A deep dive into how topological qubits are moving from theoretical physics to practical computing, threatening to disrupt everything from encryption to material science.',
    content: `For decades, the silicon transistor has been the undisputed king of technological progress. It has fueled the rise of the personal computer, the smartphone, and the massive cloud data centers that power our digital lives. But as we approach the physical limits of how small we can make silicon features, a new contender is emerging from the labs: quantum computing.

Specifically, topological qubits are moving from the realm of pure theoretical physics to practical engineering. Unlike conventional qubits, which are highly susceptible to environmental noise and suffer from high error rates, topological qubits protect information by weaving it into the physical geometry of the hardware. This means they are inherently more stable, requiring far less error-correction overhead.

In this deep dive, we explore why 2024 is shaping up to be a turning point. We interview leading researchers at IBM, Google, and Microsoft who are racing to demonstrate quantum supremacy with real-world workloads, from simulating complex molecular structures for new drug discovery to optimizing global logistics networks. The silicon age is not over, but its absolute dominance is officially being challenged.`,
    author: 'Sarah Jenkins',
    authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    readTime: '12 min read',
    publishedTime: '2 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800&h=450'
  },
  {
    id: '2',
    category: 'Gaming',
    title: 'Next-Gen Consoles: Is the Mid-Cycle Refresh Necessary?',
    excerpt: 'Recent leaks suggest a Pro model is on the horizon, but developers are still struggling to push current hardware to its limits.',
    content: `Rumors of a mid-generation console refresh have reached a fever pitch. If leaks are to be believed, upgraded systems boasting twice the ray-tracing performance and custom AI upscaling chips are slated for release in late 2024. But this begs an important question: does the gaming public actually need or want a mid-cycle refresh?

We are currently four years into the lifecycle of the current console generation, yet many gamers feel we have barely scratched the surface of what these machines can do. Due to development delays and cross-generation releases that supported older hardware for years, true next-gen-only exclusives are still relatively rare. Developers themselves express concern that split hardware targets will only increase development costs and times, which are already at historical highs. We survey the landscape, analyze the rumored specs, and ask whether this refresh is driven by genuine technological need or simply corporate sales targets.`,
    author: 'Marcus Thorne',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    readTime: '5 min read',
    publishedTime: '4 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: '3',
    category: 'Guides',
    title: 'Mastering the New Web Privacy Standards',
    excerpt: 'How to audit your digital footprint in an era of increasingly sophisticated cross-site tracking mechanisms.',
    content: `Web privacy has evolved from a niche concern to a critical digital safety requirement. As third-party cookies are phased out, tracking firms are deploying more insidious techniques, such as browser fingerprinting, CNAME cloaking, and link decoration to monitor your behavior across the web.

This comprehensive guide takes you step-by-step through a complete privacy audit. Learn how to configure modern browsers to block advanced telemetry, set up personal DNS-level blocking, and use privacy-respecting alternatives for search, mail, and productivity. We also demystify the new privacy protocols like Apple Private Relay and secure routing standards that aim to keep your IP address private from ISP logging.`,
    author: 'Elena Rodriguez',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    readTime: '15 min read',
    publishedTime: '6 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: '4',
    category: 'Technology',
    title: 'OLED vs MicroLED: The War for Your Living Room',
    excerpt: 'Comparing longevity, brightness peaks, and black levels in the latest display technology battleground.',
    content: `For years, OLED has been the gold standard for premium televisions and smartphones, celebrated for its perfect blacks and infinite contrast. But OLED has always had two major Achilles' heels: sub-par peak brightness and the dreaded risk of permanent burn-in. Enter MicroLED.

Unlike OLED, which uses organic compounds, MicroLED relies on inorganic gallium nitride, allowing it to produce incredibly high peak brightness (well over 5,000 nits) with zero risk of burn-in, while maintaining the same pixel-level light control. However, manufacturing MicroLED panels at consumer sizes is an engineering nightmare, requiring millions of individual microscopic LEDs to be precisely transferred onto a substrate. We break down the physics, examine current manufacturing breakthroughs, and help you decide which technology will dominate the premium living room space in the years to come.`,
    author: 'David Chen',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    readTime: '9 min read',
    publishedTime: '8 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=600&h=400'
  },
  {
    id: '5',
    category: 'Cybersecurity',
    title: 'The Rise of Zero-Trust Architectures in Modern Enterprises',
    excerpt: 'Why the traditional perimeter-based security model is dead, and how companies are adapting to a world where breaches are assumed.',
    content: `The days of building a strong perimeter and trusting everything inside the network are over. With the rapid shift to remote work and cloud-native applications, the attack surface has expanded exponentially. Enter Zero Trust Architecture (ZTA). \n\nZero Trust operates on a simple principle: "never trust, always verify." Every request for access, regardless of where it originates, is treated as potentially hostile. This means continuous authentication, strict identity verification, and micro-segmentation of networks. In this article, we explore how major corporations are overhauling their legacy systems to implement Zero Trust, the challenges they face, and why this framework is essential to surviving the next generation of sophisticated cyberattacks.`,
    author: 'Alex Mercer',
    authorImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    readTime: '10 min read',
    publishedTime: '10 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1510511459019-5efa7ae11a51?auto=format&fit=crop&q=80&w=800&h=450'
  },
  {
    id: '6',
    category: 'Artificial Intelligence',
    title: 'Generative AI: The New Frontier in Content Creation',
    excerpt: 'From hyper-realistic images to nuanced written content, generative AI is reshaping the creative landscape. But at what cost?',
    content: `Generative AI models like GPT-4 and Midjourney have captured the public imagination, demonstrating an uncanny ability to produce art, write code, and draft essays that rival human output. The implications for the creative industry are profound, promising unprecedented efficiency and novel forms of expression.\n\nHowever, this rapid advancement brings a host of ethical and economic questions. Who owns the copyright to AI-generated art? How will it impact the livelihoods of human artists, writers, and musicians? Are we prepared for the influx of AI-generated misinformation? We tackle these questions by speaking with leading AI ethicists, legal experts, and creators who are navigating this brave new world.`,
    author: 'Sophia Lin',
    authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    readTime: '14 min read',
    publishedTime: '12 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800&h=450'
  },
  {
    id: '7',
    category: 'Space Exploration',
    title: 'The Commercial Space Race: Beyond Low Earth Orbit',
    excerpt: 'Private companies are no longer just launching satellites. The race for lunar bases and asteroid mining has officially begun.',
    content: `For decades, space exploration was the exclusive domain of national space agencies. Today, companies like SpaceX, Blue Origin, and a host of agile startups are driving a new era of commercial spaceflight. While delivering payloads to Low Earth Orbit (LEO) has become routine, the focus is now shifting to deep space.\n\nThe next frontier? Establishing sustainable lunar bases and pioneering the trillion-dollar prospect of asteroid mining. This transition requires overcoming monumental engineering challenges, from developing reliable life-support systems for long-duration missions to creating autonomous mining robots capable of operating in zero gravity. We examine the technological roadmap and the complex geopolitical landscape of the emerging space economy.`,
    author: 'Dr. Emily Carter',
    authorImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120&h=120',
    readTime: '11 min read',
    publishedTime: '14 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=450'
  },
  {
    id: '8',
    category: 'Biotechnology',
    title: 'CRISPR 2.0: The Next Generation of Gene Editing',
    excerpt: 'Beyond simple cuts, the latest CRISPR technologies enable precise base editing, opening doors to curing complex genetic diseases.',
    content: `CRISPR-Cas9 revolutionized biotechnology by providing a relatively simple and affordable tool for editing genes. But the original system, often compared to a pair of genetic scissors, had limitations, primarily the risk of off-target effects. Now, "CRISPR 2.0" technologies, such as base editing and prime editing, are taking center stage.\n\nThese advanced techniques act more like a word processor, allowing scientists to rewrite individual DNA letters without breaking the double helix, significantly reducing the chance of unwanted mutations. This precision is unlocking new possibilities for treating previously incurable genetic disorders. We speak with researchers leading clinical trials and explore the regulatory hurdles standing between these breakthroughs and the patients who need them.`,
    author: 'James Wilson',
    authorImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    readTime: '13 min read',
    publishedTime: '16 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800&h=450'
  },
  {
    id: '9',
    category: 'Green Tech',
    title: 'Solid-State Batteries: The Holy Grail of Electric Vehicles',
    excerpt: 'Promising longer range, faster charging, and improved safety, solid-state batteries could revolutionize the EV industry. Are they finally ready?',
    content: `The rapid adoption of electric vehicles (EVs) has been driven by steady improvements in lithium-ion batteries. However, traditional lithium-ion tech is approaching its theoretical limits in energy density and remains hampered by the use of flammable liquid electrolytes. The proposed solution? Solid-state batteries.\n\nBy replacing the liquid electrolyte with a solid material, these batteries promise a dramatic increase in range, significantly faster charging times, and a massively reduced risk of fire. While the technology has been in development for years, manufacturing it at scale has proven incredibly difficult. In this feature, we analyze the recent breakthroughs by major automakers and battery startups, determining whether the era of the solid-state EV is finally upon us.`,
    author: 'Sarah Jenkins',
    authorImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120&h=120',
    readTime: '9 min read',
    publishedTime: '18 hours ago',
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&q=80&w=800&h=450'
  }
];

export const TRENDING_ARTICLES = [
  {
    id: 't1',
    rank: '01',
    title: 'The Best VR Headsets for 2024 Reviewed',
    readTime: '4 min read'
  },
  {
    id: 't2',
    rank: '02',
    title: 'Why Indie Games are Winning the 2024 Market',
    readTime: '6 min read'
  },
  {
    id: 't3',
    rank: '03',
    title: 'Smartphone Battery Tech is About to Change Forever',
    readTime: '8 min read'
  }
];

export const RECOMMENDATIONS: AppRecommendation[] = [
  {
    id: 'r1',
    name: 'Focus Flow',
    description: 'The ultimate pomodoro and task management suite for heavy workloads.',
    type: 'App',
    icon: 'Layers',
    url: '#'
  },
  {
    id: 'r2',
    name: 'Obsidian Web',
    description: 'A revolutionary knowledge management system living entirely in your browser.',
    type: 'Website',
    icon: 'Globe',
    url: '#'
  },
  {
    id: 'r3',
    name: 'DevBoard Pro',
    description: 'Monitor your entire deployment stack from a single, beautiful dashboard.',
    type: 'App',
    icon: 'Terminal',
    url: '#'
  },
  {
    id: 'r4',
    name: 'Contrast AI',
    description: 'Generative color systems for UI designers that prioritize accessibility.',
    type: 'Website',
    icon: 'Palette',
    url: '#'
  }
];
