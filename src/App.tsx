import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, Navigate, Outlet } from 'react-router-dom';

// =====================================================
// DYNAMIC ELEMENTS — Stress-Test for UVT DSE
// =====================================================
function LiveClock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(t);
  }, []);
  return <span className="dynamic-time" data-uvt-dynamic="clock">{time}</span>;
}

function RelativeTime({ base }: { base: Date }) {
  const [label, setLabel] = useState('just now');
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((Date.now() - base.getTime()) / 1000);
      if (diff < 60) setLabel(`${diff} seconds ago`);
      else if (diff < 3600) setLabel(`${Math.floor(diff / 60)} minutes ago`);
      else setLabel(`${Math.floor(diff / 3600)} hours ago`);
    };
    update();
    const t = setInterval(update, 5000);
    return () => clearInterval(t);
  }, [base]);
  return <span className="dynamic-reltime" data-uvt-dynamic="relative-time">{label}</span>;
}

function CountdownTimer({ seconds }: { seconds: number }) {
  const [rem, setRem] = useState(seconds);
  useEffect(() => {
    if (rem <= 0) return;
    const t = setInterval(() => setRem(r => Math.max(0, r - 1)), 1000);
    return () => clearInterval(t);
  }, [rem]);
  const m = String(Math.floor(rem / 60)).padStart(2, '0');
  const s = String(rem % 60).padStart(2, '0');
  return <span className="dynamic-countdown" data-uvt-dynamic="countdown">{m}:{s}</span>;
}

function DynamicTokens() {
  const uuid = useRef(`f81d4fae-7dec-11d0-a765-${Math.random().toString(16).substring(2, 14)}`);
  const sessionId = useRef(`sess_${Math.random().toString(36).substring(2, 18)}`);
  const requestId = useRef(`req-${Math.random().toString(36).substring(2, 10)}`);
  const token = useRef(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${Math.random().toString(36).substring(7)}`);
  const createdAt = useRef(new Date().toISOString());
  const updatedAt = useRef(new Date().toISOString());
  return (
    <div style={{ padding: '12px', background: '#f9f9f9', borderRadius: '8px', marginBottom: '12px', fontSize: '12px' }}>
      <div><strong>UUID:</strong> <span className="dynamic-uuid" data-uvt-dynamic="uuid">{uuid.current}</span></div>
      <div><strong>Session:</strong> <span className="dynamic-session" data-uvt-dynamic="session-id">{sessionId.current}</span></div>
      <div><strong>Request ID:</strong> <span className="dynamic-requestid" data-uvt-dynamic="request-id">{requestId.current}</span></div>
      <div><strong>JWT Token:</strong> <span className="dynamic-token" data-uvt-dynamic="token" style={{ wordBreak: 'break-all' }}>{token.current}</span></div>
      <div><strong>Created At:</strong> <span className="dynamic-createdat" data-uvt-dynamic="timestamp">{createdAt.current}</span></div>
      <div><strong>Updated At:</strong> <span className="dynamic-updatedat" data-uvt-dynamic="timestamp">{updatedAt.current}</span></div>
    </div>
  );
}

function CanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let x = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#646cff';
      ctx.beginPath();
      ctx.arc(x, 50, 20, 0, 2 * Math.PI);
      ctx.fill();
      x = (x + 2) % canvas.width;
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, []);
  return (
    <div style={{ margin: '12px 0' }}>
      <h5 style={{ margin: '0 0 6px' }}>Canvas Animation (DSE: canvas)</h5>
      <canvas data-uvt-dynamic="canvas" ref={canvasRef} width="300" height="100" style={{ border: '1px solid #ccc', borderRadius: '4px' }} />
    </div>
  );
}

function AnimatedSVG() {
  return (
    <div style={{ margin: '12px 0' }}>
      <h5 style={{ margin: '0 0 6px' }}>Animated SVG Spinner</h5>
      <svg data-uvt-dynamic="animated-svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#646cff" strokeWidth="4" strokeDasharray="100" strokeLinecap="round">
          <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div style={{ animation: 'skeletonPulse 1.4s ease-in-out infinite' }}>
      <div style={{ height: '16px', background: '#e0e0e0', borderRadius: '4px', marginBottom: '8px' }} />
      <div style={{ height: '16px', background: '#e0e0e0', borderRadius: '4px', width: '80%', marginBottom: '8px' }} />
      <div style={{ height: '16px', background: '#e0e0e0', borderRadius: '4px', width: '60%' }} />
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const [progress, setProgress] = useState(value);
  useEffect(() => {
    const t = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 1)), 200);
    return () => clearInterval(t);
  }, []);
  return (
    <div>
      <div style={{ background: '#e0e0e0', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
        <div data-uvt-dynamic="progress-bar" style={{ width: `${progress}%`, height: '100%', background: '#646cff', transition: 'width 0.2s' }} />
      </div>
      <small>{progress}% complete</small>
    </div>
  );
}

function ToastNotification({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      background: '#333', color: '#fff',
      padding: '12px 20px', borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
      zIndex: 9999, animation: 'slideIn 0.3s ease'
    }}>
      {message}
    </div>
  );
}

function ChartBar({ data, label }: { data: number[]; label: string }) {
  const max = Math.max(...data, 1);
  return (
    <div>
      <h5 style={{ marginBottom: '8px' }}>{label}</h5>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
        {data.map((v, i) => (
          <div key={i} style={{
            width: '24px',
            height: `${(v / max) * 80}px`,
            background: `hsl(${(i * 40) % 360}, 60%, 55%)`,
            borderRadius: '3px 3px 0 0',
            transition: 'height 0.3s'
          }} />
        ))}
      </div>
    </div>
  );
}

function RandomAvatar({ seed }: { seed: string }) {
  return <img src={`https://i.pravatar.cc/40?u=${seed}`} alt="avatar" style={{ width: 40, height: 40, borderRadius: '50%' }} />;
}

// =====================================================
// AUTH / PROTECTED ROUTES
// =====================================================
const isAuthenticated = true; // Mock auth state

function ProtectedRoute() {
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

// =====================================================
// SHARED LAYOUT
// =====================================================
function Sidebar({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <aside style={{
      width: '200px', minHeight: '100%', background: '#f3fff3',
      borderRight: '2px solid #22c55e', padding: '16px', flexShrink: 0
    }}>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <Link to="/analytics">Analytics</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/admin">Admin</Link>
      </nav>
    </aside>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div style={{
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      color: theme === 'light' ? '#213547' : '#f5f5f5',
      background: theme === 'light' ? '#ffffff' : '#1a1a1a',
      minHeight: '100vh',
      transition: 'background 0.3s, color 0.3s'
    }}>
      <style>{`
        @keyframes skeletonPulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes slideIn { from{transform:translateX(100%)} to{transform:translateX(0)} }
        nav a, nav button { color: #e05d44; text-decoration: none; font-size: 14px; cursor: pointer; background: none; border: none; padding: 0; }
        nav a:hover, nav button:hover { text-decoration: underline; }
      `}</style>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid #ccc', padding: '12px 24px',
        background: theme === 'light' ? '#2a1a1a' : '#0f0f0f',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{ background: 'none', border: '1px solid #22c55e', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>☰</button>
          <h2 style={{ margin: 0, color: '#e05d44' }}>UVT React Demo v2</h2>
        </div>
        <nav style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/team">Team</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/products">Products</Link>
          <Link to="/search">Search</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setToast('Visual test triggered!')} style={{ cursor: 'pointer', padding: '6px 12px', background: '#e05d44', color: '#fff', border: 'none', borderRadius: '6px' }}>
            Test Toast
          </button>
          <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')} style={{ cursor: 'pointer', padding: '6px 12px', background: 'transparent', border: '1px solid #ccc', borderRadius: '6px' }}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </header>
      <div style={{ display: 'flex' }}>
        <Sidebar visible={sidebarOpen} />
        <main style={{ flex: 1, padding: '24px' }}>
          {children}
        </main>
      </div>
      {toast && <ToastNotification message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// =====================================================
// PAGES
// =====================================================
function Home() {
  return (
    <div>
      <h3 style={{ color: '#e05d44' }}>Home Page — Updated</h3>
      <p>Welcome to UVT React Demo v2 — RC-02 incremental validation in progress.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginTop: '16px' }}>
        <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>Live Clock</h4>
          <LiveClock />
        </div>
        <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>Countdown</h4>
          <CountdownTimer seconds={600} />
        </div>
        <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>Progress</h4>
          <ProgressBar value={40} />
        </div>
        <div style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
          <h4 style={{ marginTop: 0 }}>Activity</h4>
          <p><RelativeTime base={new Date(Date.now() - 120000)} /> — Last deployment</p>
        </div>
      </div>
      <div style={{ marginTop: '16px' }}>
        <DynamicTokens />
      </div>
      <CanvasAnimation />
      <AnimatedSVG />
    </div>
  );
}

function About() {
  return (
    <div>
      <h3>About</h3>
      <p>UVT React Demo expanded for RC-02 — stress-testing framework detection, route scanning, and DSE stabilization at scale.</p>
      <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
        {['Alice', 'Bob', 'Carol'].map(name => (
          <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RandomAvatar seed={name} />
            <span>{name}</span>
          </div>
        ))}
      </div>
      <img src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=400&q=80" alt="About" style={{ width: '300px', borderRadius: '8px', marginTop: '16px' }} />
    </div>
  );
}

function Blog() {
  const posts = [
    { id: 'intro', title: 'Introducing UVT', excerpt: 'Visual testing without configuration.', date: '2025-07-01' },
    { id: 'dse', title: 'How DSE Works', excerpt: 'Dynamic stabilization explained.', date: '2025-07-05' },
    { id: 'rc02', title: 'RC-02 Validation', excerpt: 'Git lifecycle testing in action.', date: '2025-07-10' },
  ];
  return (
    <div>
      <h3>Blog</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {posts.map(p => (
          <div key={p.id} style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 4px' }}><Link to={`/blog/${p.id}`}>{p.title}</Link></h4>
            <p style={{ margin: '0 0 8px', color: '#666' }}>{p.excerpt}</p>
            <small>{p.date} · <RelativeTime base={new Date(p.date)} /></small>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogDetail() {
  const { slug } = useParams();
  return (
    <div>
      <Link to="/blog">← Back to Blog</Link>
      <h3>Blog Post: {slug}</h3>
      <DynamicTokens />
      <p>This is a detailed blog article. Published <RelativeTime base={new Date('2025-07-01')} />.</p>
      <SkeletonLoader />
    </div>
  );
}

function Pricing() {
  const plans = [
    { name: 'Starter', price: '$0', features: ['3 projects', '1,000 snapshots/mo', 'Community support'] },
    { name: 'Pro', price: '$49/mo', features: ['Unlimited projects', '50,000 snapshots/mo', 'Priority support'] },
    { name: 'Enterprise', price: 'Custom', features: ['SLA', 'SSO', 'Dedicated onboarding'] },
  ];
  return (
    <div>
      <h3>Pricing</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        {plans.map(p => (
          <div key={p.name} style={{ padding: '24px', border: '2px solid #eee', borderRadius: '12px', textAlign: 'center' }}>
            <h4 style={{ marginTop: 0 }}>{p.name}</h4>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#646cff', marginBottom: '16px' }}>{p.price}</div>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              {p.features.map(f => <li key={f}>{f}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const items = [
    { q: 'What is UVT?', a: 'Universal Visual Testing is a zero-config visual regression testing platform.' },
    { q: 'How does DSE work?', a: 'The Dynamic Stabilization Engine detects and masks dynamic content before comparison.' },
    { q: 'Does it support Next.js?', a: 'Yes — UVT natively supports React, Next.js, Vue, Angular, Svelte, and more.' },
  ];
  return (
    <div>
      <h3>FAQ</h3>
      {items.map((item, i) => (
        <div key={i} style={{ marginBottom: '8px', border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{ width: '100%', textAlign: 'left', padding: '12px 16px', background: '#f9f9f9', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            {item.q}
          </button>
          {open === i && <div style={{ padding: '12px 16px' }}>{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

function Team() {
  const members = [
    { name: 'Alice Chen', role: 'Lead Engineer', seed: 'alice-rc02' },
    { name: 'Bob Okafor', role: 'DSE Architect', seed: 'bob-rc02' },
    { name: 'Carol Smith', role: 'SDK Developer', seed: 'carol-rc02' },
    { name: 'David Kim', role: 'QA Engineer', seed: 'david-rc02' },
  ];
  return (
    <div>
      <h3>Team</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {members.map(m => (
          <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
            <RandomAvatar seed={m.seed} />
            <div>
              <div style={{ fontWeight: 600 }}>{m.name}</div>
              <div style={{ color: '#666', fontSize: '13px' }}>{m.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Careers() {
  const jobs = ['Senior Frontend Engineer', 'Visual Testing Advocate', 'SDK Integrations Engineer'];
  return (
    <div>
      <h3>Careers</h3>
      <p>Join our team. We're hiring!</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {jobs.map(j => (
          <div key={j} style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{j}</span>
            <button style={{ padding: '6px 14px', background: '#646cff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const [chartData] = useState([42, 67, 89, 54, 76, 95, 63, 78, 44, 91, 55, 72]);
  return (
    <div>
      <h3>Analytics</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[{ label: 'Builds', value: '1,842' }, { label: 'Snapshots', value: '24,901' }, { label: 'Pass Rate', value: '99.7%' }].map(m => (
          <div key={m.label} style={{ padding: '16px', background: '#fff7ed', borderRadius: '10px', textAlign: 'center', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#e05d44' }}>{m.value}</div>
            <div style={{ color: '#666' }}>{m.label}</div>
          </div>
        ))}
      </div>
      <ChartBar data={chartData} label="Monthly Snapshot Volume" />
      <div style={{ marginTop: '16px' }}>
        <DynamicTokens />
      </div>
    </div>
  );
}

function Orders() {
  const orders = Array.from({ length: 8 }, (_, i) => ({
    id: `ORD-${(1000 + i)}`,
    item: `Product ${String.fromCharCode(65 + i)}`,
    status: ['Pending', 'Processing', 'Shipped', 'Delivered'][i % 4],
    amount: `$${(29.99 + i * 10).toFixed(2)}`,
    date: new Date(Date.now() - i * 86400000).toLocaleDateString()
  }));
  return (
    <div>
      <h3>Orders</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            {['ID', 'Item', 'Status', 'Amount', 'Date'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '10px 12px', borderBottom: '2px solid #eee' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '10px 12px' }}><code>{o.id}</code></td>
              <td style={{ padding: '10px 12px' }}>{o.item}</td>
              <td style={{ padding: '10px 12px' }}>
                <span style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '12px', background: o.status === 'Delivered' ? '#d4edda' : '#fff3cd' }}>
                  {o.status}
                </span>
              </td>
              <td style={{ padding: '10px 12px' }}>{o.amount}</td>
              <td style={{ padding: '10px 12px' }}>{o.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Notifications() {
  const [items] = useState([
    { id: 1, type: 'success', msg: 'Build #1842 passed — all snapshots approved.' },
    { id: 2, type: 'warning', msg: '3 dynamic elements detected on /dashboard.' },
    { id: 3, type: 'info', msg: 'New team member Carol joined the workspace.' },
    { id: 4, type: 'error', msg: 'Build #1839 failed — 2 visual differences found.' },
  ]);
  const color: Record<string, string> = { success: '#d4edda', warning: '#fff3cd', info: '#cce5ff', error: '#f8d7da' };
  return (
    <div>
      <h3>Notifications</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {items.map(n => (
          <div key={n.id} style={{ padding: '12px 16px', borderRadius: '8px', background: color[n.type] }}>
            <strong style={{ textTransform: 'uppercase', fontSize: '11px' }}>{n.type}</strong>
            <p style={{ margin: '4px 0 0' }}>{n.msg}</p>
            <small><RelativeTime base={new Date(Date.now() - n.id * 300000)} /></small>
          </div>
        ))}
      </div>
    </div>
  );
}

function Admin() {
  return (
    <div>
      <h3>Admin Panel</h3>
      <p>Protected route — only accessible when authenticated.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {['Users', 'Tokens', 'Webhooks', 'Audit Logs'].map(section => (
          <div key={section} style={{ padding: '16px', border: '1px solid #eee', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 8px' }}>{section}</h4>
            <SkeletonLoader />
          </div>
        ))}
      </div>
      <DynamicTokens />
    </div>
  );
}

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const allItems = ['Home', 'About', 'Blog', 'Pricing', 'FAQ', 'Team', 'Careers', 'Dashboard', 'Analytics', 'Orders', 'Notifications', 'Admin'];
  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    setResults(allItems.filter(i => i.toLowerCase().includes(query.toLowerCase())));
  }, [query]);
  return (
    <div>
      <h3>Search</h3>
      <input
        type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Search pages…"
        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', marginBottom: '12px' }}
      />
      {results.length > 0 ? (
        <ul>{results.map(r => <li key={r}><Link to={`/${r.toLowerCase()}`}>{r}</Link></li>)}</ul>
      ) : query.length >= 2 ? (
        <p>No results for "<strong>{query}</strong>"</p>
      ) : null}
    </div>
  );
}

function ErrorPage() {
  return (
    <div style={{ textAlign: 'center', padding: '48px' }}>
      <h1 style={{ fontSize: '72px', color: '#ff4d4f', margin: 0 }}>404</h1>
      <h3>Page Not Found</h3>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <h3>Contact Support</h3>
      {submitted ? (
        <div style={{ color: 'green', fontWeight: 'bold' }}>Message sent! Thank you. <RelativeTime base={new Date()} /></div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '360px' }}>
          <input type="text" placeholder="Name" required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <input type="email" placeholder="Email" required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc' }} />
          <textarea placeholder="Message" required style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '100px' }} />
          <button type="submit" style={{ padding: '10px', background: '#646cff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Submit</button>
        </form>
      )}
    </div>
  );
}

function Dashboard() {
  const [data, setData] = useState<any>(null);
  const requestIdRef = useRef(`req-${Math.random().toString(36).substring(7)}`);
  useEffect(() => {
    const t = setTimeout(() => {
      setData({
        requestId: requestIdRef.current,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metrics: { builds: 182, passed: 177, failed: 5, snapshots: 9840 },
        items: [
          { id: 1, name: 'react-demo', status: 'passing', snapshots: 12 },
          { id: 2, name: 'next-demo', status: 'passing', snapshots: 8 },
          { id: 3, name: 'vue-app', status: 'pending', snapshots: 0 },
        ]
      });
    }, 800);
    return () => clearTimeout(t);
  }, []);
  if (!data) return <SkeletonLoader />;
  return (
    <div>
      <h3>Dashboard</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {Object.entries(data.metrics).map(([k, v]) => (
          <div key={k} style={{ padding: '14px', background: '#fff7ed', borderRadius: '10px', textAlign: 'center', border: '1px solid #fed7aa' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#e05d44' }}>{String(v)}</div>
            <div style={{ color: '#666', fontSize: '13px', textTransform: 'capitalize' }}>{k}</div>
          </div>
        ))}
      </div>
      <div style={{ background: '#eef', padding: '12px', borderRadius: '6px', marginBottom: '12px', fontSize: '12px' }}>
        <span className="dynamic-requestid" data-uvt-dynamic="request-id"><strong>Request ID:</strong> {data.requestId}</span>
        {' · '}
        <span className="dynamic-createdat" data-uvt-dynamic="timestamp"><strong>Updated:</strong> {data.updatedAt}</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f9f9f9' }}>
            {['Project', 'Status', 'Snapshots'].map(h => <th key={h} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #eee' }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.items.map((it: any) => (
            <tr key={it.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '8px 12px' }}>{it.name}</td>
              <td style={{ padding: '8px 12px' }}><span style={{ color: it.status === 'passing' ? 'green' : '#999' }}>● {it.status}</span></td>
              <td style={{ padding: '8px 12px' }}>{it.snapshots}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ProgressBar value={Math.round((data.metrics.passed / data.metrics.builds) * 100)} />
    </div>
  );
}

function Products() {
  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-black text-indigo-700 p-4 bg-indigo-100 rounded-md">Products (RC-02.1 Auth Validation)</h3>
      <p>Browse our catalog of items. Validating Percy Auth Pipeline!</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
        {[1, 2, 3, 4].map(id => (
          <div key={id} style={{ padding: '16px', border: '1px solid #eee', borderRadius: '10px' }}>
            <h4 style={{ marginTop: 0 }}>Product {id}</h4>
            <p style={{ color: '#666' }}>Premium visual testing addon #{id}</p>
            <Link to={`/products/${id}`}>View Details →</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductDetails() {
  const { id } = useParams();
  return (
    <div>
      <Link to="/products">← Products</Link>
      <h3>Product #{id}</h3>
      <p>Detailed view for product {id}. Last updated: <RelativeTime base={new Date('2025-07-01')} /></p>
      <DynamicTokens />
    </div>
  );
}

function Profile() {
  return (
    <div>
      <h3>Profile</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <RandomAvatar seed="user-profile-rc02" />
        <div>
          <h4 style={{ margin: 0 }}>John Doe</h4>
          <p style={{ margin: '4px 0 0', color: '#666' }}>johndoe@example.com</p>
          <small>Member since <RelativeTime base={new Date('2024-01-15')} /></small>
        </div>
      </div>
      <DynamicTokens />
    </div>
  );
}

function Settings() {
  return (
    <div>
      <h3>Settings</h3>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <input type="checkbox" defaultChecked /> Enable Email Alerts
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <input type="checkbox" /> Enable Slack Notifications
      </label>
      <div style={{ marginTop: '16px' }}>
        <h4>Map Integration</h4>
        <div className="leaflet-map-mock" style={{ height: '200px', background: '#cad0d4', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          [Leaflet Map Placeholder]
        </div>
      </div>
    </div>
  );
}

// =====================================================
// APP ROOT
// =====================================================
export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/team" element={<Team />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
