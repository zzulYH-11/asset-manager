import React, { useState, useEffect } from 'react';
import { fetchNewsApi } from '../api/client';
import { cleanText, formatDate } from '../utils/formatters';
import { useToast } from '../contexts/ToastContext';

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      try {
        const res = await fetchNewsApi('미국 증시 시황');
        if (res.items && Array.isArray(res.items)) setNewsList(res.items);
        else if (res.success && res.data?.items) setNewsList(res.data.items);
        else if (res.success && Array.isArray(res.data)) setNewsList(res.data);
        else showToast(res.error?.message || '뉴스를 불러오지 못했습니다.', 'danger');
      } catch {
        showToast('뉴스 데이터를 가져오는 중 통신 오류가 발생했습니다.', 'danger');
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [showToast]);

  return (
    <section className="tab-panel active">
      <div className="glass-card">
        <div className="section-header">
          <h2 className="section-title"><i className="fa-solid fa-newspaper" style={{ color: 'var(--primary)' }}></i> 실시간 주요 경제 뉴스</h2>
        </div>
        {loading ? (
          <div style={{ padding: '3rem 0', textAlign: 'center' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: 'var(--primary)' }}></i>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-tertiary)' }}>뉴스 피드를 가져오는 중...</p>
          </div>
        ) : newsList.length > 0 ? (
          <div className="news-list">
            {newsList.map((news, idx) => (
              <a key={idx} href={news.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block' }}>
                <div className="news-card">
                  <div className="news-meta"><span className="news-source">네이버 뉴스</span><span>•</span><span>{formatDate(news.pubDate)}</span></div>
                  <h3 className="news-title">{cleanText(news.title)}</h3>
                  <p className="news-summary">{cleanText(news.description)}</p>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-tertiary)' }}>뉴스가 존재하지 않거나 가져오지 못했습니다.</div>
        )}
      </div>
    </section>
  );
}
