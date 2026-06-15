import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";

// Interface definitions for TypeScript safety
interface Lead {
  name: string;
  email: string;
  phone: string;
  loc: string;
}

interface MpesaLog {
  receipt: string;
  phone: string;
  amount: number;
  message: string;
  timestamp: string;
  status: "SUCCESS" | "CANCELLED" | "PENDING";
}

export default function Home() {
  // Navigation & UI state
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [uptime, setUptime] = useState<number>(52325);
  const [nairobiTime, setNairobiTime] = useState<string>("12:35 PM");
  const [cpu, setCpu] = useState<number>(12);
  const [mem, setMem] = useState<number>(184);

  // Scraper state
  const [sector, setSector] = useState<string>("Tech Startups");
  const [city, setCity] = useState<string>("Nairobi");
  const [isScrapeRunning, setIsScrapeRunning] = useState<boolean>(false);
  const [scrapePercent, setScrapePercent] = useState<number>(0);
  const [scrapeConsole, setScrapeConsole] = useState<string[]>([]);
  const [scrapedLeads, setScrapedLeads] = useState<Lead[]>([]);

  // Email state
  const [emailTemplate, setEmailTemplate] = useState<string>("mpesa");
  const [emailConsole, setEmailConsole] = useState<string[]>([
    "> Dispatcher idle. Awaiting campaign launch..."
  ]);
  const [isEmailRunning, setIsEmailRunning] = useState<boolean>(false);
  const [emailsSentCount, setEmailsSentCount] = useState<number>(0);
  const [emailsSuccessRate, setEmailsSuccessRate] = useState<number>(0);

  // M-Pesa state
  const [mpesaPhone, setMpesaPhone] = useState<string>("0712345678");
  const [mpesaAmount, setMpesaAmount] = useState<string>("1500");
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState<boolean>(false);
  const [phonePin, setPhonePin] = useState<string>("");
  const [mpesaLogs, setMpesaLogs] = useState<MpesaLog[]>([
    {
      receipt: "RFH819D2K9",
      phone: "+254712***840",
      amount: 2500,
      message: "Success Callback Received",
      timestamp: "2026-06-15 12:30:15",
      status: "SUCCESS"
    },
    {
      receipt: "RFH738G1L4",
      phone: "+254722***012",
      amount: 1200,
      message: "Success Callback Received",
      timestamp: "2026-06-15 10:15:22",
      status: "SUCCESS"
    },
    {
      receipt: "RFH483H9M6",
      phone: "+254705***330",
      amount: 3500,
      message: "Request Cancelled by User",
      timestamp: "2026-06-15 09:02:11",
      status: "CANCELLED"
    }
  ]);

  // Terminal state
  const [terminalInput, setTerminalInput] = useState<string>("type a command...");
  const [terminalHistory, setTerminalHistory] = useState<Array<{ type: string; text: string }>>([
    { type: "system", text: "FredVA SSH Daemon Active. Uptime: 14h 32m." },
    { type: "system", text: "Welcome, root admin! Type 'help' to view all commands." }
  ]);

  // References for scrolling
  const scrapeConsoleEndRef = useRef<HTMLDivElement>(null);
  const emailConsoleEndRef = useRef<HTMLDivElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const activityFeedRef = useRef<HTMLDivElement>(null);

  // Clock and diagnostics ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);

      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Africa/Nairobi"
      });
      setNairobiTime(`${timeStr} (EAT)`);

      // Jitter stats
      setCpu(Math.floor(Math.random() * 10) + 8);
      setMem(184 + (Math.floor(Math.random() * 6) - 3));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto scroll effects
  useEffect(() => {
    scrapeConsoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrapeConsole]);

  useEffect(() => {
    emailConsoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [emailConsole]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalHistory]);

  // Dummy lead database
  const dummyLeads: Record<string, Lead[]> = {
    "Tech Startups": [
      { name: "Nairobi TechLabs Ltd", email: "contact@techlabs.co.ke", phone: "+254 711 092 811", loc: "Westlands, Nairobi" },
      { name: "Safaricom Ventures Hub", email: "hub@safaricom.co.ke", phone: "+254 722 000 112", loc: "Kilimani, Nairobi" },
      { name: "Kilimani Digital Solutions", email: "info@kilimanidigital.ke", phone: "+254 705 918 392", loc: "Hurlingham, Nairobi" },
      { name: "AfriCode Developers", email: "hello@africode.ke", phone: "+254 733 999 444", loc: "CBD, Nairobi" }
    ],
    "Hotels & Lodges": [
      { name: "Mara River Luxury Lodge", email: "booking@marariverlodge.co.ke", phone: "+254 799 101 202", loc: "Masai Mara, Narok" },
      { name: "Diani Beach Ocean Resort", email: "stay@dianioceanresort.com", phone: "+254 721 345 678", loc: "Diani, Kwale" },
      { name: "Grand Horizon Suites", email: "info@grandhorizon.co.ke", phone: "+254 701 444 888", loc: "Naivasha, Nakuru" },
      { name: "Savannah Plains Camp", email: "savannah@plains.co.ke", phone: "+254 733 111 222", loc: "Tsavo East, Taita" }
    ],
    "Salons & Barbers": [
      { name: "Elite Cuts Barbershop", email: "appointments@elitecuts.co.ke", phone: "+254 702 233 445", loc: "Lavington, Nairobi" },
      { name: "Afro-Chic Beauty Spa", email: "spa@afrochic.ke", phone: "+254 715 999 888", loc: "Nyali, Mombasa" },
      { name: "Nairobi Fade Masters", email: "info@fademasters.co.ke", phone: "+254 733 445 566", loc: "Kasarani, Nairobi" },
      { name: "Vintage Shave Parlor", email: "vintage@shaveparlor.ke", phone: "+254 799 555 444", loc: "Milimani, Kisumu" }
    ],
    "Real Estate": [
      { name: "Kilimani Heights Developers", email: "sales@kilimaniheights.co.ke", phone: "+254 703 111 222", loc: "Kilimani, Nairobi" },
      { name: "Nyali Luxury Villas", email: "villas@nyaliluxury.ke", phone: "+254 712 333 444", loc: "Nyali, Mombasa" },
      { name: "Naivasha Lakeside Estates", email: "info@lakesideestates.co.ke", phone: "+254 722 555 666", loc: "Naivasha, Nakuru" },
      { name: "Riat Hills Residences", email: "riathills@residences.ke", phone: "+254 733 777 888", loc: "Riat Hills, Kisumu" }
    ]
  };

  const templates: Record<string, string> = {
    mpesa: `Subject: Lipa na M-Pesa STK Integration Proposal

Habari,

I noticed your platform handles customer checkouts, but doesn't offer a direct Safaricom Lipa na M-Pesa STK Push dialog. Most customers in Kenya abandon cards. 

I can integrate M-Pesa checkout (C2B/B2C Daraja API) with instant STK Push prompts to reduce shopping cart abandonment. Let's arrange a short call.

Best,
Fred Otieno - Full Stack Developer`,
    webdev: `Subject: Full Stack Web Development Services

Dear Team,

I am Fred Otieno, a Full-Stack MERN Developer based in Nairobi. I build custom, responsive admin dashboards, API architectures, and sleek client-facing portals.

Let me know if you need assistance scaling your frontends or custom business platforms.

Regards,
Fred Otieno`,
    seo: `Subject: Free SEO & Web Performance Audit

Hello,

I ran a performance check on your domain. Your Lighthouse performance score has areas that can be optimized to load under 1.5 seconds. Faster speeds mean lower bounce rates.

I specialize in Next.js static optimizations and advanced CSS/HTML rendering. Let me send over a free audit sheet.

Sincerely,
Fred Otieno`
  };

  // Format uptime
  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h}h ${m}m ${s}s`;
  };

  // Lead scraping simulation handler
  const handleStartScrape = () => {
    setIsScrapeRunning(true);
    setScrapePercent(0);
    setScrapeConsole([`> Initializing scrape connection to Google Maps API...`]);

    const logs = [
      `Searching sectors matching '${sector}' in '${city}' location...`,
      "Connection established. HTTP Status: 200 OK",
      "Parsing target nodes...",
      "Retrieving contact cards...",
      "Decoding email envelopes...",
      "Scraping social media profiles...",
      "Removing duplicate leads...",
      "Saving results locally..."
    ];

    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress > 100) progress = 100;
      setScrapePercent(progress);

      const logIdx = Math.floor(progress / 15);
      if (logs[logIdx]) {
        setScrapeConsole(prev => {
          if (!prev.includes(`> ${logs[logIdx]}`)) {
            return [...prev, `> ${logs[logIdx]}`];
          }
          return prev;
        });
      }

      if (progress === 100) {
        clearInterval(interval);
        setIsScrapeRunning(false);
        const leads = dummyLeads[sector] || [];
        setScrapedLeads(leads);
      }
    }, 250);
  };

  // Email campaign simulator
  const handleStartEmails = () => {
    setIsEmailRunning(true);
    setEmailConsole([`> Loading campaign template details...`]);
    setEmailsSentCount(0);
    setEmailsSuccessRate(0);

    const targetList = scrapedLeads.length > 0 ? scrapedLeads : [
      { name: "Nairobi TechLabs Ltd", email: "contact@techlabs.co.ke", phone: "", loc: "" },
      { name: "Safaricom Ventures Hub", email: "hub@safaricom.co.ke", phone: "", loc: "" },
      { name: "Mara River Luxury Lodge", email: "booking@marariverlodge.co.ke", phone: "", loc: "" }
    ];

    let current = 0;
    let success = 0;

    const interval = setInterval(() => {
      if (current < targetList.length) {
        const item = targetList[current];
        const isSuccess = Math.random() > 0.15;
        if (isSuccess) success++;
        
        setEmailConsole(prev => [
          ...prev,
          `> Sending to: ${item.name} (${item.email})...`,
          isSuccess ? `  [SUCCESS] Email sent successfully.` : `  [ERROR] Delivery failed (Server response: 550 Mailbox not found).`
        ]);

        current++;
        setEmailsSentCount(current);
        setEmailsSuccessRate(Math.round((success / current) * 100));
      } else {
        clearInterval(interval);
        setIsEmailRunning(false);
        setEmailConsole(prev => [
          ...prev,
          `> Outreach Campaign Broadcast complete. Sent: ${current}, Delivered: ${success}`
        ]);
      }
    }, 550);
  };

  // M-Pesa STK Push handlers
  const handleTriggerStk = () => {
    if (!mpesaPhone || !mpesaAmount) {
      alert("Please enter a valid phone and amount.");
      return;
    }
    setIsPhoneModalOpen(true);
  };

  const handleCancelStk = () => {
    setIsPhoneModalOpen(false);
    setPhonePin("");

    const receipt = "RFH" + Math.floor(Math.random() * 900000 + 100000);
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    setMpesaLogs(prev => [
      {
        receipt,
        phone: `+254${mpesaPhone.slice(-9)}`,
        amount: parseFloat(mpesaAmount),
        message: "Request Cancelled by User",
        timestamp: date,
        status: "CANCELLED"
      },
      ...prev
    ]);
  };

  const handleSubmitStk = () => {
    if (phonePin.length !== 4) {
      alert("Please enter a 4-digit PIN.");
      return;
    }
    setIsPhoneModalOpen(false);
    setPhonePin("");

    const receipt = "RFH" + Math.floor(Math.random() * 900000 + 100000);
    const date = new Date().toISOString().slice(0, 19).replace("T", " ");

    setMpesaLogs(prev => [
      {
        receipt,
        phone: `+254${mpesaPhone.slice(-9)}`,
        amount: parseFloat(mpesaAmount),
        message: "Success Callback Received",
        timestamp: date,
        status: "SUCCESS"
      },
      ...prev
    ]);
  };

  // CLI Command processor
  const handleTerminalSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const cmd = terminalInput.trim();
      if (!cmd) return;

      setTerminalHistory(prev => [...prev, { type: "input", text: cmd }]);
      
      const response = processCommand(cmd);
      setTerminalHistory(prev => [...prev, { type: "response", text: response }]);
      setTerminalInput("");
    }
  };

  const processCommand = (cmdStr: string) => {
    const tokens = cmdStr.toLowerCase().split(" ");
    const primary = tokens[0];

    switch (primary) {
      case "help":
        return `Available System Commands:
- status: Print active bot modules and health diagnostics.
- scrape: Launch lead scraper simulation.
- email: Broadcast outreach campaign.
- mpesa: View Lipa na M-Pesa configurations.
- clear: Clear terminal buffer.
- about: Print developer background info.`;
      case "status":
        return `[MODULE HEALTH REPORT]
- Bot Core Status: ACTIVE
- CPU Core: ${cpu}%
- M-Pesa Gateway: CONNECTED
- Scraper Core: STANDBY
- Dispatcher: ONLINE`;
      case "scrape":
        setTimeout(() => {
          setActiveTab("scraper");
          handleStartScrape();
        }, 500);
        return "Redirecting to scraper workspace and launching process...";
      case "email":
        setTimeout(() => {
          setActiveTab("emailer");
          handleStartEmails();
        }, 500);
        return "Redirecting to email dispatcher workspace and starting outreach...";
      case "mpesa":
        setTimeout(() => setActiveTab("mpesa"), 500);
        return `Redirecting to M-Pesa sandbox portal...
Shortcode: 174379
Callback Endpoint: node-express-callback`;
      case "clear":
        setTimeout(() => {
          setTerminalHistory([
            { type: "system", text: "Welcome, root admin! Type 'help' to view all commands." }
          ]);
        }, 50);
        return "Clearing console buffer...";
      case "about":
        return `FredVA Bot Admin Suite.
Designed by Fred Otieno (Nairobi, Kenya).
Built using MERN Stack, Next.js, and Safaricom Daraja API integrations.`;
      default:
        return `Error: Command '${cmdStr}' not recognized. Type 'help' for support.`;
    }
  };

  // Get current leads counter
  const totalLeadsCount = 2482 + scrapedLeads.length;
  const totalMailsCount = 1820 + emailsSentCount;
  
  // Calculate total success revenue
  const totalRevenue = mpesaLogs
    .filter(log => log.status === "SUCCESS")
    .reduce((sum, log) => sum + log.amount, 34750);

  return (
    <div className="bg-velvet-950 text-gray-100 font-sans min-h-screen flex flex-col selection:bg-purple-500 selection:text-white overflow-x-hidden">
      <Head>
        <title>FredVA Admin Dashboard - Bot Control Suite</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      {/* Top Bar Notice */}
      <div className="bg-gradient-to-r from-purple-900 to-velvet-800 text-center py-2 px-4 border-b border-purple-500/20 text-xs md:text-sm font-medium z-50 flex justify-between items-center shrink-0">
        <div class="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 status-active-pulse"></span>
          <span className="text-purple-200">
            FredVA Node: <strong className="text-white">Active (v4.2.1-Nairobi)</strong>
          </span>
        </div>
        <div className="hidden md:block text-purple-300">
          <span>Uptime: <strong className="text-solar text-xs font-mono">{formatUptime(uptime)}</strong></span>
        </div>
        <div className="text-purple-200 text-xs md:text-sm">
          <i className="far fa-clock text-solar mr-1"></i> Nairobi, KE: <span className="font-mono">{nairobiTime}</span>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 bg-velvet-900 border-r border-purple-900/40 p-5 flex flex-col justify-between shrink-0">
          <div>
            {/* Brand logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-solar flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-purple-500/20">
                F
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  FredVA <span className="text-solar text-xs font-mono px-1.5 py-0.5 rounded bg-solar/10 border border-solar/20">BOT</span>
                </h1>
                <p class="text-xs text-gray-400">Virtual Assistant Admin</p>
              </div>
            </div>

            {/* Nav list */}
            <nav className="space-y-1">
              <button
                onClick={() => switchTab("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-4 ${
                  activeTab === "overview"
                    ? "bg-purple-500/10 text-white border-purple-500 shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                <i className="fas fa-chart-pie text-purple-400 text-base w-5 text-center"></i>
                <span>Dashboard Overview</span>
              </button>
              <button
                onClick={() => switchTab("scraper")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-4 ${
                  activeTab === "scraper"
                    ? "bg-purple-500/10 text-white border-purple-500 shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                <i className="fas fa-spider text-gray-400 text-base w-5 text-center"></i>
                <span>Lead Scraper</span>
              </button>
              <button
                onClick={() => switchTab("emailer")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-4 ${
                  activeTab === "emailer"
                    ? "bg-purple-500/10 text-white border-purple-500 shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                <i className="fas fa-paper-plane text-gray-400 text-base w-5 text-center"></i>
                <span>Email Dispatcher</span>
              </button>
              <button
                onClick={() => switchTab("mpesa")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-4 ${
                  activeTab === "mpesa"
                    ? "bg-purple-500/10 text-white border-purple-500 shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                <i className="fas fa-wallet text-gray-400 text-base w-5 text-center"></i>
                <span>M-Pesa STK Audit</span>
              </button>
              <button
                onClick={() => switchTab("terminal")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-4 ${
                  activeTab === "terminal"
                    ? "bg-purple-500/10 text-white border-purple-500 shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-white/5 border-transparent"
                }`}
              >
                <i className="fas fa-terminal text-gray-400 text-base w-5 text-center"></i>
                <span>Terminal Console</span>
              </button>
            </nav>
          </div>

          {/* Profile Widget */}
          <div className="mt-8 pt-5 border-t border-purple-950/60">
            <div className="bg-velvet-950/80 border border-purple-500/10 rounded-xl p-3.5 flex items-center gap-3">
              <img
                src="https://github.com/Fred4377.png"
                alt="Fred Otieno"
                className="w-10 h-10 rounded-full border-2 border-solar/40 object-cover"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">Fred Otieno</p>
                <p className="text-xs text-purple-400 truncate">Lead Developer</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Workspace content */}
        <main className="flex-grow p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 velvet-glow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-purple-300">Bot Status</span>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded border border-emerald-500/20">
                      LIVE
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">Active</h3>
                  <p class="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                    Tasks: 18 executed today
                  </p>
                </div>

                <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 velvet-glow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-purple-300">Leads Generated</span>
                    <span className="text-solar text-lg"><i className="fas fa-spider"></i></span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{totalLeadsCount.toLocaleString()}</h3>
                  <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <span className="text-emerald-400"><i class="fas fa-arrow-up"></i> +142</span>
                    than yesterday
                  </p>
                </div>

                <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 velvet-glow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-purple-300">Campaign Outreach</span>
                    <span className="text-purple-400 text-lg"><i className="fas fa-paper-plane"></i></span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">{totalMailsCount.toLocaleString()}</h3>
                  <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <span className="text-purple-400 font-semibold">82.4%</span> delivery success rate
                  </p>
                </div>

                <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 solar-glow border-solar/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-solar font-bold">VA Revenue (M-Pesa)</span>
                    <span className="text-solar text-lg"><i className="fas fa-coins"></i></span>
                  </div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">KSh {totalRevenue.toLocaleString()}</h3>
                  <p class="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <span className="text-solar font-semibold">12</span> local clients this month
                  </p>
                </div>
              </div>

              {/* Mid-Row grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center border-b border-purple-950/60 pb-3">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <i className="fas fa-tasks text-solar"></i>
                      VA Weekly Tasks Performance
                    </h2>
                    <span className="text-xs text-gray-400">June 2026</span>
                  </div>

                  {/* Chart representation */}
                  <div className="h-48 flex items-end justify-between pt-4 px-2 border-b border-purple-950/60 pb-2">
                    <div className="flex flex-col items-center gap-2 w-10">
                      <div className="w-full bg-gradient-to-t from-purple-900 to-purple-600 rounded-md" style={{ height: "60px" }}></div>
                      <span className="text-xs font-mono text-gray-400">Mon</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-10">
                      <div className="w-full bg-gradient-to-t from-purple-900 to-purple-600 rounded-md" style={{ height: "90px" }}></div>
                      <span className="text-xs font-mono text-gray-400">Tue</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-10">
                      <div className="w-full bg-gradient-to-t from-purple-900 to-purple-500 rounded-md" style={{ height: "120px" }}></div>
                      <span className="text-xs font-mono text-gray-400">Wed</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-10">
                      <div className="w-full bg-gradient-to-t from-purple-900 to-purple-500 rounded-md" style={{ height: "80px" }}></div>
                      <span className="text-xs font-mono text-gray-400">Thu</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-10">
                      <div className="w-full bg-gradient-to-t from-purple-900 to-solar rounded-md relative group" style={{ height: "150px" }}>
                        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-solar text-velvet-950 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Peak
                        </span>
                      </div>
                      <span className="text-xs font-mono text-solar font-bold">Fri</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-10">
                      <div className="w-full bg-gradient-to-t from-purple-900 to-purple-600 rounded-md" style={{ height: "45px" }}></div>
                      <span className="text-xs font-mono text-gray-400">Sat</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-10">
                      <div className="w-full bg-gradient-to-t from-purple-900 to-purple-600 rounded-md" style={{ height: "30px" }}></div>
                      <span className="text-xs font-mono text-gray-400">Sun</span>
                    </div>
                  </div>

                  {/* Active tasks list */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Scheduled Bot Routines</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-velvet-950 border border-purple-950/60 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">Nairobi Lead Refresh</p>
                          <p className="text-xs text-gray-400">Scrapes startups daily at 08:00</p>
                        </div>
                        <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded">
                          READY
                        </span>
                      </div>
                      <div className="bg-velvet-950 border border-purple-950/60 rounded-xl p-3.5 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white">Cold Email Campaign B</p>
                          <p className="text-xs text-gray-400">Follow-up series to hospitality leads</p>
                        </div>
                        <span className="text-solar text-xs font-bold bg-solar/10 px-2 py-0.5 border border-solar/20 rounded">
                          PENDING
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 space-y-4">
                  <div className="border-b border-purple-950/60 pb-3">
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <i className="fas fa-heartbeat text-purple-400"></i>
                      Bot Core Diagnostics
                    </h2>
                  </div>

                  {/* Diagnostic metrics */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-gray-400">CPU Usage</span>
                        <span className="text-white">{cpu}%</span>
                      </div>
                      <div className="w-full bg-purple-950/60 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-solar h-2 rounded-full transition-all duration-500"
                          style={{ width: `${cpu}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-gray-400">Memory Allocation</span>
                        <span className="text-white">{mem}MB / 512MB</span>
                      </div>
                      <div className="w-full bg-purple-950/60 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(mem / 512) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-gray-400">Network Ping (Safaricom)</span>
                        <span className="text-emerald-400">14 ms</span>
                      </div>
                      <div className="w-full bg-purple-950/60 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-solar/10 border border-solar/20 rounded-xl p-4 space-y-2 mt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-solar uppercase tracking-wide">
                      <i className="fas fa-sticky-note"></i>
                      <span>Developer Notes</span>
                    </div>
                    <p className="text-xs text-amber-100 leading-relaxed italic font-medium">
                      "Safaricom M-Pesa STK sandbox has been flaky. Added custom validation helper for phone inputs. Syncing database backup with portfolio updates tonight."
                    </p>
                  </div>
                </div>
              </div>

              {/* Feed logs */}
              <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-purple-950/60 pb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <i className="fas fa-stream text-solar"></i>
                    Live Bot Activity Log
                  </h2>
                  <span className="text-xs font-mono bg-purple-500/10 px-2 py-0.5 border border-purple-500/20 text-purple-300 rounded">
                    Auto-updating
                  </span>
                </div>
                <div
                  ref={activityFeedRef}
                  className="space-y-3 max-h-56 overflow-y-auto pr-1 font-mono text-xs text-gray-300"
                >
                  <div className="flex items-start gap-3 py-1 border-b border-purple-950/30 last:border-0">
                    <span className="text-gray-500">12:34:10</span>
                    <span className="text-purple-400 font-semibold">[SYSTEM]</span>
                    <span>CRON: Scheduled lead validation complete. 0 invalid contacts cleaned.</span>
                  </div>
                  <div className="flex items-start gap-3 py-1 border-b border-purple-950/30 last:border-0">
                    <span className="text-gray-500">12:30:15</span>
                    <span className="text-solar font-semibold">[MPESA]</span>
                    <span>PAYMENT: STK push request completed. KSh 2,500 received from +254712***840 (Maina K.).</span>
                  </div>
                  <div className="flex items-start gap-3 py-1 border-b border-purple-950/30 last:border-0">
                    <span className="text-gray-500">12:28:40</span>
                    <span className="text-emerald-400 font-semibold">[DISPATCH]</span>
                    <span>EMAIL: Cold template 'M-Pesa Integration Proposal' sent to info@nairobispares.co.ke.</span>
                  </div>
                  <div className="flex items-start gap-3 py-1 border-b border-purple-950/30 last:border-0">
                    <span className="text-gray-500">12:15:02</span>
                    <span className="text-purple-400 font-semibold">[SYSTEM]</span>
                    <span>DATABASE: Backup synchronized successfully to S3 bucket.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: LEAD SCRAPER */}
          {activeTab === "scraper" && (
            <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 space-y-6">
              <div className="border-b border-purple-950/60 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <i className="fas fa-spider text-solar"></i>
                  Lead Scraper Configuration & Engine
                </h2>
                <p className="text-xs text-gray-400 mt-1">Configure parameters to scrape local business leads across Kenya</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Target Sector</label>
                  <select
                    value={sector}
                    onChange={e => setSector(e.target.value)}
                    className="w-full bg-velvet-950 border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-solar transition-colors"
                  >
                    <option value="Tech Startups">Tech Startups & Agencies</option>
                    <option value="Hotels & Lodges">Hotels & Safari Lodges</option>
                    <option value="Salons & Barbers">Beauty Salons & Barbershops</option>
                    <option value="Real Estate">Real Estate Developers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Location/City</label>
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-velvet-950 border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-solar transition-colors"
                  >
                    <option value="Nairobi">Nairobi County (CBD, Kilimani, Westlands)</option>
                    <option value="Mombasa">Mombasa County (Nyali, Bamburi)</option>
                    <option value="Kisumu">Kisumu County (Milimani, Riat)</option>
                    <option value="Eldoret">Uasin Gishu (Eldoret Town)</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleStartScrape}
                    disabled={isScrapeRunning}
                    className={`w-full bg-gradient-to-r from-purple-600 to-solar text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/15 ${
                      isScrapeRunning ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <i className="fas fa-play"></i> Launch Scrape Engine
                  </button>
                </div>
              </div>

              {/* Progress Console */}
              {isScrapeRunning && (
                <div className="bg-velvet-950 border border-purple-900/20 rounded-xl p-5 space-y-3">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-purple-300">Running Scraper Daemon...</span>
                    <span className="text-solar font-bold">{scrapePercent}%</span>
                  </div>
                  <div className="w-full bg-purple-950 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-solar h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${scrapePercent}%` }}
                    ></div>
                  </div>
                  <div className="h-24 bg-black/40 border border-purple-950 rounded-lg p-3 overflow-y-auto font-mono text-[11px] text-gray-400 space-y-1">
                    {scrapeConsole.map((log, i) => (
                      <div key={i} className="text-gray-300">{log}</div>
                    ))}
                    <div ref={scrapeConsoleEndRef} />
                  </div>
                </div>
              )}

              {/* Scrape results table */}
              {scrapedLeads.length > 0 && !isScrapeRunning && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>Scraped Contacts Results ({scrapedLeads.length} leads found)</span>
                    <button
                      onClick={() => setScrapedLeads([])}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <i className="fas fa-trash-alt"></i> Clear Leads
                    </button>
                  </h3>
                  <div className="overflow-x-auto border border-purple-900/20 rounded-xl">
                    <table className="w-full border-collapse text-left text-xs md:text-sm">
                      <thead>
                        <tr className="bg-purple-950/40 border-b border-purple-900/20 text-purple-300 font-bold">
                          <th className="p-4">Company Name</th>
                          <th className="p-4">Industry Sector</th>
                          <th className="p-4">Contact Email</th>
                          <th className="p-4">Phone Number</th>
                          <th className="p-4">Location</th>
                          <th className="p-4 text-center font-bold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-purple-950/30">
                        {scrapedLeads.map((lead, idx) => (
                          <tr key={idx} className="hover:bg-purple-950/20 transition-colors">
                            <td className="p-4 font-bold text-white">{lead.name}</td>
                            <td className="p-4 text-purple-300">{sector}</td>
                            <td className="p-4 font-mono text-gray-300">{lead.email}</td>
                            <td className="p-4 font-mono text-gray-400">{lead.phone}</td>
                            <td className="p-4 text-gray-400">{lead.loc}</td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => {
                                  setActiveTab("emailer");
                                  setEmailConsole([
                                    `> Direct broadcast request triggered:`,
                                    `> Recipient: ${lead.name} (${lead.email})`,
                                    `> Press 'Launch Outreach Campaign' to dispatch pitch.`
                                  ]);
                                }}
                                className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded transition-colors"
                              >
                                <i className="far fa-envelope"></i> Pitch
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: EMAIL DISPATCHER */}
          {activeTab === "emailer" && (
            <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 space-y-6">
              <div className="border-b border-purple-950/60 pb-3">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <i className="fas fa-paper-plane text-solar"></i>
                  Cold Outreach Dispatcher System
                </h2>
                <p className="text-xs text-gray-400 mt-1">Select templates and broadcast cold intro emails to prospects</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">
                      Outreach Campaign Template
                    </label>
                    <select
                      value={emailTemplate}
                      onChange={e => setEmailTemplate(e.target.value)}
                      className="w-full bg-velvet-950 border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-solar transition-colors"
                    >
                      <option value="mpesa">Lipa na M-Pesa STK Integration Pitch</option>
                      <option value="webdev">Full Stack Web Development Pitch</option>
                      <option value="seo">SEO & Performance Audit Package</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Template Preview</label>
                    <div className="bg-velvet-950 border border-purple-900/20 rounded-xl p-4 font-mono text-xs text-gray-300 space-y-2 h-44 overflow-y-auto whitespace-pre-line">
                      {templates[emailTemplate]}
                    </div>
                  </div>

                  <button
                    onClick={handleStartEmails}
                    disabled={isEmailRunning}
                    className={`w-full bg-gradient-to-r from-purple-600 to-solar text-white font-bold py-3 px-6 rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/15 ${
                      isEmailRunning ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <i className="fas fa-broadcast-tower"></i> Launch Outreach Campaign
                  </button>
                </div>

                <div className="bg-velvet-950 border border-purple-900/20 rounded-xl p-5 flex flex-col justify-between min-h-[300px]">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider border-b border-purple-950 pb-2">
                      Campaign Broadcast Console
                    </h3>
                    <div className="h-44 bg-black/40 border border-purple-950 rounded-lg p-3 overflow-y-auto font-mono text-[11px] text-gray-400 space-y-1">
                      {emailConsole.map((log, idx) => {
                        let cl = "text-gray-400";
                        if (log.includes("[SUCCESS]")) cl = "text-emerald-400";
                        if (log.includes("[ERROR]")) cl = "text-red-400";
                        if (log.includes("broadcast")) cl = "text-solar";
                        return (
                          <div key={idx} className={cl}>
                            {log}
                          </div>
                        );
                      })}
                      <div ref={emailConsoleEndRef} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 border-t border-purple-950 pt-4 text-center shrink-0">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mails Sent</span>
                      <span className="text-xl font-bold text-white font-mono">{emailsSentCount}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider">Success Rate</span>
                      <span className="text-xl font-bold text-emerald-400 font-mono">{emailsSuccessRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: M-PESA STK AUDIT */}
          {activeTab === "mpesa" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 space-y-6 velvet-glow">
                  <div className="border-b border-purple-950/60 pb-3 flex justify-between items-center">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <i className="fas fa-wallet text-solar"></i>
                        M-Pesa STK Integration Sandbox
                      </h2>
                      <p className="text-xs text-gray-400">Trigger STK pushes to simulate client fee collections</p>
                    </div>
                    <span className="text-[10px] font-bold bg-solar/10 text-solar border border-solar/20 px-2 py-0.5 rounded uppercase font-mono">
                      Daraja API
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={mpesaPhone}
                        onChange={e => setMpesaPhone(e.target.value)}
                        className="w-full bg-velvet-950 border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-solar font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-purple-300 uppercase tracking-wider mb-2">Amount (KSh)</label>
                      <input
                        type="number"
                        value={mpesaAmount}
                        onChange={e => setMpesaAmount(e.target.value)}
                        className="w-full bg-velvet-950 border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-solar font-mono"
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={handleTriggerStk}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/30"
                      >
                        <i className="fas fa-mobile-alt"></i> Push STK Dialog
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider border-b border-purple-950 pb-2">
                    M-Pesa Gateway Config
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shortcode Status:</span>
                      <span className="text-emerald-400 font-bold">174379 (Active)</span>
                    </div>
                    <div className="flex justify-between">
                      <span class="text-gray-400">CallBack URL:</span>
                      <span className="text-white font-mono">/api/mpesa/callback</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Auth Token:</span>
                      <span className="text-solar font-mono">Bearer oauth_active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* logs table */}
              <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 space-y-4">
                <h2 className="text-base font-bold text-white border-b border-purple-950 pb-3 flex items-center justify-between">
                  <span>Lipa na M-Pesa STK Transaction Logs</span>
                  <span className="text-xs font-mono text-gray-400">Latest audits</span>
                </h2>

                <div className="overflow-x-auto border border-purple-900/20 rounded-xl">
                  <table className="w-full border-collapse text-left text-xs md:text-sm">
                    <thead>
                      <tr className="bg-purple-950/40 border-b border-purple-900/20 text-purple-300 font-bold">
                        <th className="p-4">Receipt Number</th>
                        <th className="p-4">Client Number</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Callback Status</th>
                        <th class="p-4">Timestamp (EAT)</th>
                        <th className="p-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-950/30">
                      {mpesaLogs.map((log, idx) => (
                        <tr key={idx} className="hover:bg-purple-950/20 transition-colors">
                          <td className="p-4 font-mono font-bold text-solar">{log.receipt}</td>
                          <td className="p-4 font-mono">{log.phone}</td>
                          <td className="p-4 font-mono text-white">KSh {log.amount.toLocaleString()}.00</td>
                          <td className="p-4 font-mono text-xs text-gray-400">{log.message}</td>
                          <td className="p-4 text-gray-400 font-mono">{log.timestamp}</td>
                          <td className="p-4 text-center">
                            <span
                              className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                                log.status === "SUCCESS"
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : log.status === "PENDING"
                                  ? "bg-solar/10 text-solar border-solar/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TERMINAL CONSOLE */}
          {activeTab === "terminal" && (
            <div className="bg-velvet-900 border border-purple-900/30 rounded-2xl p-5 space-y-4 velvet-glow">
              <div className="border-b border-purple-950/60 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <i className="fas fa-terminal text-solar"></i>
                    FredVA Retro Terminal Interface
                  </h2>
                  <p className="text-xs text-gray-400 font-medium">Direct SSH Bot administration panel. Type commands below.</p>
                </div>
                <span className="text-xs font-mono text-solar font-bold">root@fredva:~#</span>
              </div>

              <div className="bg-black/80 rounded-xl p-5 border border-purple-900/30 font-mono text-xs text-green-400 h-96 flex flex-col justify-between overflow-hidden shadow-inner">
                <div className="overflow-y-auto flex-grow pr-2 space-y-2">
                  {terminalHistory.map((item, idx) => {
                    if (item.type === "input") {
                      return (
                        <div key={idx} className="flex gap-2">
                          <span className="text-solar font-bold">fredva@admin:~$</span>
                          <span className="text-white">{item.text}</span>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={idx}
                        className={item.type === "system" ? "text-gray-400" : "text-gray-300 whitespace-pre-line"}
                      >
                        {item.text}
                      </div>
                    );
                  })}
                  <div ref={terminalEndRef} />
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-purple-900/20">
                  <span className="text-solar font-bold shrink-0">fredva@admin:~$</span>
                  <input
                    type="text"
                    value={terminalInput === "type a command..." ? "" : terminalInput}
                    onChange={e => setTerminalInput(e.target.value)}
                    onKeyDown={handleTerminalSubmit}
                    onFocus={() => {
                      if (terminalInput === "type a command...") setTerminalInput("");
                    }}
                    onBlur={() => {
                      if (terminalInput === "") setTerminalInput("type a command...");
                    }}
                    className="flex-grow bg-transparent border-none text-green-400 focus:outline-none font-mono text-xs w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hiring Banner footer */}
          <footer className="bg-gradient-to-r from-purple-950/40 via-velvet-900 to-purple-950/40 border border-purple-900/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shrink-0">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <span>Fred Otieno</span>
                <span className="text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                  Freelance & Contract
                </span>
              </h3>
              <p className="text-sm text-gray-400 max-w-lg leading-relaxed">
                Looking for a professional Full-Stack Developer to build your MERN dashboards, customize local M-Pesa portals, or manage robust bot automation? Let's connect!
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 shrink-0">
              <a
                href="https://github.com/Fred4377"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-lg border border-purple-900/40 bg-purple-500/5 text-white font-semibold text-xs hover:bg-white/5 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <i className="fab fa-github text-solar text-sm"></i> GitHub Profile
              </a>
              <a
                href="mailto:fredvirtualassistant040@gmail.com"
                className="px-4 py-2.5 rounded-lg bg-solar text-velvet-950 font-bold text-xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <i className="far fa-envelope text-sm"></i> Hire Me Now
              </a>
            </div>
          </footer>
        </main>
      </div>

      {/* Simulated Phone Pop-up modal */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-filter backdrop-blur-sm flex items-center justify-center z-[99999] transition-opacity duration-300">
          <div className="bg-velvet-900 border border-purple-800/40 rounded-[40px] p-6 w-80 shadow-2xl relative">
            <div className="w-32 h-6 bg-black rounded-b-2xl mx-auto -mt-6 mb-8 border border-purple-800/20"></div>

            <div className="bg-black border border-purple-950/60 rounded-3xl p-5 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
              <img
                src="https://github.com/Fred4377.png"
                alt="M-Pesa Icon"
                className="w-16 h-16 rounded-full border-2 border-solar/40 shadow-lg object-cover"
              />

              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white">Lipa na M-Pesa STK</h3>
                <p className="text-xs text-gray-400">FredVA Bot Services Sandbox</p>
              </div>

              <div className="bg-velvet-950/90 border border-purple-900/20 p-3.5 rounded-xl w-full">
                <p className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Amount to Pay</p>
                <p className="text-xl font-bold text-white font-mono mt-1">
                  KSh {parseFloat(mpesaAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="w-full space-y-2">
                <p className="text-[10px] text-solar font-medium leading-relaxed">
                  <span className="inline-block animate-bounce"><i className="fas fa-fingerprint text-lg"></i></span>
                  <br />
                  Enter PIN on your Safaricom line +254712***678
                </p>
                <input
                  type="password"
                  value={phonePin}
                  onChange={e => setPhonePin(e.target.value)}
                  placeholder="••••"
                  maxLength={4}
                  className="w-24 bg-velvet-950 border border-purple-900/40 text-center text-white py-2 rounded-lg text-lg tracking-widest focus:outline-none focus:border-solar font-mono"
                />
              </div>

              <div className="flex gap-3 w-full pt-2">
                <button
                  onClick={handleCancelStk}
                  className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-2 rounded-xl text-xs hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitStk}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs shadow-lg transition-colors"
                >
                  Submit PIN
                </button>
              </div>
            </div>

            <div className="w-24 h-1 bg-purple-900/40 rounded-full mx-auto mt-6"></div>
          </div>
        </div>
      )}
    </div>
  );
}
