type CardTag = { label: string; cls: string };

type BoardCard = {
  id: string;
  title: string;
  tag: CardTag | null;
  avatar?: string;
  avatars?: string[];
  check?: string;
};

type BoardColumn = {
  name: string;
  count: string;
  cards: BoardCard[];
};

const columns: BoardColumn[] = [
  { name: "Backlog", count: "3 cards", cards: [
    { id: "FB-129", title: "Refactor Auth Flow", tag: { label: "Electric Blue", cls: "bg-tag-electric" }, avatar: "https://i.pravatar.cc/60?img=5" },
    { id: "FB-130", title: "Finalize UI Kit for Settings", tag: { label: "Medium", cls: "bg-tag-medium" }, avatar: "https://i.pravatar.cc/60?img=8" },
    { id: "FB-131", title: "Improve Onboarding Experience", tag: { label: "Low", cls: "bg-tag-low" } },
  ]},
  { name: "Todo", count: "2 cards", cards: [
    { id: "FB-132", title: "Dashboard Redesign", tag: { label: "Design", cls: "bg-tag-design" }, avatars: ["https://i.pravatar.cc/60?img=9", "https://i.pravatar.cc/60?img=10"] },
    { id: "FB-133", title: "Implement Notifications", tag: null, avatar: "https://i.pravatar.cc/60?img=11", check: "☑ 2/5" },
  ]},
  { name: "In Progress", count: "3 cards", cards: [
    { id: "FB-134", title: "API Rate Limiting", tag: { label: "High", cls: "bg-tag-high" }, avatar: "https://i.pravatar.cc/60?img=13", check: "☑ 2/3" },
    { id: "FB-135", title: "Add Activity Timeline", tag: { label: "Medium", cls: "bg-tag-medium" }, avatar: "https://i.pravatar.cc/60?img=14", check: "☑ 1/4" },
    { id: "FB-136", title: "File Attachments", tag: { label: "Low", cls: "bg-tag-low" }, avatar: "https://i.pravatar.cc/60?img=16", check: "☑ 0/3" },
  ]},
  { name: "Review", count: "2 cards", cards: [
    { id: "FB-137", title: "Mobile Responsiveness", tag: { label: "Design", cls: "bg-tag-design" }, avatars: ["https://i.pravatar.cc/60?img=18", "https://i.pravatar.cc/60?img=19"], check: "☑ 2/2" },
    { id: "FB-138", title: "Performance Optimization", tag: { label: "High", cls: "bg-tag-high" }, avatar: "https://i.pravatar.cc/60?img=20", check: "☑ 1/3" },
  ]},
  { name: "Done", count: "2 cards", cards: [
    { id: "FB-139", title: "Seed Data", tag: { label: "Low", cls: "bg-tag-low" }, avatar: "https://i.pravatar.cc/60?img=21" },
    { id: "FB-140", title: "Fix Board Actions", tag: { label: "Low", cls: "bg-tag-low" } },
  ]},
];

export default function Home() {
  return (
    <div className="relative min-h-screen bg-bg overflow-x-hidden">
      <div
        className="pointer-events-none fixed top-[-120px] right-[-220px] w-[1100px] h-[1100px] z-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(63,90,255,0.30), rgba(63,90,255,0.10) 40%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />
      <div
        className="pointer-events-none fixed top-[260px] left-[-260px] w-[700px] h-[700px] z-0"
        style={{ background: "radial-gradient(circle, rgba(63,90,255,0.10), transparent 70%)" }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.35) 0, transparent 40%)," +
            "radial-gradient(1px 1px at 70% 15%, rgba(255,255,255,0.25) 0, transparent 40%)," +
            "radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,0.2) 0, transparent 40%)," +
            "radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.2) 0, transparent 40%)," +
            "radial-gradient(1px 1px at 60% 45%, rgba(255,255,255,0.15) 0, transparent 40%)",
        }}
      />

      <div className="relative z-[2] max-w-[1440px] mx-auto px-16 max-lg:px-7">

        <nav className="flex items-center justify-between py-[30px]">
          <div className="flex items-center gap-[10px] font-extrabold text-[19px] -tracking-[0.01em]">
            <span className="flex items-center justify-center w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-primary-2 to-[#3549d1] shadow-[0_4px_14px_rgba(79,107,255,0.45)]">
              <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                <path d="M4 4h16M4 12h11M4 20h7" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
              </svg>
            </span>
            FlowBoard
          </div>

          <div className="flex items-center gap-10 max-lg:hidden">
            <a href="#" className="text-[14.5px] text-[#cfd2dc] font-medium hover:text-white transition-colors duration-150">Features</a>
            <a href="#" className="text-[14.5px] text-[#cfd2dc] font-medium hover:text-white transition-colors duration-150">Pricing</a>
            <a href="#" className="text-[14.5px] text-[#cfd2dc] font-medium hover:text-white transition-colors duration-150">Docs</a>
            <a href="#" className="text-[14.5px] text-[#cfd2dc] font-medium hover:text-white transition-colors duration-150">Changelog</a>
          </div>

          <div className="flex items-center gap-[26px]">
            <a href="#" className="text-[14.5px] font-medium text-[#cfd2dc] hover:text-white transition-colors duration-150">Log in</a>
            <button className="inline-flex items-center gap-2 font-semibold text-[14.5px] px-5 py-[11px] rounded-[10px] border-none cursor-pointer bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] text-white shadow-[0_6px_20px_rgba(63,90,255,0.35)] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(63,90,255,0.5)] transition-all duration-150">
              Start for free
              <svg viewBox="0 0 24 24" fill="none" className="w-[15px] h-[15px]">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </nav>


        <section className="grid grid-cols-[1fr_1.28fr] gap-10 items-center py-[60px] pb-10 max-lg:grid-cols-1">
          <div>
            <div className="inline-flex items-center gap-[10px] px-2 py-[7px] rounded-full bg-white/[0.04] border border-line text-[13.5px] text-[#d7d9e2] mb-7">
              <span className="bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] text-white font-bold text-[11.5px] px-[10px] py-[3px] rounded-[12px] tracking-[0.02em]">New</span>
              Real-time collaboration is here
              <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3 opacity-70">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 className="text-[58px] leading-[1.08] font-extrabold -tracking-[0.02em] text-white mb-[22px] max-lg:text-[44px]">
              Organize work.<br />Ship products <span className="bg-gradient-to-r from-[#7f97ff] to-primary bg-clip-text text-transparent">faster.</span>
            </h1>

            <p className="text-[16.5px] leading-[1.65] text-muted max-w-[440px] mb-[34px]">
              FlowBoard combines project management, real-time collaboration and smart automation into a beautiful Kanban platform for modern teams.
            </p>

            <div className="flex gap-[14px] mb-[56px]">
              <button className="inline-flex items-center gap-2 font-semibold text-[14.5px] px-5 py-[11px] rounded-[10px] border-none cursor-pointer bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] text-white shadow-[0_6px_20px_rgba(63,90,255,0.35)] hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(63,90,255,0.5)] transition-all duration-150">
                Start for free
                <svg viewBox="0 0 24 24" fill="none" className="w-[15px] h-[15px]">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button className="inline-flex items-center gap-2 font-semibold text-[14.5px] px-5 py-[11px] rounded-[10px] cursor-pointer bg-white/[0.03] text-foreground border border-line hover:bg-white/[0.06] transition-all duration-150">
                Live Demo
                <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px]">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
                </svg>
              </button>
            </div>

            <div className="flex gap-[34px] max-lg:flex-col max-lg:gap-6">
              <div className="max-w-[165px]">
                <div className="w-[38px] h-[38px] rounded-[10px] bg-white/[0.04] border border-line flex items-center justify-center mb-[14px] text-[#9fb0ff]">
                  <svg viewBox="0 0 24 24" fill="none" className="w-[17px] h-[17px]">
                    <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M3 9h18M9 9v11" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </div>
                <h4 className="text-[14.5px] font-semibold mb-[6px] text-foreground">Unlimited Boards</h4>
                <p className="text-[13px] leading-[1.5] text-muted-foreground">Create and manage as many as you need</p>
              </div>
              <div className="max-w-[165px]">
                <div className="w-[38px] h-[38px] rounded-[10px] bg-white/[0.04] border border-line flex items-center justify-center mb-[14px] text-[#9fb0ff]">
                  <svg viewBox="0 0 24 24" fill="none" className="w-[17px] h-[17px]">
                    <circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M16 8.5a3 3 0 100-6 3 3 0 000 6zM21.5 20c0-2.9-2.1-5.3-4.9-5.9" stroke="currentColor" strokeWidth="1.7" />
                  </svg>
                </div>
                <h4 className="text-[14.5px] font-semibold mb-[6px] text-foreground">Real-time Collaboration</h4>
                <p className="text-[13px] leading-[1.5] text-muted-foreground">Work together with your team, instantly</p>
              </div>
              <div className="max-w-[165px]">
                <div className="w-[38px] h-[38px] rounded-[10px] bg-white/[0.04] border border-line flex items-center justify-center mb-[14px] text-[#9fb0ff]">
                  <svg viewBox="0 0 24 24" fill="none" className="w-[17px] h-[17px]">
                    <path d="M12 3a5 5 0 00-5 5v3.5c0 .8-.3 1.6-.9 2.2L4.5 15.5A1 1 0 005.2 17h13.6a1 1 0 00.7-1.7l-1.6-1.8a3 3 0 01-.9-2.2V8a5 5 0 00-5-5z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M9.5 20a2.5 2.5 0 005 0" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
                <h4 className="text-[14.5px] font-semibold mb-[6px] text-foreground">Smart Notifications</h4>
                <p className="text-[13px] leading-[1.5] text-muted-foreground">Stay updated with what matters most</p>
              </div>
            </div>
          </div>

          <div className="relative h-[620px] max-lg:hidden">
            <div className="animate-float absolute top-[30px] -left-[10px] w-[300px] bg-panel-2 border border-line rounded-[14px] px-4 py-[14px] flex gap-3 items-start shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-[5]">
              <span className="absolute top-4 right-[14px] w-[7px] h-[7px] rounded-full bg-[#5b7bff]" />
              <div className="w-[34px] h-[34px] rounded-full flex-shrink-0 bg-cover bg-center border border-white/10" style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=47')" }} />
              <div className="text-[13px] leading-[1.45]">
                <b className="text-white font-semibold">Danen Saana</b> commented
                <span className="block text-muted-foreground mt-[2px] text-[12px]">on Finalize UI Kit for Settings</span>
                <span className="block text-muted-foreground mt-[6px] text-[12px]">2m ago</span>
              </div>
            </div>

            <div className="absolute top-14 right-[10px] flex items-center bg-panel-2 border border-line rounded-[30px] p-[6px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] z-[5]">
              <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-panel-2 -ml-[10px] first:ml-0 relative" style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=32')" }} />
              <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-panel-2 -ml-[10px] first:ml-0" style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=12')" }} />
              <div className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-panel-2 -ml-[10px] first:ml-0 relative" style={{ backgroundImage: "url('https://i.pravatar.cc/80?img=15')" }}>
                <span className="absolute -bottom-0.5 right-0.5 w-[9px] h-[9px] rounded-full bg-success border-2 border-panel-2" />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#1c2030] border-2 border-panel-2 -ml-[10px] first:ml-0 flex items-center justify-center text-[12px] font-semibold text-[#c9cce0]">+3</div>
            </div>

            <svg className="absolute top-[92px] right-[90px] w-[60px] h-[60px] text-primary opacity-60 z-[4]" viewBox="0 0 60 60" fill="none">
              <path d="M50 6C42 6 20 14 12 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" />
              <path d="M6 34L11 44L20 40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="absolute top-[105px] left-[55px] right-[-40px] bottom-0" style={{ perspective: "2200px" }}>
              <div className="relative h-full bg-gradient-to-br from-panel-2 to-[#0c0e16] border border-white/[0.09] rounded-[18px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.02)] flex overflow-hidden" style={{ transform: "rotateY(-9deg) rotateX(3deg)" }}>
                <div className="w-[190px] flex-shrink-0 border-r border-line-soft p-5 bg-white/[0.012]">
                  <div className="flex items-center gap-2 font-bold text-[14px] text-white mb-[26px]">
                    <span className="flex items-center justify-center w-[22px] h-[22px] rounded-[6px] bg-gradient-to-br from-primary-2 to-[#3549d1]">
                      <svg viewBox="0 0 24 24" fill="none" className="w-[11px] h-[11px]">
                        <path d="M4 4h16M4 12h11M4 20h7" stroke="white" strokeWidth="2.6" strokeLinecap="round" />
                      </svg>
                    </span>
                    FlowBoard
                  </div>

                  <div className="flex items-center gap-[10px] text-[13px] text-muted px-[10px] py-2 rounded-[8px] mb-[2px] bg-white/[0.05] text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px] opacity-75"><path d="M3 11l9-7 9 7M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" stroke="currentColor" strokeWidth="1.7" /></svg>
                    Home
                  </div>
                  <div className="flex items-center gap-[10px] text-[13px] text-muted px-[10px] py-2 rounded-[8px] mb-[2px]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px] opacity-75"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" /><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" /></svg>
                    My Tasks
                  </div>
                  <div className="flex items-center gap-[10px] text-[13px] text-muted px-[10px] py-2 rounded-[8px] mb-[2px]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px] opacity-75"><path d="M12 3a4 4 0 014 4v3a4 4 0 01-8 0V7a4 4 0 014-4zM6 21c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.6" /></svg>
                    Notifications
                  </div>

                  <div className="text-[11px] uppercase tracking-[0.06em] text-muted-foreground mt-5 mb-[10px] ml-[10px]">Pinned boards</div>
                  <div className="flex items-center gap-[10px] text-[13px] text-muted px-[10px] py-2 rounded-[8px] mb-[2px] bg-white/[0.05] text-white">
                    <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px] opacity-75"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" /></svg>
                    Product Launch v2
                  </div>
                  <div className="flex items-center gap-[10px] text-[13px] text-muted px-[10px] py-2 rounded-[8px] mb-[2px]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px] opacity-75"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" /></svg>
                    Engineering Backlog
                  </div>
                  <div className="flex items-center gap-[10px] text-[13px] text-muted px-[10px] py-2 rounded-[8px] mb-[2px]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px] opacity-75"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" /></svg>
                    Marketing Campaigns
                  </div>
                  <div className="flex items-center gap-[10px] text-[13px] text-muted px-[10px] py-2 rounded-[8px] mb-[2px]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-[14px] h-[14px] opacity-75"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" /></svg>
                    Mobile App Redesign
                  </div>
                  <div className="flex items-center gap-[10px] text-[13px] text-muted px-[10px] py-2 rounded-[8px] mt-[6px]">+ Add board</div>
                </div>

                <div className="flex-1 min-w-0 p-5 pl-6 relative">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-[12px] text-muted-foreground flex items-center gap-[6px]">Board / Product Launch v2</div>
                    <div className="flex gap-2 items-center">
                      <div className="text-[12px] text-[#d7d9e2] bg-white/[0.04] border border-line px-[11px] py-[6px] rounded-[8px] flex items-center gap-[6px] bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] text-white border-none">
                        <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM19 8v6M22 11h-6" stroke="white" strokeWidth="1.8" /></svg>
                        Invite
                      </div>
                      <div className="text-[12px] text-[#d7d9e2] bg-white/[0.04] border border-line px-[11px] py-[6px] rounded-[8px] flex items-center gap-[6px]">Board</div>
                      <div className="text-[12px] text-[#d7d9e2] bg-white/[0.04] border border-line px-[11px] py-[6px] rounded-[8px] flex items-center gap-[6px]">List</div>
                      <div className="text-[12px] text-[#d7d9e2] bg-white/[0.04] border border-line px-[11px] py-[6px] rounded-[8px] flex items-center gap-[6px]">Calendar</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-[10px] mb-[18px]">
                    <h3 className="text-[18px] font-bold text-white">Product Launch</h3>
                    <span className="text-[#e2b13c] text-[15px]">★</span>
                    <span className="text-[11.5px] text-muted-foreground border border-line px-[9px] py-[3px] rounded-[12px]">Favorite</span>
                  </div>

                  <div className="flex gap-[14px] overflow-hidden">
                    {columns.map((column) => (
                      <div key={column.name} className="w-[168px] flex-shrink-0">
                        <div className="flex items-center justify-between text-[13px] font-semibold text-[#e4e6ee] mb-[10px]">
                          {column.name} <span className="font-normal text-muted-foreground text-[11.5px] ml-1">{column.count}</span>
                          <span className="text-muted-foreground text-[15px]">+</span>
                        </div>
                        {column.cards.map((card) => (
                          <div key={card.id} className="bg-card border border-white/[0.06] rounded-[10px] px-3 py-[11px] mb-[10px] shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                            <span className="text-[10.5px] text-muted-foreground block mb-[6px]">{card.id}</span>
                            <div className="text-[12.5px] text-[#eef0f6] leading-[1.35] mb-[9px] font-medium">{card.title}</div>
                            <div className="flex justify-between items-center">
                              {card.tag ? (
                                <span className={`text-[10.5px] font-semibold px-2 py-[3px] rounded-[6px] text-white ${card.tag.cls}`}>{card.tag.label}</span>
                              ) : <span />}
                              <div className="flex items-center gap-[6px]">
                                {card.avatars ? (
                                  <div className="flex">
                                    {card.avatars.map((a, i) => (
                                      <div key={i} className="w-[19px] h-[19px] rounded-full bg-cover bg-center border-[1.5px] border-card -ml-[6px] first:ml-0" style={{ backgroundImage: `url('${a}')` }} />
                                    ))}
                                  </div>
                                ) : card.avatar ? (
                                  <div className="w-[19px] h-[19px] rounded-full bg-cover bg-center" style={{ backgroundImage: `url('${card.avatar}')` }} />
                                ) : null}
                                {card.check && <span className="text-[10.5px] text-muted-foreground flex items-center gap-[3px]">{card.check}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 text-[12px] text-muted-foreground flex items-center gap-[6px]">
                    <svg viewBox="0 0 24 24" fill="none" className="w-[13px] h-[13px]"><path d="M12 8v4l3 3M21 12a9 9 0 11-9-9" stroke="currentColor" strokeWidth="1.8" /></svg>
                    Settings
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-float-reverse absolute right-1/2 bottom-[20px] w-[220px] bg-card border border-white/[0.09] rounded-[14px] p-4 shadow-[0_30px_60px_rgba(0,0,0,0.55)] z-[6]">
              <span className="text-[11px] text-muted-foreground block mb-[6px]">FB-135</span>
              <div className="text-[14px] font-semibold text-white mb-3">Add Activity Timeline</div>
              <div className="flex justify-between items-center">
                <span className="text-[11.5px] text-muted flex items-center gap-[5px]">
                  <svg viewBox="0 0 24 24" className="w-[13px] h-[13px]" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.7" /></svg>
                  Oct 12
                </span>
                <span className="text-[11.5px] text-muted flex items-center gap-[5px]">☑ 1/4</span>
                <div className="w-[22px] h-[22px] rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://i.pravatar.cc/60?img=25')" }} />
              </div>
            </div>

            <div className="animate-float absolute -right-[30px] bottom-10 w-[260px] bg-panel-2 border border-white/[0.09] rounded-[14px] p-[14px] pr-4 flex gap-3 items-start shadow-[0_30px_60px_rgba(0,0,0,0.55)] z-[6]">
              <div className="w-[34px] h-[34px] rounded-[9px] bg-gradient-to-br from-[#5b76ff] to-[#3f56e8] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <div className="text-[13px] leading-[1.5]">
                Task moved to <span className="text-[#7d95ff] font-semibold">Review</span><br />
                by Maria
                <span className="block text-muted-foreground text-[11.5px] mt-[2px]">Just now</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-[70px] pb-[90px] text-center relative z-[2]">
          <div className="text-[12px] tracking-[0.12em] text-muted-foreground mb-8 font-semibold">TRUSTED BY MODERN TEAMS</div>
          <div className="flex justify-center items-center gap-14 flex-wrap">
            {[
              { icon: <path d="M12 3l9 18H3z" />, name: "Acme Corp" },
              { icon: <path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" />, name: "Artifact" },
              { icon: <path d="M12 2l10 10-10 10L2 12z" />, name: "Pulse Labs" },
              { icon: <circle cx="12" cy="12" r="9" />, name: "Echo", stroke: true },
              { icon: <path d="M2 20L12 3l10 17z" />, name: "Vertice" },
              { icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" /></>, name: "Sisyphus", stroke: true },
            ].map((logo) => (
              <div key={logo.name} className="flex items-center gap-[9px] text-[#767a8a] font-semibold text-[16px] opacity-75">
                <svg viewBox="0 0 24 24" className="w-[19px] h-[19px]" fill={logo.stroke ? "none" : "currentColor"} stroke={logo.stroke ? "currentColor" : "none"} strokeWidth={logo.stroke ? "1.8" : "0"}>
                  {logo.icon}
                </svg>
                {logo.name}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
