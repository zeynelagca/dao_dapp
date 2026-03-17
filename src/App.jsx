import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, Globe, Landmark, CheckCircle2,
    ArrowRight, Activity, Shield, Zap, Heart,
    Lock, Users, TrendingUp, Github, Twitter,
    ExternalLink, BookOpen, Coins, ArrowDownUp, Info, Copy, Check,
    Youtube, Facebook, Linkedin
} from 'lucide-react';
import { ethers } from 'ethers';

const POLYGON_CHAIN_ID = 137;
const GAZAIN_ADDRESS = import.meta.env.VITE_GAZAIN_ADDRESS || "0x0000000000000000000000000000000000000000";
const NFT_ADDRESS = import.meta.env.VITE_NFT_ADDRESS || "0x0000000000000000000000000000000000000000";
const REQUIRED_GAZAIN = 50000;

const ERC20_ABI = [
    "function balanceOf(address owner) view returns (uint256)"
];
const NFT_ABI = [
    "function mint(string memory uri) payable"
];

const TRANSLATIONS = {
    en: {
        home: "Home", dao: "DAO", nft: "NFT Hub",
        connect: "Connect Wallet", connected: "Connected",
        title: "Digital Bridge of Hope",
        subtitle: "Empowering a transparent aid treasury through decentralization.",
        treasury: "Treasury Balance",
        votingPower: "Voting Power",
        proposals: "Active Proposals",
        prop1: "#GIP-12: Solar Panels for Hospitals",
        voteYes: "Vote For", voteNo: "Vote Against",
        nftMint: "Genesis Mint",
        mintStarts: "Mint starts in",
        tier1: "The Seed", tier2: "The Healer", tier3: "The Architect",
        mintBtn: "Mint Now",
        evolution: "Evolution Engine",
        evoText: "Hold and contribute to evolve your Guardian.",
        common: "Common", rare: "Rare", legendary: "Legendary",
        featuresTitle: "Why Gaza Initiative?",
        f1Title: "100% Transparent",
        f1Desc: "Every transaction is recorded on the Polygon blockchain. Track exactly where your aid goes.",
        f2Title: "Community Governed",
        f2Desc: "Hold $GAZAIN to vote on how funds are distributed. Your voice shapes the impact.",
        f3Title: "NFT Guardians",
        f3Desc: "Mint exclusive NFTs to multiply your voting power and immortalize your support.",
        statsTitle: "Global Impact",
        stat1: "Active Guardians",
        stat2: "Funds Raised",
        stat3: "Proposals Passed",
        rights: "© 2026 Gaza Initiative. All rights reserved.",
        heroDynamic: ["Hope", "Children", "Mothers", "Families", "Innocents"],
        how: "How It Works",
        howTitle: "How It Works",
        howSubtitle: "From your first click to making a real-world impact — here's how the Gaza Initiative ecosystem works.",
        step1Title: "Connect Your Wallet",
        step1Desc: "Install MetaMask and connect to the Polygon network. This is your gateway to the decentralized aid ecosystem.",
        step2Title: "Acquire $GAZAIN Tokens",
        step2Desc: "Buy $GAZAIN on QuickSwap (Polygon DEX). You need at least 50,000 $GAZAIN to unlock NFT minting and DAO voting power.",
        step3Title: "Mint a Guardian NFT",
        step3Desc: "Choose from 3 tiers: The Seed, The Healer, or The Architect. Minting costs 0.05 ETH and requires 50,000+ $GAZAIN balance.",
        step4Title: "Vote & Govern the DAO",
        step4Desc: "Your $GAZAIN balance becomes your voting power (vGAZAIN). Vote on active proposals to decide how treasury funds are distributed.",
        taxNote: "Every $GAZAIN transfer has a 3% tax that goes directly to the treasury, ensuring continuous funding.",
        myWallet: "My Wallet",
        walletTitle: "My Wallet",
        yourAddress: "Your Address",
        yourBalance: "$GAZAIN Balance",
        nftEligibility: "NFT Mint Eligibility",
        eligible: "Eligible ✓",
        notEligible: "Not Eligible — Need 50,000 $GAZAIN",
        buyGazain: "Buy $GAZAIN on QuickSwap",
        copied: "Copied!"
    },
    tr: {
        home: "Ana Sayfa", dao: "DAO", nft: "NFT Merkezi",
        connect: "Cüzdan Bağla", connected: "Bağlandı",
        title: "Dijital Umut Köprüsü",
        subtitle: "Merkeziyetsizlik yoluyla şeffaf bir yardım hazinesini güçlendiriyoruz.",
        treasury: "Hazine Bakiyesi",
        votingPower: "Oy Gücü",
        proposals: "Aktif Teklifler",
        prop1: "#GIP-12: Hastaneler için Güneş Panelleri",
        voteYes: "Kabul Oyu", voteNo: "Ret Oyu",
        nftMint: "Genesis Mint",
        mintStarts: "Başlangıç:",
        tier1: "Tohum", tier2: "Şifacı", tier3: "Mimar",
        mintBtn: "Şimdi Mint Et",
        evolution: "Evrim Motoru",
        evoText: "Muhafızınızı geliştirmek için tutun ve katkıda bulunun.",
        common: "Yaygın", rare: "Nadir", legendary: "Efsanevi",
        featuresTitle: "Neden Gaza Initiative?",
        f1Title: "%100 Şeffaf",
        f1Desc: "Her işlem Polygon blokzincirinde kayıtlıdır. Yardımınızın tam olarak nereye gittiğini takip edin.",
        f2Title: "Topluluk Yönetimi",
        f2Desc: "Fonların nasıl dağıtılacağını oylamak için $GAZAIN tutun. Etkiyi siz şekillendirin.",
        f3Title: "NFT Muhafızları",
        f3Desc: "Oy gücünüzü katlamak ve desteğinizi ölümsüzleştirmek için özel NFT'ler mint edin.",
        statsTitle: "Küresel Etki",
        stat1: "Aktif Muhafızlar",
        stat2: "Toplanan Fon (USDC)",
        stat3: "Kabul Edilen Teklifler",
        rights: "© 2026 Gaza Initiative. Tüm hakları saklıdır.",
        heroDynamic: ["Umudun", "Çocukların", "Annelerin", "Ailelerin", "Masumların"],
        how: "Nasıl Çalışır",
        howTitle: "Nasıl Çalışır?",
        howSubtitle: "İlk tıklamadan gerçek dünyada etki yaratmaya — Gaza Initiative ekosistemi şu şekilde çalışır.",
        step1Title: "Cüzdanınızı Bağlayın",
        step1Desc: "MetaMask yükleyin ve Polygon ağına bağlanın. Bu, merkeziyetsiz yardım ekosistemine açılan kapınızdır.",
        step2Title: "$GAZAIN Token Edinin",
        step2Desc: "QuickSwap (Polygon DEX) üzerinden $GAZAIN satın alın. NFT basımı ve DAO oylama gücünü açmak için en az 50.000 $GAZAIN'e ihtiyacınız var.",
        step3Title: "Guardian NFT Basın",
        step3Desc: "3 seviyeden birini seçin: Tohum, Şifacı veya Mimar. Basım 0.05 ETH'ye mal olur ve 50.000+ $GAZAIN bakiyesi gerektirir.",
        step4Title: "DAO'da Oy Kullanın",
        step4Desc: "$GAZAIN bakiyeniz oy gücünüz (vGAZAIN) olur. Hazine fonlarının nasıl dağıtılacağına karar vermek için aktif tekliflerde oy kullanın.",
        taxNote: "Her $GAZAIN transferinde %3 vergi doğrudan hazineye gider ve sürekli finansman sağlar.",
        myWallet: "Cüzdanım",
        walletTitle: "Cüzdanım",
        yourAddress: "Adresiniz",
        yourBalance: "$GAZAIN Bakiyeniz",
        nftEligibility: "NFT Basım Yetkinliği",
        eligible: "Yetkin ✓",
        notEligible: "Yetkin Değil — 50.000 $GAZAIN Gerekli",
        buyGazain: "QuickSwap'te $GAZAIN Satın Al",
        copied: "Kopyalandı!"
    },
    ar: {
        home: "الرئيسية", dao: "المنظمة", nft: "مركز NFT",
        connect: "ربط المحفظة", connected: "تم الربط",
        title: "جسر الأمل الرقمي",
        subtitle: "تمكين صندوق مساعدات شفاف من خلال اللامركزية.",
        treasury: "رصيد الخزينة",
        votingPower: "قوة التصويت",
        proposals: "المقترحات النشطة",
        prop1: "#GIP-12: ألواح مخصصة للمستشفيات",
        voteYes: "موافق", voteNo: "معارض",
        nftMint: "تكوين التكوين",
        mintStarts: "يبدأ السك في",
        tier1: "البذرة", tier2: "المعالج", tier3: "المهندس",
        mintBtn: "سك الآن",
        evolution: "محرك التطور",
        evoText: "احتفظ وساهم لتطوير حارسك.",
        common: "شائع", rare: "نادر", legendary: "أسطوري",
        featuresTitle: "لماذا مبادرة غزة؟",
        f1Title: "شفافية 100%",
        f1Desc: "يتم تسجيل كل معاملة على بلوكتشين بوليجون. تتبع بدقة أين تذهب مساعدتك.",
        f2Title: "مجتمع يحكم نفسه",
        f2Desc: "احتفظ بـ $GAZAIN للتصويت على كيفية توزيع الأموال. صوتك يشكل التأثير.",
        f3Title: "حراس NFT",
        f3Desc: "قم بسك رموز NFT حصرية لمضاعفة قوة تصويتك وتخليد دعمك.",
        statsTitle: "تأثير عالمي",
        stat1: "حراس نشطون",
        stat2: "الأموال المجمعة",
        stat3: "المقترحات المقبولة",
        rights: "© 2026 مبادرة غزة. جميع الحقوق محفوظة.",
        heroDynamic: ["الأمل", "الأطفال", "الأمهات", "العائلات", "الأبرياء"],
        how: "كيف يعمل",
        howTitle: "كيف يعمل؟",
        howSubtitle: "من أول نقرة إلى إحداث تأثير حقيقي — إليك كيف يعمل نظام مبادرة غزة.",
        step1Title: "اربط محفظتك",
        step1Desc: "ثبّت MetaMask واتصل بشبكة Polygon. هذه بوابتك إلى نظام المساعدات اللامركزي.",
        step2Title: "احصل على رموز $GAZAIN",
        step2Desc: "اشترِ $GAZAIN على QuickSwap. تحتاج 50,000 $GAZAIN على الأقل لفتح سك NFT وقوة التصويت.",
        step3Title: "اسك NFT حارس",
        step3Desc: "اختر من 3 مستويات: البذرة أو المعالج أو المهندس. السك يكلف 0.05 ETH ويتطلب رصيد 50,000+ $GAZAIN.",
        step4Title: "صوّت وأدِر المنظمة",
        step4Desc: "رصيد $GAZAIN يصبح قوة تصويتك. صوّت على المقترحات النشطة لتقرير كيفية توزيع أموال الخزينة.",
        taxNote: "كل تحويل $GAZAIN يتضمن ضريبة 3% تذهب مباشرة إلى الخزينة لضمان التمويل المستمر.",
        myWallet: "محفظتي",
        walletTitle: "محفظتي",
        yourAddress: "عنوانك",
        yourBalance: "رصيد $GAZAIN",
        nftEligibility: "أهلية سك NFT",
        eligible: "مؤهل ✓",
        notEligible: "غير مؤهل — تحتاج 50,000 $GAZAIN",
        buyGazain: "اشترِ $GAZAIN على QuickSwap",
        copied: "تم النسخ!"
    }
};

const Home = ({ t, setSection }) => {
    const [wordIndex, setWordIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % t.heroDynamic.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [t.heroDynamic.length]);

    return (
    <div className="space-y-32">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mt-10">
            <div className="flex-1 space-y-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon/30 bg-neon/5 text-neon text-sm font-medium">
                    <Zap size={14} />
                    <span>Polygon Network</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-tight flex flex-col items-start min-h-[160px]">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                        {t.title.split(' ').slice(0, 2).join(' ')}
                    </span>
                    <span className="text-neon text-glow mt-2 flex items-center relative h-[80px] w-full items-end overflow-hidden pb-1">
                        <span className="opacity-0 pr-3">{t.title.split(' ').slice(2, 3).join(' ')}</span>
                        <span className="absolute left-0 bottom-1 pr-3">{t.title.split(' ').slice(2, 3).join(' ')}</span>
                        <div className="relative h-full flex items-end flex-1">
                            <AnimatePresence mode="popLayout">
                                <motion.span
                                    key={wordIndex}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -50, opacity: 0 }}
                                    transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
                                    className="absolute bottom-1 text-white border-b-4 border-neon/50 pb-1"
                                    style={{ lineHeight: '1' }}
                                >
                                    {t.heroDynamic[wordIndex]}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                    </span>
                </h1>
                <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                    {t.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <button onClick={() => setSection('dao')} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-neon text-black px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                        {t.dao} <ArrowRight size={20} />
                    </button>
                    <button onClick={() => setSection('nft')} className="w-full sm:w-auto flex justify-center items-center gap-2 glass-panel border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-colors duration-300">
                        {t.nft}
                    </button>
                </div>
            </div>
            <div className="flex-1 relative w-full max-w-md mx-auto md:max-w-full">
                <div className="absolute inset-0 bg-neon/20 blur-[100px] rounded-full"></div>
                <img src="/assets/hero.png" alt="Hero" className="relative z-10 w-full rounded-2xl border border-white/10 glass-panel transform hover:-translate-y-2 transition-transform duration-500" />
            </div>
        </div>

        {/* Global Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-10 border-t border-white/10 glass-panel rounded-3xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">1,948</div>
                <div className="text-neon text-sm uppercase tracking-wider font-semibold">{t.stat1}</div>
            </div>
            <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">$142.5K</div>
                <div className="text-neon text-sm uppercase tracking-wider font-semibold">{t.stat2}</div>
            </div>
            <div>
                <div className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tighter">12</div>
                <div className="text-neon text-sm uppercase tracking-wider font-semibold">{t.stat3}</div>
            </div>
        </div>

        {/* Features Section */}
        <div className="space-y-12 pb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 flex flex-col items-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{t.featuresTitle}</span>
                <span className="w-16 h-1 bg-neon mt-4 rounded-full box-glow"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon/30 transition-all hover:-translate-y-2 group shadow-xl">
                    <div className="w-14 h-14 bg-neon/10 rounded-xl flex items-center justify-center border border-neon/30 mb-6 group-hover:bg-neon group-hover:text-black transition-colors text-neon">
                        <Lock size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{t.f1Title}</h3>
                    <p className="text-gray-400 leading-relaxed">{t.f1Desc}</p>
                </div>
                <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon/30 transition-all hover:-translate-y-2 group shadow-xl">
                    <div className="w-14 h-14 bg-neon/10 rounded-xl flex items-center justify-center border border-neon/30 mb-6 group-hover:bg-neon group-hover:text-black transition-colors text-neon">
                        <Users size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{t.f2Title}</h3>
                    <p className="text-gray-400 leading-relaxed">{t.f2Desc}</p>
                </div>
                <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon/30 transition-all hover:-translate-y-2 group shadow-xl">
                    <div className="w-14 h-14 bg-neon/10 rounded-xl flex items-center justify-center border border-neon/30 mb-6 group-hover:bg-neon group-hover:text-black transition-colors text-neon">
                        <TrendingUp size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{t.f3Title}</h3>
                    <p className="text-gray-400 leading-relaxed">{t.f3Desc}</p>
                </div>
            </div>
        </div>
    </div>
    );
};

const Dao = ({ t, wallet, gazaBalance }) => {
    const [filter, setFilter] = useState('all');
    const [showCreate, setShowCreate] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newAmount, setNewAmount] = useState('');
    const [newCategory, setNewCategory] = useState('aid');
    const [expandedId, setExpandedId] = useState(null);
    const [voted, setVoted] = useState({});

    const CATEGORIES = {
        aid: { label: "🏥 Humanitarian Aid", color: "text-green-400" },
        infra: { label: "🏗️ Infrastructure", color: "text-blue-400" },
        edu: { label: "📚 Education", color: "text-purple-400" },
        energy: { label: "⚡ Energy", color: "text-amber-400" },
        health: { label: "💊 Healthcare", color: "text-pink-400" }
    };

    const STATUS = {
        active: { label: "Active", bg: "bg-neon/20", text: "text-neon" },
        passed: { label: "Passed", bg: "bg-blue-500/20", text: "text-blue-400" },
        rejected: { label: "Rejected", bg: "bg-red-500/20", text: "text-red-400" },
        executed: { label: "Executed ✓", bg: "bg-emerald-500/20", text: "text-emerald-400" }
    };

    const [proposals, setProposals] = useState([
        {
            id: 1, title: "#GIP-12: Solar Panels for Hospitals",
            desc: "Install solar panel systems in 3 major hospitals to ensure uninterrupted power supply during emergencies. Budget includes panels, batteries, and installation labor.",
            category: "energy", status: "active", amount: 45000,
            yesVotes: 1008000, noVotes: 192000, totalVoters: 847,
            endsIn: "2 days", author: "0x7a3b...f91c", createdAt: "Mar 10, 2026"
        },
        {
            id: 2, title: "#GIP-11: Clean Water Distribution Network",
            desc: "Build a decentralized clean water pipeline serving 12 neighborhoods. Includes filtration stations and maintenance fund for 2 years.",
            category: "infra", status: "active", amount: 62000,
            yesVotes: 780000, noVotes: 420000, totalVoters: 623,
            endsIn: "5 days", author: "0x9c1d...e42a", createdAt: "Mar 8, 2026"
        },
        {
            id: 3, title: "#GIP-10: Emergency Medical Supplies",
            desc: "Procure and distribute critical medical supplies including antibiotics, surgical kits, and trauma care equipment to 5 field hospitals.",
            category: "health", status: "passed", amount: 28000,
            yesVotes: 1450000, noVotes: 150000, totalVoters: 1102,
            endsIn: "Ended", author: "0x3f8e...b72d", createdAt: "Mar 5, 2026"
        },
        {
            id: 4, title: "#GIP-09: School Rebuilding Program",
            desc: "Rebuild 2 destroyed primary schools with modern earthquake-resistant design. Includes desks, digital learning equipment, and playground.",
            category: "edu", status: "executed", amount: 85000,
            yesVotes: 1820000, noVotes: 80000, totalVoters: 1456,
            endsIn: "Completed", author: "0x5b2a...d19f", createdAt: "Feb 28, 2026"
        },
        {
            id: 5, title: "#GIP-08: Food Aid Logistics Hub",
            desc: "Establish a central logistics hub for food distribution with cold storage facilities and delivery vehicle fleet.",
            category: "aid", status: "rejected", amount: 120000,
            yesVotes: 340000, noVotes: 860000, totalVoters: 789,
            endsIn: "Ended", author: "0x8d4c...a63e", createdAt: "Feb 25, 2026"
        }
    ]);

    const filteredProposals = filter === 'all' ? proposals : proposals.filter(p => p.status === filter);
    const votingPower = wallet ? Number(parseFloat(gazaBalance)).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0";
    const canCreateProposal = wallet && parseFloat(gazaBalance) >= 10000;

    const handleVote = (id, isYes) => {
        if (!wallet) return alert("Please connect your wallet first.");
        if (voted[id]) return;
        setVoted(prev => ({ ...prev, [id]: isYes ? 'yes' : 'no' }));
        setProposals(prev => prev.map(p =>
            p.id === id ? {
                ...p,
                yesVotes: isYes ? p.yesVotes + parseFloat(gazaBalance) : p.yesVotes,
                noVotes: !isYes ? p.noVotes + parseFloat(gazaBalance) : p.noVotes,
                totalVoters: p.totalVoters + 1
            } : p
        ));
    };

    const handleCreateProposal = () => {
        if (!newTitle || !newDesc || !newAmount) return;
        const newProp = {
            id: proposals.length + 1,
            title: `#GIP-${proposals.length + 8}: ${newTitle}`,
            desc: newDesc,
            category: newCategory,
            status: "active",
            amount: parseInt(newAmount),
            yesVotes: 0, noVotes: 0, totalVoters: 0,
            endsIn: "7 days",
            author: wallet ? wallet.substring(0, 6) + '...' + wallet.substring(wallet.length - 4) : "0x...",
            createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
        setProposals(prev => [newProp, ...prev]);
        setNewTitle(''); setNewDesc(''); setNewAmount('');
        setShowCreate(false);
    };

    return (
        <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group border border-neon/20 hover:border-neon/50 transition-colors">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 blur-[50px] group-hover:bg-neon/20 transition-colors" />
                    <h3 className="text-gray-400 text-lg mb-2 flex items-center gap-2"><Landmark size={20} className="text-neon" /> {t.treasury}</h3>
                    <div className="text-4xl font-bold text-white tracking-tight">$142,500 <span className="text-neon text-xl">USDC</span></div>
                    <div className="mt-3 text-sm text-neon flex items-center gap-1"><Activity size={14} /> +12.5% this week</div>
                </div>
                <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border border-white/10 hover:border-white/20 transition-colors group">
                    <h3 className="text-gray-400 text-lg mb-2 flex items-center gap-2"><Shield size={20} className="text-neon" /> {t.votingPower}</h3>
                    <div className="text-4xl font-bold text-white tracking-tight group-hover:text-glow transition-all">
                        {votingPower} <span className="text-neon text-xl">vGAZAIN</span>
                    </div>
                    <div className="mt-3 text-sm text-gray-400">Min 10,000 to create proposals</div>
                </div>
                <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
                    <h3 className="text-gray-400 text-lg mb-2 flex items-center gap-2"><CheckCircle2 size={20} className="text-neon" /> Governance</h3>
                    <div className="text-4xl font-bold text-white tracking-tight">{proposals.length}</div>
                    <div className="mt-3 text-sm text-gray-400">{proposals.filter(p => p.status === 'active').length} active · {proposals.filter(p => p.status === 'executed').length} executed</div>
                </div>
            </div>

            {/* Controls: Filter + Create */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex flex-wrap gap-2">
                    {['all', 'active', 'passed', 'rejected', 'executed'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-all ${filter === f
                                ? 'bg-neon/20 text-neon border border-neon/50'
                                : 'glass-panel border border-white/10 text-gray-400 hover:text-white'
                            }`}
                        >{f === 'all' ? `All (${proposals.length})` : `${f} (${proposals.filter(p => p.status === f).length})`}</button>
                    ))}
                </div>
                <button
                    onClick={() => canCreateProposal ? setShowCreate(!showCreate) : alert(wallet ? "Need 10,000+ $GAZAIN to create proposals" : "Connect wallet first")}
                    className="flex items-center gap-2 bg-neon text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                    <span className="text-xl">+</span> Create Proposal
                </button>
            </div>

            {/* Create Proposal Form */}
            {showCreate && (
                <div className="glass-panel p-8 rounded-2xl border border-neon/30 space-y-6 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-6 bg-neon rounded-full box-glow inline-block" /> New Proposal
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-gray-400 text-sm uppercase tracking-wider">Title</label>
                            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="e.g., School Rebuilding Phase 2"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-neon/50 focus:outline-none transition-colors" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm uppercase tracking-wider">Amount (USDC)</label>
                                <input type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)} placeholder="50000"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-neon/50 focus:outline-none transition-colors" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-gray-400 text-sm uppercase tracking-wider">Category</label>
                                <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-neon/50 focus:outline-none transition-colors">
                                    {Object.entries(CATEGORIES).map(([key, val]) => (
                                        <option key={key} value={key}>{val.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-gray-400 text-sm uppercase tracking-wider">Description</label>
                        <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3} placeholder="Describe the proposal, its goals, and how the funds will be used..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:border-neon/50 focus:outline-none transition-colors resize-none" />
                    </div>
                    <div className="flex gap-4">
                        <button onClick={handleCreateProposal}
                            className="flex-1 py-3 bg-neon text-black rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                            Submit Proposal
                        </button>
                        <button onClick={() => setShowCreate(false)}
                            className="px-6 py-3 border border-white/10 text-gray-400 rounded-xl font-bold hover:bg-white/5 transition-colors">
                            Cancel
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">Voting period: 7 days · Quorum: 500K vGAZAIN · Pass threshold: &gt;50% Yes votes</p>
                </div>
            )}

            {/* Proposals List */}
            <div className="space-y-4">
                {filteredProposals.map(p => {
                    const totalVotes = p.yesVotes + p.noVotes;
                    const yesPct = totalVotes > 0 ? ((p.yesVotes / totalVotes) * 100).toFixed(0) : 0;
                    const noPct = totalVotes > 0 ? ((p.noVotes / totalVotes) * 100).toFixed(0) : 0;
                    const isExpanded = expandedId === p.id;
                    const st = STATUS[p.status];
                    const cat = CATEGORIES[p.category];
                    const hasVoted = voted[p.id];

                    return (
                        <div key={p.id} className={`glass-panel rounded-2xl border transition-all ${isExpanded ? 'border-neon/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/10 hover:border-white/20'}`}>
                            {/* Header */}
                            <div className="p-6 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : p.id)}>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-2">
                                            <span className={`px-3 py-1 ${st.bg} ${st.text} rounded-full text-xs font-bold uppercase tracking-wider`}>{st.label}</span>
                                            <span className={`text-xs ${cat.color}`}>{cat.label}</span>
                                            <span className="text-xs text-gray-500">${p.amount.toLocaleString()} USDC</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white">{p.title}</h3>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="text-gray-400 text-sm">{p.endsIn}</span>
                                        <div className="text-xs text-gray-500 mt-1">{p.totalVoters} voters</div>
                                    </div>
                                </div>

                                {/* Mini Progress */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-neon font-bold">{yesPct}% Yes</span>
                                        <span className="text-red-400 font-bold">{noPct}% No</span>
                                    </div>
                                    <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-neon rounded-full transition-all" style={{ width: `${yesPct}%` }} />
                                        <div className="h-full bg-red-500 rounded-full transition-all" style={{ width: `${noPct}%` }} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Detail */}
                            {isExpanded && (
                                <div className="px-6 pb-6 space-y-6 border-t border-white/5 pt-5">
                                    <p className="text-gray-400 leading-relaxed">{p.desc}</p>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                                        <div className="bg-black/30 rounded-lg p-3">
                                            <div className="text-sm font-bold text-neon">{(p.yesVotes / 1000).toFixed(0)}K</div>
                                            <div className="text-xs text-gray-500">Yes Votes</div>
                                        </div>
                                        <div className="bg-black/30 rounded-lg p-3">
                                            <div className="text-sm font-bold text-red-400">{(p.noVotes / 1000).toFixed(0)}K</div>
                                            <div className="text-xs text-gray-500">No Votes</div>
                                        </div>
                                        <div className="bg-black/30 rounded-lg p-3">
                                            <div className="text-sm font-bold text-white">{p.totalVoters}</div>
                                            <div className="text-xs text-gray-500">Voters</div>
                                        </div>
                                        <div className="bg-black/30 rounded-lg p-3">
                                            <div className="text-sm font-bold text-white">{p.author}</div>
                                            <div className="text-xs text-gray-500">Author</div>
                                        </div>
                                    </div>

                                    {/* Vote Buttons */}
                                    {p.status === 'active' && (
                                        <div className="space-y-3">
                                            {hasVoted ? (
                                                <div className={`text-center py-3 rounded-xl font-bold ${hasVoted === 'yes' ? 'bg-neon/10 text-neon border border-neon/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                                                    You voted {hasVoted === 'yes' ? '✓ For' : '✗ Against'} with {votingPower} vGAZAIN
                                                </div>
                                            ) : (
                                                <div className="flex gap-4">
                                                    <button onClick={(e) => { e.stopPropagation(); handleVote(p.id, true); }}
                                                        className="flex-1 py-3 bg-neon/10 border border-neon/50 text-neon hover:bg-neon hover:text-black rounded-xl font-bold transition-all shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                                                        {t.voteYes}
                                                    </button>
                                                    <button onClick={(e) => { e.stopPropagation(); handleVote(p.id, false); }}
                                                        className="flex-1 py-3 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl font-bold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                                                        {t.voteNo}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Finalization Info */}
                                    {p.status === 'passed' && (
                                        <div className="glass-panel p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex items-start gap-3">
                                            <Info size={18} className="text-blue-400 shrink-0 mt-0.5" />
                                            <div className="text-sm"><span className="text-blue-400 font-bold">Awaiting Execution:</span> <span className="text-blue-300/80">This proposal passed with {yesPct}% approval. The treasury multisig holders will execute the fund transfer of ${p.amount.toLocaleString()} USDC within 48 hours.</span></div>
                                        </div>
                                    )}
                                    {p.status === 'executed' && (
                                        <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 flex items-start gap-3">
                                            <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                                            <div className="text-sm"><span className="text-emerald-400 font-bold">Executed:</span> <span className="text-emerald-300/80">${p.amount.toLocaleString()} USDC has been transferred from the treasury. Funds are being deployed for: {p.title.split(': ')[1]}.</span></div>
                                        </div>
                                    )}
                                    {p.status === 'rejected' && (
                                        <div className="glass-panel p-4 rounded-xl border border-red-500/20 bg-red-500/5 flex items-start gap-3">
                                            <Info size={18} className="text-red-400 shrink-0 mt-0.5" />
                                            <div className="text-sm"><span className="text-red-400 font-bold">Rejected:</span> <span className="text-red-300/80">This proposal did not reach the required &gt;50% approval threshold. The author may revise and resubmit.</span></div>
                                        </div>
                                    )}

                                    <div className="text-xs text-gray-600">Created: {p.createdAt} · Voting period: 7 days · Quorum: 500K vGAZAIN</div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Governance Rules */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen size={18} className="text-neon" /> Governance Rules</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-black/30 rounded-xl p-4">
                        <div className="text-neon font-bold mb-1">Create</div>
                        <p className="text-gray-400">Hold 10,000+ $GAZAIN to submit proposals. Voting runs for 7 days.</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4">
                        <div className="text-neon font-bold mb-1">Vote</div>
                        <p className="text-gray-400">Your $GAZAIN = your vote weight. Quorum: 500K total votes. Pass: &gt;50% Yes.</p>
                    </div>
                    <div className="bg-black/30 rounded-xl p-4">
                        <div className="text-neon font-bold mb-1">Execute</div>
                        <p className="text-gray-400">Passed proposals are executed by the treasury multisig within 48 hours. On-chain verifiable.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Nft = ({ t, isEligible, mintNFT, gazaBalance }) => {
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);
    const [activeCollection, setActiveCollection] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const balanceNum = parseFloat(gazaBalance || "0");

    const collections = [
        {
            id: "hope",
            name: "🌱 Seeds of Hope",
            desc: "Entry-level collection. Plant the first seed of change.",
            price: "0.02",
            required: 10000,
            supply: 5000,
            minted: 1247,
            img: "/assets/tier1.png",
            gradient: "from-green-500/20",
            border: "border-green-500/30",
            rarity: "Common"
        },
        {
            id: "children",
            name: "👶 Children of Gaza",
            desc: "Protect the future. Every child deserves safety and education.",
            price: "0.04",
            required: 25000,
            supply: 2000,
            minted: 834,
            img: "/assets/children.png",
            gradient: "from-cyan-500/20",
            border: "border-cyan-500/30",
            rarity: "Uncommon"
        },
        {
            id: "mothers",
            name: "👩 Mothers of Gaza",
            desc: "Honor the strength. Mothers hold families together through everything.",
            price: "0.06",
            required: 50000,
            supply: 1000,
            minted: 412,
            img: "/assets/tier2.png",
            gradient: "from-purple-500/20",
            border: "border-purple-500/30",
            rarity: "Rare"
        },
        {
            id: "families",
            name: "👨‍👩‍👧 Families of Gaza",
            desc: "Unity is power. Celebrate the bonds that no wall can break.",
            price: "0.10",
            required: 75000,
            supply: 500,
            minted: 189,
            img: "/assets/tier3.png",
            gradient: "from-amber-500/20",
            border: "border-amber-500/30",
            rarity: "Epic"
        },
        {
            id: "innocents",
            name: "🕊️ The Innocents",
            desc: "Premium limited edition. The rarest and most powerful Guardian class.",
            price: "0.20",
            required: 100000,
            supply: 100,
            minted: 23,
            img: "/assets/hero.png",
            gradient: "from-yellow-500/20",
            border: "border-yellow-400/30",
            rarity: "Legendary"
        }
    ];

    const col = collections[activeCollection];
    const meetsRequirement = balanceNum >= col.required;
    const mintProgress = ((col.minted / col.supply) * 100).toFixed(0);

    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-block px-6 py-2 glass-panel rounded-full border border-neon/30 text-neon box-glow">
                    <span className="uppercase tracking-widest text-sm font-bold">{t.nftMint}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Gaza Guardians Collection
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">5 unique collections, each telling a story. Choose your Guardian and join the movement.</p>

                <div className="flex justify-center mt-6">
                    <div className="glass-panel px-8 py-4 rounded-2xl border border-neon/50 font-mono shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                        <span className="text-gray-400 block text-sm mb-2 uppercase">{t.mintStarts}</span>
                        <span className="text-4xl md:text-5xl font-bold text-neon text-glow tracking-widest">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-2xl font-bold text-white">8,600</div>
                    <div className="text-xs text-gray-400 uppercase">Total Supply</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-2xl font-bold text-neon">2,705</div>
                    <div className="text-xs text-gray-400 uppercase">Minted</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-2xl font-bold text-white">5%</div>
                    <div className="text-xs text-gray-400 uppercase">Royalty</div>
                </div>
                <div className="glass-panel p-4 rounded-xl border border-white/10 text-center">
                    <div className="text-2xl font-bold text-amber-400">~142 ETH</div>
                    <div className="text-xs text-gray-400 uppercase">Revenue</div>
                </div>
            </div>

            {/* Collection Tabs */}
            <div className="flex flex-wrap justify-center gap-2">
                {collections.map((c, idx) => (
                    <button
                        key={c.id}
                        onClick={() => setActiveCollection(idx)}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCollection === idx
                            ? 'bg-neon/20 text-neon border border-neon/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                            : 'glass-panel border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                        }`}
                    >
                        {c.name.split(' ').slice(0, 2).join(' ')}
                    </button>
                ))}
            </div>

            {/* Active Collection Detail */}
            <div className={`glass-panel rounded-3xl overflow-hidden border ${col.border} bg-gradient-to-br ${col.gradient} to-transparent`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image Side */}
                    <div className="p-6 md:p-8">
                        <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 relative group">
                            <div className="absolute inset-0 bg-neon/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay" />
                            <img src={col.img} alt={col.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold border border-white/20 z-20">
                                {col.rarity}
                            </div>
                        </div>
                    </div>

                    {/* Info Side */}
                    <div className="p-6 md:p-8 flex flex-col justify-center space-y-6">
                        <div>
                            <h3 className="text-3xl font-bold text-white mb-2">{col.name}</h3>
                            <p className="text-gray-400">{col.desc}</p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Mint Price</span>
                                <span className="text-white font-bold text-lg">{col.price} ETH</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Required $GAZAIN</span>
                                <span className={`font-bold text-lg ${meetsRequirement ? 'text-neon' : 'text-red-400'}`}>
                                    {col.required.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400 text-sm">Supply</span>
                                <span className="text-white font-bold">{col.minted} / {col.supply}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Minted</span>
                                <span>{mintProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className="h-full bg-neon progress-bar-glow rounded-full transition-all duration-500" style={{ width: `${mintProgress}%` }} />
                            </div>
                        </div>

                        <button
                            onClick={() => mintNFT(activeCollection)}
                            disabled={!meetsRequirement}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${meetsRequirement
                                ? 'bg-neon/10 border border-neon/50 text-neon hover:bg-neon hover:text-black hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]'
                                : 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            {meetsRequirement ? `${t.mintBtn} — ${col.price} ETH` : `Need ${col.required.toLocaleString()} $GAZAIN`}
                        </button>
                    </div>
                </div>
            </div>

            {/* All Collections Grid Preview */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {collections.map((c, idx) => (
                    <div
                        key={c.id}
                        onClick={() => setActiveCollection(idx)}
                        className={`glass-panel rounded-xl overflow-hidden cursor-pointer transition-all border group ${
                            activeCollection === idx ? 'border-neon/50 scale-105 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'border-white/10 hover:border-white/30'
                        }`}
                    >
                        <div className="aspect-square overflow-hidden">
                            <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-3">
                            <div className="text-sm font-bold text-white truncate">{c.name.split(' ').slice(1).join(' ')}</div>
                            <div className="text-xs text-gray-400 mt-1">{c.price} ETH · {c.supply - c.minted} left</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Royalty Info */}
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30 text-amber-400 shrink-0 mt-1">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="text-amber-200 font-bold mb-1">5% Secondary Market Royalty</h4>
                    <p className="text-amber-200/70 text-sm">Every time a Guardian NFT is resold on OpenSea or any marketplace, 5% of the sale goes back to the Gaza Initiative treasury — ensuring continuous funding.</p>
                </div>
            </div>

            {/* Evolution Engine */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-neon shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                <div className="p-4 bg-neon/10 rounded-full border border-neon/30 box-glow shrink-0">
                    <Heart size={40} className="text-neon" />
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">{t.evolution}</h3>
                    <p className="text-gray-400 max-w-lg">{t.evoText}</p>
                </div>
                <div className="md:ml-auto flex gap-3 shrink-0">
                    {[1, 2, 3, 4, 5].map(level => (
                        <div key={level} className={`w-3 h-12 rounded-full transition-all duration-500 ${level <= 2 ? 'bg-neon box-glow scale-110' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const HowItWorks = ({ t }) => {
    const steps = [
        { icon: <Wallet size={28} />, title: t.step1Title, desc: t.step1Desc, num: "01" },
        { icon: <Coins size={28} />, title: t.step2Title, desc: t.step2Desc, num: "02" },
        { icon: <ArrowDownUp size={28} />, title: t.step3Title, desc: t.step3Desc, num: "03" },
        { icon: <Landmark size={28} />, title: t.step4Title, desc: t.step4Desc, num: "04" }
    ];

    return (
        <div className="space-y-16">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 glass-panel rounded-full border border-neon/30 text-neon box-glow">
                    <BookOpen size={16} />
                    <span className="uppercase tracking-widest text-sm font-bold">{t.howTitle}</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    {t.howTitle}
                </h2>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">{t.howSubtitle}</p>
            </div>

            <div className="relative">
                {/* Vertical line connecting steps */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-neon/50 via-neon/20 to-transparent hidden md:block" />

                <div className="space-y-12">
                    {steps.map((step, idx) => (
                        <div key={idx} className={`flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="flex-1 w-full">
                                <div className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-neon/30 transition-all group">
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-3xl font-black text-neon/20 select-none">{step.num}</span>
                                        <div className="w-12 h-12 bg-neon/10 rounded-xl flex items-center justify-center border border-neon/30 text-neon group-hover:bg-neon group-hover:text-black transition-colors">
                                            {step.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                                    </div>
                                    <p className="text-gray-400 leading-relaxed pl-16">{step.desc}</p>
                                </div>
                            </div>
                            <div className="w-4 h-4 rounded-full bg-neon box-glow border-4 border-dark hidden md:block shrink-0 z-10" />
                            <div className="flex-1 hidden md:block" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Tax Note */}
            <div className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
                <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30 text-amber-400 shrink-0 mt-1">
                    <Info size={20} />
                </div>
                <p className="text-amber-200/80 leading-relaxed">{t.taxNote}</p>
            </div>
        </div>
    );
};

const MyWallet = ({ t, wallet, gazaBalance, isEligible, connectWallet, formatAddress }) => {
    const [copied, setCopied] = useState(false);

    const copyAddress = () => {
        if (wallet) {
            navigator.clipboard.writeText(wallet);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!wallet) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-8">
                <div className="w-24 h-24 bg-neon/10 rounded-full flex items-center justify-center border border-neon/30 box-glow">
                    <Wallet size={48} className="text-neon" />
                </div>
                <h2 className="text-3xl font-bold text-white">{t.walletTitle}</h2>
                <p className="text-gray-400 text-lg text-center max-w-md">{t.step1Desc}</p>
                <button
                    onClick={connectWallet}
                    className="flex items-center gap-3 bg-neon text-black px-10 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                >
                    <Wallet size={22} />
                    {t.connect}
                </button>
            </div>
        );
    }

    const balanceNum = parseFloat(gazaBalance);
    const progressToMint = Math.min((balanceNum / 50000) * 100, 100);

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Wallet size={28} className="text-neon" />
                {t.walletTitle}
            </h2>

            {/* Address Card */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-3">{t.yourAddress}</h3>
                <div className="flex items-center gap-3">
                    <code className="text-neon text-lg font-mono bg-black/40 px-4 py-2 rounded-lg border border-neon/20 flex-1 overflow-hidden text-ellipsis">
                        {wallet}
                    </code>
                    <button onClick={copyAddress} className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-neon/10 hover:border-neon/30 transition-colors text-gray-400 hover:text-neon">
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
                {copied && <span className="text-neon text-xs mt-2 block">{t.copied}</span>}
            </div>

            {/* Balance & Eligibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-8 rounded-2xl border border-neon/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 blur-[50px]" />
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Coins size={16} className="text-neon" /> {t.yourBalance}
                    </h3>
                    <div className="text-4xl font-bold text-white tracking-tight mt-2">
                        {Number(balanceNum).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        <span className="text-neon text-xl ml-2">$GAZAIN</span>
                    </div>
                </div>

                <div className={`glass-panel p-8 rounded-2xl border relative overflow-hidden ${isEligible ? 'border-neon/30' : 'border-red-500/20'}`}>
                    <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Shield size={16} className={isEligible ? 'text-neon' : 'text-red-400'} /> {t.nftEligibility}
                    </h3>
                    <div className={`text-xl font-bold mt-2 ${isEligible ? 'text-neon' : 'text-red-400'}`}>
                        {isEligible ? t.eligible : t.notEligible}
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>{Number(balanceNum).toLocaleString()} / 50,000</span>
                            <span>{progressToMint.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${isEligible ? 'bg-neon progress-bar-glow' : 'bg-red-500'}`} style={{ width: `${progressToMint}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Buy Button */}
            <a
                href="https://quickswap.exchange/#/swap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 bg-neon/10 border border-neon/50 text-neon rounded-xl font-bold text-lg hover:bg-neon hover:text-black transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
            >
                <ExternalLink size={20} />
                {t.buyGazain}
            </a>
        </div>
    );
};

const App = () => {
    const [lang, setLang] = useState('en');
    const [section, setSection] = useState('home');
    const [wallet, setWallet] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [gazaBalance, setGazaBalance] = useState("0");
    const [isEligible, setIsEligible] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const t = TRANSLATIONS[lang];
    const isRTL = lang === 'ar';

    useEffect(() => {
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    }, [lang, isRTL]);

    const updateBalance = async (address, ethersProvider) => {
        try {
            const tokenContract = new ethers.Contract(GAZAIN_ADDRESS, ERC20_ABI, ethersProvider);
            const balance = await tokenContract.balanceOf(address);
            const formattedBalance = ethers.formatEther(balance);
            setGazaBalance(formattedBalance);
            setIsEligible(parseFloat(formattedBalance) > REQUIRED_GAZAIN);
        } catch (e) {
            console.log("Could not fetch balance or contract un-deployed. Falling back to mock data... ");
            setGazaBalance("55420"); // Mock logic
            setIsEligible(true);
        }
    };

    const connectWallet = async () => {
        try {
            if (window.ethereum) {
                const ethersProvider = new ethers.BrowserProvider(window.ethereum);
                const ethersSigner = await ethersProvider.getSigner();
                const address = await ethersSigner.getAddress();

                setProvider(ethersProvider);
                setSigner(ethersSigner);
                setWallet(address);

                await updateBalance(address, ethersProvider);
            } else {
                alert("Please install MetaMask!");
            }
        } catch (error) {
            console.error("Wallet connection failed", error);
        }
    };

    const mintNFT = async (tierIdx) => {
        if (!signer) return alert("Please connect your wallet first.");
        if (!isEligible) return alert("Not eligible! You need more than 50,000 $GAZAIN tokens.");

        try {
            const nftContract = new ethers.Contract(NFT_ADDRESS, NFT_ABI, signer);
            const tx = await nftContract.mint(`ipfs://guardian-tier-${tierIdx}.json`, {
                value: ethers.parseEther("0.05")
            });
            alert("Transaction Submitted! Confirming...");
            await tx.wait();
            alert("Guardian Minted Successfully!");
        } catch (error) {
            console.error("Minting Failed", error);
            alert("Minting failed. Check console for details.");
        }
    };

    const formatAddress = (addr) => addr.substring(0, 6) + '...' + addr.substring(addr.length - 4);

    return (
        <div className={`min-h-screen bg-dark ${isRTL ? 'font-arabic' : 'font-sans'}`}>
            {/* Header */}
            <nav className="fixed w-full top-0 z-50 glass-panel border-b border-neon/20 shadow-lg" style={{zIndex: 50}}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSection('home')}>
                        <img src="/assets/logo.png" alt="Logo" className="w-10 h-10 rounded-full border border-neon box-glow object-cover" />
                        <span className="text-xl font-bold text-white text-glow hidden sm:block">GAZA<span className="text-neon">IN</span></span>
                    </div>

                    <div className="hidden md:flex space-x-1 items-center bg-black/40 p-1 rounded-full border border-white/10">
                        {['home', 'dao', 'nft', 'how', ...(wallet ? ['myWallet'] : [])].map((item) => (
                            <button
                                key={item}
                                onClick={() => setSection(item)}
                                className={`transition-all duration-300 capitalize px-6 py-2 rounded-full ${section === item ? 'bg-neon/10 text-neon font-semibold text-glow shadow-[inset_0_0_10px_rgba(34,197,94,0.2)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                {t[item]}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                                <Globe size={18} />
                                <span className="uppercase text-sm font-medium">{lang}</span>
                            </button>
                            <div className="absolute top-full right-0 mt-2 w-24 glass-panel rounded-lg border border-white/10 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                                {Object.keys(TRANSLATIONS).map(l => (
                                    <button key={l} onClick={() => { setLang(l); setIsMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-neon/20 hover:text-neon uppercase text-sm font-medium transition-colors">
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={connectWallet}
                            className={`flex items-center gap-2 border px-4 py-2 rounded-lg font-bold transition-all duration-300 shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.6)] ${wallet ? 'bg-neon/10 border-neon/50 text-neon hover:bg-neon hover:text-black' : 'bg-neon text-black border-neon hover:bg-green-400'}`}
                        >
                            <Wallet size={18} />
                            <span className="hidden sm:inline">{wallet ? formatAddress(wallet) : t.connect}</span>
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button className="md:hidden text-gray-300 hover:text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} /></svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl absolute w-full">
                        <div className="px-4 py-4 space-y-2">
                            {['home', 'dao', 'nft', 'how', ...(wallet ? ['myWallet'] : [])].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => { setSection(item); setIsMenuOpen(false); }}
                                    className={`block w-full text-left px-4 py-3 rounded-lg capitalize ${section === item ? 'bg-neon/10 text-neon font-bold' : 'text-gray-300 hover:bg-white/5'}`}
                                >
                                    {t[item]}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            {/* Main Content */}
            <main className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={section}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                    >
                        {section === 'home' && <Home t={t} setSection={setSection} />}
                        {section === 'dao' && <Dao t={t} wallet={wallet} gazaBalance={gazaBalance} />}
                        {section === 'nft' && <Nft t={t} isEligible={isEligible} mintNFT={mintNFT} gazaBalance={gazaBalance} />}
                        {section === 'how' && <HowItWorks t={t} />}
                        {section === 'myWallet' && <MyWallet t={t} wallet={wallet} gazaBalance={gazaBalance} isEligible={isEligible} connectWallet={connectWallet} formatAddress={formatAddress} />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-black/40 pt-12 pb-8 mt-auto relative z-10 glass-panel">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 rounded-full border border-neon object-cover" />
                            <span className="text-xl font-bold text-white tracking-widest text-glow">GAZA<span className="text-neon">IN</span></span>
                        </div>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon hover:bg-neon/10 transition-colors border border-white/10">
                                <Github size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon hover:bg-neon/10 transition-colors border border-white/10">
                                <Coins size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon hover:bg-neon/10 transition-colors border border-white/10">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon hover:bg-neon/10 transition-colors border border-white/10">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-neon hover:bg-neon/10 transition-colors border border-white/10">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>
                    <div className="text-center mt-8 text-sm text-gray-600">
                        {t.rights}
                    </div>
                </div>
            </footer>

            {/* Background decorations */}
            <div className="fixed top-[20%] left-[-10%] w-[40%] h-[40%] bg-neon/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        </div>
    );
};

export default App;
