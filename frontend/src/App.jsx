import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MEMBER_ID = '1'; // MVP 임시 회원 ID (헤더 전송용)
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// HTML 태그 및 특수 기호 정제 헬퍼 함수
const cleanText = (text) => {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'");
};

// 날짜 포맷팅 헬퍼 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState('portfolio');
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  // Assets and indicators states loaded from Server API
  const [stocks, setStocks] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [indicators, setIndicators] = useState([]);
  
  // Loading states
  const [loadingStocks, setLoadingStocks] = useState(true);
  const [loadingNews, setLoadingNews] = useState(false);
  const [loadingIndicators, setLoadingIndicators] = useState(false);

  // Modal open/close state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTicker, setNewTicker] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newQuantity, setNewQuantity] = useState('');

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  // Apply theme & Sync localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle Theme function
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    showToast(`${theme === 'light' ? '다크' : '라이트'} 모드로 전환되었습니다.`, 'info');
  };

  // Add Toast Notification
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // 1. GET /api/stocks (보유 자산 목록 조회)
  const fetchAssets = async () => {
    setLoadingStocks(true);
    try {
      const res = await fetch(`${API_BASE}/api/stocks`, {
        headers: {
          'Accept': 'application/json',
          'X-Member-Id': MEMBER_ID
        }
      });
      const result = await res.json();
      if (result.success) {
        const fetchedStocks = result.data?.stockList || (Array.isArray(result.data) ? result.data : []);
        setStocks(fetchedStocks);
      } else {
        showToast(result.error?.message || '자산 데이터를 불러오지 못했습니다.', 'danger');
      }
    } catch (err) {
      showToast('백엔드 서버와 통신할 수 없습니다. (CORS 또는 서버 오프라인)', 'danger');
      console.error('Fetch Assets Error:', err);
    } finally {
      setLoadingStocks(false);
    }
  };

  // 2. POST /api/stocks (새 자산 등록)
  const handleAddStock = async (e) => {
    e.preventDefault();
    if (!newTicker || !newPrice || !newQuantity) return;

    const tickerUpper = newTicker.trim().toUpperCase();
    const priceNum = parseFloat(newPrice);
    const qtyNum = parseInt(newQuantity, 10);

    if (isNaN(priceNum) || priceNum <= 0 || isNaN(qtyNum) || qtyNum <= 0) {
      showToast('올바른 단가와 정수 수량을 입력해주세요.', 'danger');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/stocks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Member-Id': MEMBER_ID
        },
        body: JSON.stringify({
          ticker: tickerUpper,
          price: priceNum,
          quantity: qtyNum
        })
      });
      const result = await res.json();
      if (result.success) {
        showToast(`${tickerUpper} 자산이 등록되었습니다.`);
        fetchAssets(); // 목록 갱신
        
        // Reset Form & Close Modal
        setNewTicker('');
        setNewPrice('');
        setNewQuantity('');
        setIsModalOpen(false);
      } else {
        showToast(result.error?.message || '자산 등록에 실패했습니다.', 'danger');
      }
    } catch (err) {
      showToast('서버 오류로 자산을 등록하지 못했습니다.', 'danger');
      console.error('Add Asset Error:', err);
    }
  };

  // 3. DELETE /api/stocks/{id} (자산 삭제)
  const handleDeleteStock = async (id, ticker) => {
    try {
      const res = await fetch(`${API_BASE}/api/stocks/${id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'X-Member-Id': MEMBER_ID
        }
      });
      const result = await res.json();
      if (result.success) {
        showToast(`${ticker} 자산이 삭제되었습니다.`, 'danger');
        fetchAssets(); // 목록 갱신
      } else {
        showToast(result.error?.message || '자산 삭제에 실패했습니다.', 'danger');
      }
    } catch (err) {
      showToast('서버 오류로 자산을 삭제하지 못했습니다.', 'danger');
      console.error('Delete Asset Error:', err);
    }
  };

  // 4. GET /api/news (거시경제 뉴스 조회)
  // 백엔드 컨트롤러가 요구하는 필수 검색어 파라미터명인 'keyWord'에 맞춰 전송
  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      const searchQuery = encodeURIComponent('미국 경제 시황');
      const res = await fetch(`${API_BASE}/api/news?keyWord=${searchQuery}`, {
        headers: {
          'Accept': 'application/json',
          'X-Member-Id': MEMBER_ID
        }
      });
      const result = await res.json();
      
      // 백엔드가 공통 Wrapper DTO 없이 네이버 원본 구조(items 배열 포함)를 그대로 반환하는 경우 유연하게 대응
      if (result.items && Array.isArray(result.items)) {
        setNewsList(result.items);
      } else if (result.success && result.data?.items) {
        setNewsList(result.data.items);
      } else if (result.success && Array.isArray(result.data)) {
        setNewsList(result.data);
      } else {
        showToast(result.error?.message || '뉴스를 불러오지 못했습니다.', 'danger');
      }
    } catch (err) {
      showToast('뉴스 데이터를 가져오는 중 통신 오류가 발생했습니다.', 'danger');
      console.error('Fetch News Error:', err);
    } finally {
      setLoadingNews(false);
    }
  };

  // 5. GET /api/indicators (글로벌 시장 지수 조회)
  const fetchIndicators = async () => {
    setLoadingIndicators(true);
    try {
      const res = await fetch(`${API_BASE}/api/indicators`, {
        headers: {
          'Accept': 'application/json',
          'X-Member-Id': MEMBER_ID
        }
      });
      const result = await res.json();
      if (result.success) {
        setIndicators(result.data || []);
      } else {
        showToast(result.error?.message || '지표를 불러오지 못했습니다.', 'danger');
      }
    } catch (err) {
      console.error('Fetch Indicators Error:', err);
    } finally {
      setLoadingIndicators(false);
    }
  };

  // Load initial asset list
  useEffect(() => {
    fetchAssets();
  }, []);

  // Fetch tab-specific data on tab switch
  useEffect(() => {
    if (activeTab === 'news') {
      fetchNews();
    } else if (activeTab === 'indicators') {
      fetchIndicators();
    } else if (activeTab === 'portfolio') {
      fetchAssets();
    }
  }, [activeTab]);

  // Aggregate calculations
  const totalAmount = stocks.reduce((acc, stock) => acc + (stock.price * stock.quantity), 0);

  // Chart data setup
  const chartData = {
    labels: stocks.map(s => s.ticker),
    datasets: [
      {
        data: stocks.map(s => s.price * s.quantity),
        backgroundColor: [
          '#6366f1', // Indigo
          '#a855f7', // Purple
          '#06b6d4', // Cyan
          '#10b981', // Emerald
          '#f59e0b', // Amber
          '#ec4899', // Pink
        ],
        borderWidth: theme === 'dark' ? 2 : 1,
        borderColor: theme === 'dark' ? '#111827' : '#ffffff',
        hoverOffset: 6,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = ((value / totalAmount) * 100).toFixed(1);
            return ` ${label}: $${value.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="app-container">
      {/* 1. Header Area */}
      <header className="app-header">
        <div className="brand-wrapper">
          <div className="brand-logo">
            <i className="fa-solid fa-chart-pie"></i>
          </div>
          <h1 className="brand-title">AssetManager</h1>
        </div>
        <div className="header-actions">
          <button className="theme-toggle-btn" onClick={toggleTheme} title="테마 변경">
            <i className={`fa-solid ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
          </button>
          <div className="member-badge">
            <i className="fa-solid fa-user"></i> Member <span>#{MEMBER_ID}</span>
          </div>
        </div>
      </header>

      {/* 2. Main Tab Panels */}
      <main className="main-content">
        
        {/* Panel 2-A: Portfolio Asset Status */}
        <section className={`tab-panel ${activeTab === 'portfolio' ? 'active' : ''}`}>
          <div className="portfolio-grid">
            
            {/* Left: Summary Chart Card */}
            <div className="glass-card portfolio-summary">
              <h2 className="total-title">보유 자산 평가액</h2>
              <div className="total-amount">
                $ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              
              {loadingStocks ? (
                <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>서버에서 데이터를 불러오는 중...</span>
                </div>
              ) : stocks.length > 0 ? (
                <div className="chart-wrapper">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="chart-center-text">
                    <div className="chart-label">Assets</div>
                    <div className="chart-value">{stocks.length}개</div>
                  </div>
                </div>
              ) : (
                <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--text-tertiary)' }}>등록된 자산이 없습니다.</span>
                </div>
              )}
              
              <div className="fallback-badge">
                <i className="fa-solid fa-cloud"></i> 백엔드 API 연동 모드
              </div>
            </div>

            {/* Right: CRUD Table Card */}
            <div className="glass-card">
              <div className="section-header">
                <h2 className="section-title">
                  <i className="fa-solid fa-wallet"></i> 자산 포트폴리오 목록
                </h2>
                <button className="btn-add-stock" onClick={() => setIsModalOpen(true)} title="새 자산 등록">
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>

              <div className="stock-table-container">
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th>종목(Ticker)</th>
                      <th>평균 단가</th>
                      <th style={{ textAlign: 'right' }}>보유수량</th>
                      <th style={{ textAlign: 'right' }}>평가금액</th>
                      <th style={{ textAlign: 'right', width: '50px' }}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingStocks ? (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          <p>데이터 로딩 중...</p>
                        </td>
                      </tr>
                    ) : stocks.length > 0 ? (
                      stocks.map(stock => (
                        <tr key={stock.stockId}>
                          <td className="ticker-cell">{stock.ticker}</td>
                          <td>${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                          <td style={{ textAlign: 'right' }}>{stock.quantity}</td>
                          <td style={{ textAlign: 'right', fontWeight: 600 }}>
                            ${(stock.price * stock.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="action-cell">
                            <button 
                              className="btn-delete" 
                              onClick={() => handleDeleteStock(stock.stockId, stock.ticker)}
                              title="삭제"
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="empty-state">
                          <i className="fa-solid fa-folder-open"></i>
                          <p>등록된 자산이 없습니다. 우측 상단 '+' 버튼을 눌러 등록해 보세요.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </section>

        {/* Panel 2-B: Economic News */}
        <section className={`tab-panel ${activeTab === 'news' ? 'active' : ''}`}>
          <div className="glass-card">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fa-solid fa-newspaper" style={{ color: 'var(--primary)' }}></i> 실시간 주요 경제 뉴스
              </h2>
            </div>
            
            {loadingNews ? (
              <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-tertiary)' }}>뉴스 피드를 가져오는 중...</p>
              </div>
            ) : newsList.length > 0 ? (
              <div className="news-list">
                {newsList.map((news, idx) => (
                  <a 
                    key={idx} 
                    href={news.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ textDecoration: 'none', display: 'block' }}
                  >
                    <div className="news-card">
                      <div className="news-meta">
                        <span className="news-source">네이버 뉴스</span>
                        <span>•</span>
                        <span>{formatDate(news.pubDate)}</span>
                      </div>
                      <h3 className="news-title">{cleanText(news.title)}</h3>
                      <p className="news-summary">{cleanText(news.description)}</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                뉴스가 존재하지 않거나 가져오지 못했습니다.
              </div>
            )}
          </div>
        </section>

        {/* Panel 2-C: Market Indicators */}
        <section className={`tab-panel ${activeTab === 'indicators' ? 'active' : ''}`}>
          <div className="glass-card">
            <div className="section-header">
              <h2 className="section-title">
                <i className="fa-solid fa-chart-line" style={{ color: 'var(--accent)' }}></i> 글로벌 핵심 시장 지표
              </h2>
            </div>
            
            {loadingIndicators ? (
              <div style={{ padding: '3rem 0', textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: 'var(--accent)' }}></i>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-tertiary)' }}>글로벌 지표 수신 중...</p>
              </div>
            ) : indicators.length > 0 ? (
              <div className="indicator-grid">
                {indicators.map(ind => (
                  <div key={ind.id} className="indicator-card">
                    <div className="indicator-name">{ind.name}</div>
                    <div className="indicator-value">{ind.value}</div>
                    <div className={`indicator-change ${ind.isUp ? 'up' : 'down'}`}>
                      <i className={`fa-solid ${ind.isUp ? 'fa-caret-up' : 'fa-caret-down'}`}></i>
                      {ind.change}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                시장 지표가 존재하지 않거나 가져오지 못했습니다.
              </div>
            )}
            
            <div className="info-note">
              <i className="fa-solid fa-circle-info"></i>
              위 시장 지표 데이터는 예시 시세 정보이며, 실시간 실거래와 오차가 발생할 수 있습니다.
            </div>
          </div>
        </section>

      </main>

      {/* 3. Navigation Tab Bar */}
      <nav className="tab-navbar">
        <button 
          className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`}
          onClick={() => setActiveTab('news')}
        >
          <i className="fa-solid fa-newspaper"></i>
          경제 뉴스
        </button>
        <button 
          className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          <i className="fa-solid fa-wallet"></i>
          자산 현황
        </button>
        <button 
          className={`tab-btn ${activeTab === 'indicators' ? 'active' : ''}`}
          onClick={() => setActiveTab('indicators')}
        >
          <i className="fa-solid fa-chart-line"></i>
          시장 지표
        </button>
      </nav>

      {/* 4. Modals - Add Stock Modal */}
      <div className={`modal-overlay ${isModalOpen ? 'active' : ''}`} onClick={() => setIsModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2 className="modal-title">
            <i className="fa-solid fa-cart-plus"></i> 새 자산 등록
          </h2>
          <form onSubmit={handleAddStock}>
            <div className="form-group">
              <label className="form-label" htmlFor="tickerInput">종목 코드 (Ticker)</label>
              <input 
                type="text" 
                id="tickerInput" 
                placeholder="예: AAPL, TSLA, BTC" 
                className="form-input"
                value={newTicker}
                onChange={(e) => setNewTicker(e.target.value)}
                required 
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="priceInput">평균 매입 단가 ($)</label>
                <input 
                  type="number" 
                  id="priceInput" 
                  placeholder="0.00" 
                  min="0" 
                  step="any" 
                  className="form-input"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="qtyInput">보유 수량</label>
                <input 
                  type="number" 
                  id="qtyInput" 
                  placeholder="0" 
                  min="0" 
                  step="any" 
                  className="form-input"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>취소</button>
              <button type="submit" className="btn btn-primary">등록하기</button>
            </div>
          </form>
        </div>
      </div>

      {/* 5. Toasts Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <i className={`fa-solid ${
              toast.type === 'success' ? 'fa-circle-check' : 
              toast.type === 'info' ? 'fa-circle-info' : 'fa-circle-exclamation'
            }`}></i>
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
