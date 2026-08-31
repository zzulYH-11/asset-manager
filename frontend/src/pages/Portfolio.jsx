  import React, { useState, useEffect, useCallback } from 'react';
  import { Doughnut } from 'react-chartjs-2';
  import { fetchStocksApi, addStockApi, deleteStockApi } from '../api/client';
  import { useToast } from '../contexts/ToastContext';
  import { useTheme } from '../contexts/ThemeContext';
  import Modal from '../components/Modal';
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
  ChartJS.register(ArcElement, Tooltip, Legend);

  export default function Portfolio() {
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTicker, setNewTicker] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newQuantity, setNewQuantity] = useState('');

    const { showToast } = useToast();
    const { theme } = useTheme();

    const loadStocks = useCallback(async () => {
      setLoading(true);
      try {
        const res = await fetchStocksApi();
        if (res.success) {
          setStocks(res.data?.stockList || (Array.isArray(res.data) ? res.data : []));
        } else {
          showToast(res.error?.message || '자산 데이터를 불러오지 못했습니다.', 'danger');
        }
      } catch {
        showToast('백엔드 서버와 통신할 수 없습니다.', 'danger');
      } finally {
        setLoading(false);
      }
    }, [showToast]);

    useEffect(() => { loadStocks(); }, [loadStocks]);

  const handleAddStock = async (e) => {
    e.preventDefault();
    const tickerUpper = newTicker.trim().toUpperCase();
    const priceNum = parseFloat(newPrice);
    const qtyNum = parseInt(newQuantity, 10);

    if (!tickerUpper || isNaN(priceNum) || priceNum <= 0 || isNaN(qtyNum) || qtyNum <= 0) {
      showToast('올바른 값을 입력해주세요.', 'danger');
      return;
    }

    try {
      const res = await addStockApi({ ticker: tickerUpper, price: priceNum, quantity: qtyNum });
      if (res.success) {
        showToast(`${tickerUpper} 자산이 등록되었습니다.`);
        loadStocks();
        setNewTicker(''); setNewPrice(''); setNewQuantity('');
        setIsModalOpen(false);
      } else {
        showToast(res.error?.message || '자산 등록에 실패했습니다.', 'danger');
      }
    } catch {
      showToast('서버 오류로 등록하지 못했습니다.', 'danger');
    }
  };

  const handleDelete = async (id, ticker) => {
    try {
      const res = await deleteStockApi(id);
      if (res.success) {
        showToast(`${ticker} 자산이 삭제되었습니다.`, 'danger');
        loadStocks();
      } else {
        showToast(res.error?.message || '자산 삭제에 실패했습니다.', 'danger');
      }
    } catch {
      showToast('서버 오류로 삭제하지 못했습니다.', 'danger');
    }
  };

  const totalAmount = stocks.reduce((acc, stock) => acc + (stock.price * stock.quantity), 0);

  const chartData = {
    labels: stocks.map(s => s.ticker),
    datasets: [{
      data: stocks.map(s => s.price * s.quantity),
      backgroundColor: ['#6366f1', '#a855f7', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
      borderWidth: theme === 'dark' ? 2 : 1,
      borderColor: theme === 'dark' ? '#111827' : '#ffffff',
      hoverOffset: 6,
    }],
  };
  const chartOptions = { cutout: '75%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: $${ctx.parsed.toLocaleString(undefined, {minimumFractionDigits:2})} (${((ctx.parsed/totalAmount)*100).toFixed(1)}%)` } } }, maintainAspectRatio: false };

  return (
    <section className="tab-panel active">
      <div className="portfolio-grid">
        <div className="glass-card portfolio-summary">
          <h2 className="total-title">보유 자산 평가액</h2>
          <div className="total-amount">$ {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          {loading ? (
            <div style={{ height: '220px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <i className="fa-solid fa-spinner fa-spin"></i><span style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>서버에서 데이터를 불러오는 중...</span>
            </div>
          ) : stocks.length > 0 ? (
            <div className="chart-wrapper">
              <Doughnut data={chartData} options={chartOptions} />
              <div className="chart-center-text"><div className="chart-label">Assets</div><div className="chart-value">{stocks.length}개</div></div>
            </div>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>등록된 자산이 없습니다.</span>
            </div>
          )}
          <div className="fallback-badge"><i className="fa-solid fa-cloud"></i> 백엔드 API 연동 모드</div>
        </div>

        <div className="glass-card">
          <div className="section-header">
            <h2 className="section-title"><i className="fa-solid fa-wallet"></i> 자산 포트폴리오 목록</h2>
            <button className="btn-add-stock" onClick={() => setIsModalOpen(true)} title="새 자산 등록"><i className="fa-solid fa-plus"></i></button>
          </div>
          <div className="stock-table-container">
            <table className="stock-table">
              <thead><tr><th>종목(Ticker)</th><th>평균 단가</th><th style={{textAlign:'right'}}>보유수량</th><th style={{textAlign:'right'}}>평가금액</th><th style={{textAlign:'right', width:'50px'}}>관리</th></tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="5" className="empty-state"><i className="fa-solid fa-spinner fa-spin"></i><p>데이터 로딩 중...</p></td></tr>
                ) : stocks.length > 0 ? (
                  stocks.map(s => (
                    <tr key={s.stockId}>
                      <td className="ticker-cell">{s.ticker}</td>
                      <td>${s.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td style={{ textAlign: 'right' }}>{s.quantity}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>${(s.price * s.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="action-cell"><button className="btn-delete" onClick={() => handleDelete(s.stockId, s.ticker)} title="삭제"><i className="fa-solid fa-trash-can"></i></button></td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="empty-state"><i className="fa-solid fa-folder-open"></i><p>등록된 자산이 없습니다. 우측 상단 '+' 버튼을 눌러 등록해 보세요.</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="새 자산 등록" icon="fa-cart-plus">
        <form onSubmit={handleAddStock}>
          <div className="form-group">
            <label className="form-label" htmlFor="tickerInput">종목 코드 (Ticker)</label>
            <input type="text" id="tickerInput" placeholder="예: AAPL, TSLA, BTC" className="form-input" value={newTicker} onChange={(e) => setNewTicker(e.target.value)} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="priceInput">평균 매입 단가 ($)</label>
              <input type="number" id="priceInput" placeholder="0.00" min="0" step="any" className="form-input" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="qtyInput">보유 수량</label>
              <input type="number" id="qtyInput" placeholder="0" min="0" step="any" className="form-input" value={newQuantity} onChange={(e) => setNewQuantity(e.target.value)} required />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>취소</button>
            <button type="submit" className="btn btn-primary">등록하기</button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
