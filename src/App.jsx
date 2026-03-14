import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, Globe, Landmark, CheckCircle2,
    ArrowRight, Activity, Shield, Zap, Heart
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
        common: "Common", rare: "Rare", legendary: "Legendary"
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
        common: "Yaygın", rare: "Nadir", legendary: "Efsanevi"
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
        common: "شائع", rare: "نادر", legendary: "أسطوري"
    }
};

const Home = ({ t, setSection }) => (
    <div className="flex flex-col md:flex-row items-center justify-between gap-12 mt-10">
        <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon/30 bg-neon/5 text-neon text-sm font-medium">
                <Zap size={14} />
                <span>Polygon Network</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">{t.title.split(' ').slice(0, 2).join(' ')}</span><br />
                <span className="text-neon text-glow">{t.title.split(' ').slice(2).join(' ')}</span>
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
);

const Dao = ({ t, wallet, gazaBalance }) => (
    <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group border border-neon/20 hover:border-neon/50 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-neon/10 blur-[50px] group-hover:bg-neon/20 transition-colors"></div>
                <h3 className="text-gray-400 text-lg mb-2 flex items-center gap-2"><Landmark size={20} className="text-neon" /> {t.treasury}</h3>
                <div className="text-5xl font-bold text-white tracking-tight">$142,500 <span className="text-neon text-2xl">USDC</span></div>
                <div className="mt-4 text-sm text-neon flex items-center gap-1"><Activity size={14} /> +12.5% this week</div>
            </div>

            <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border border-white/10 hover:border-white/20 transition-colors group">
                <h3 className="text-gray-400 text-lg mb-2 flex items-center gap-2"><Shield size={20} className="text-neon" /> {t.votingPower}</h3>
                <div className="text-5xl font-bold text-white tracking-tight group-hover:text-glow transition-all">
                    {wallet ? Number(gazaBalance).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0"} <span className="text-neon text-2xl">vGAZAIN</span>
                </div>
                <div className="mt-4 text-sm text-gray-400">
                    ($GAZAIN Balance × NFT Multiplier)
                </div>
            </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-neon rounded-full box-glow inline-block"></span>
                {t.proposals}
            </h2>

            <div className="border border-white/10 rounded-xl p-6 bg-black/40 hover:bg-black/60 transition-colors outline outline-1 outline-transparent hover:outline-neon/30">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                        <span className="px-3 py-1 bg-neon/20 text-neon rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block box-glow">Active</span>
                        <h3 className="text-xl font-bold text-white">{t.prop1}</h3>
                    </div>
                    <span className="text-gray-400 text-sm whitespace-nowrap">Ends in 2 days</span>
                </div>

                <div className="space-y-4 mb-8">
                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-neon font-bold flex items-center gap-1"><CheckCircle2 size={14} /> 84% Yes</span>
                            <span className="text-gray-400">1.2M Votes</span>
                        </div>
                        <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden">
                            <div className="h-full bg-neon w-[84%] progress-bar-glow rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button className="flex-1 py-3 bg-neon/10 border border-neon/50 text-neon hover:bg-neon hover:text-black rounded-lg font-bold transition-all shadow-lg hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                        {t.voteYes}
                    </button>
                    <button className="flex-1 py-3 border border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white rounded-lg font-bold transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                        {t.voteNo}
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const Nft = ({ t, isEligible, mintNFT }) => {
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60);

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

    const nfts = [
        { name: t.tier1, rarity: t.common, img: "/assets/tier1.png", color: "from-blue-500/20" },
        { name: t.tier2, rarity: t.rare, img: "/assets/tier2.png", color: "from-purple-500/20" },
        { name: t.tier3, rarity: t.legendary, img: "/assets/tier3.png", color: "from-amber-500/20" }
    ];

    return (
        <div className="space-y-12">
            <div className="text-center space-y-4">
                <div className="inline-block px-6 py-2 glass-panel rounded-full border border-neon/30 text-neon box-glow">
                    <span className="uppercase tracking-widest text-sm font-bold">{t.nftMint}</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    1,948 Gaza Guardians
                </h2>

                <div className="flex justify-center mt-6">
                    <div className="glass-panel px-8 py-4 rounded-2xl border border-neon/50 font-mono shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                        <span className="text-gray-400 block text-sm mb-2 uppercase">{t.mintStarts}</span>
                        <span className="text-4xl md:text-5xl font-bold text-neon text-glow tracking-widest">{formatTime(timeLeft)}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {nfts.map((nft, idx) => (
                    <div key={idx} className={`glass-panel rounded-2xl overflow-hidden border border-white/10 hover:border-neon/50 transition-colors group relative bg-gradient-to-b ${nft.color} to-transparent`}>
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/10 z-10">
                            {nft.rarity}
                        </div>
                        <div className="p-4">
                            <div className="aspect-square rounded-xl overflow-hidden relative border border-white/5">
                                <div className="absolute inset-0 bg-neon/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay"></div>
                                <img src={nft.img} alt={nft.name} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
                            </div>
                            <h3 className="text-2xl font-bold mt-6 mb-2 text-white">{nft.name}</h3>
                            <button
                                onClick={() => mintNFT(idx)}
                                disabled={!isEligible}
                                className={`w-full mt-4 py-3 border rounded-lg font-bold transition-all shadow-lg ${isEligible ? 'bg-white/5 border-white/10 hover:bg-neon hover:text-black hover:border-neon hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-white/5 border-white/10 text-gray-500 opacity-50 cursor-not-allowed'}`}>
                                {isEligible ? t.mintBtn : "Not Eligible"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-neon shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                <div className="p-4 bg-neon/10 rounded-full border border-neon/30 box-glow shrink-0">
                    <Heart size={40} className="text-neon" />
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-2xl font-bold text-white mb-2">{t.evolution}</h3>
                    <p className="text-gray-400 max-w-lg">{t.evoText}</p>
                </div>
                <div className="md:ml-auto flex gap-3 shrink-0">
                    {[1, 2, 3].map(level => (
                        <div key={level} className={`w-3 h-12 rounded-full transition-all duration-500 ${level === 1 ? 'bg-neon box-glow scale-110' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>
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
                        {['home', 'dao', 'nft'].map((item) => (
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
                            {['home', 'dao', 'nft'].map((item) => (
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
                        {section === 'nft' && <Nft t={t} isEligible={isEligible} mintNFT={mintNFT} />}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Background decorations */}
            <div className="fixed top-[20%] left-[-10%] w-[40%] h-[40%] bg-neon/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
        </div>
    )
};

export default App;
