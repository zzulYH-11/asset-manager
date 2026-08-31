import React, { useState, useEffect } from 'react';
import { fetchIndicatorsApi } from '../api/client';
import { useToast } from '../contexts/ToastContext';

export default function Indicators() {
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadIndicators = async () => {
      setLoading(true);
      try {
        const res = await fetchIndicatorsApi();
        if (res.success) setIndicators(res.data || []);
        else showToast(res.error?.message || '지표를 불러오지 못했습니다.', 'danger');
      } catch {
        showToast('통신 오류', 'danger');
      } finally {
        setLoading(false);
      }
    };
    loadIndicators();
  }, [showToast]);

  return (
    <section className="tab-panel active">
      <div className="glass-card">
        <div className="section-header">
          <h2 className="section-title"><i className="fa-solid fa-chart-line" style={{ color: 'var(--accent)' }}></i> 글로벌 핵심 시장 지표</h2>
        </div>
        {loading ? (
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
                  <i className={`fa-solid ${ind.isUp ? 'fa-caret-up' : 'fa-caret-down'}`}></i>{ind.change}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>시장 지표가 존재하지 않거나 가져오지 못했습니다.</div>
        )}
        <div className="info-note"><i className="fa-solid fa-circle-info"></i> 위 시장 지표 데이터는 예시 시세 정보이며, 실시간 실거래와 오차가 발생할 수 있습니다.</div>
      </div>
    </section>
  );
}
