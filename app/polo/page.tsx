'use client'

import { useState, useRef } from 'react'

const IMGS = ['f1.png','f2.png','f3.png','f4.png','f5.png','f6.png','f7.png']

const SIZES = ['P','M','G','GG','XG','XGG']

const MARQUEE_IMGS = ['f3.png','f4.png','f5.png','f6.png','f7.png','f1.png','f2.png']

const TESTIMONIALS = [
  { init: 'RB', stars: 5, text: 'Qualidade impecável, tecido fino e acabamento premium. Vale cada centavo do kit.' },
  { init: 'TA', stars: 5, text: 'Comprei para trabalhar e ficou perfeito. As cores combinam com tudo no meu guarda-roupa.' },
  { init: 'MS', stars: 5, text: 'Chegou super rápido e bem embalado. As 5 polos são lindas, já lavei e não desbotou nada.' },
  { init: 'JF', stars: 5, text: 'Presenteei meu marido e ele adorou. O tecido é muito bom, nada a ver com polo de loja comum.' },
  { init: 'LC', stars: 5, text: 'Melhor compra do mês. Cinco cores atemporais por esse preço é difícil de bater.' },
]

const REVIEWS = [
  { init: 'M', name: 'Marcos Oliveira', date: 'Fevereiro 13, 2026', text: 'Kit chegou bem embalado e no prazo. Qualidade do tecido piqué é excelente, muito superior ao esperado pelo preço. Altamente recomendo!', imgs: ['/polo/f1.png', '/polo/f2.png'] },
  { init: 'R', name: 'Renata Souza', date: 'Fevereiro 11, 2026', text: 'As 5 polos são todas lindas. Tecido encorpado, costura impecável e o caimento é perfeito. Já quero comprar mais um kit!', imgs: ['/polo/f5.png'] },
  { init: 'G', name: 'Gustavo Nunes', date: 'Fevereiro 9, 2026', text: 'Entrega rápida e produto conforme descrito. As polos têm acabamento de primeira, bordado perfeito. Compra aprovada!' },
  { init: 'S', name: 'Sandra Mota', date: 'Fevereiro 7, 2026', text: 'Comprei para o meu filho e ele ficou encantado. As cores são exatamente como na foto. Já vou pedir mais um kit!', imgs: ['/polo/f3.png', '/polo/f4.png'] },
  { init: 'C', name: 'Carlos Ferreira', date: 'Fevereiro 5, 2026', text: 'Produto de altíssima qualidade. Tecido piqué premium e bordado impecável. Muito satisfeito com a compra.' },
  { init: 'P', name: 'Patrícia Alves', date: 'Fevereiro 3, 2026', text: 'Presenteei meu pai e ele adorou! As polos têm caimento excelente. A entrega foi rápida e bem embalada.', imgs: ['/polo/f6.png', '/polo/f7.png'] },
  { init: 'E', name: 'Eduardo Barbosa', date: 'Fevereiro 1, 2026', text: 'Excelente custo-benefício! 5 polos premium por esse preço é imperdível. O tecido é muito bonito e resistente.' },
  { init: 'L', name: 'Luiz Henrique', date: 'Janeiro 29, 2026', text: 'Super satisfeito! As polos são lindas, bem acabadas e confortáveis. Já lavei várias vezes e não desbotaram.', imgs: ['/polo/f2.png'] },
  { init: 'F', name: 'Fátima Rocha', date: 'Janeiro 27, 2026', text: 'Comprei para presentear meu filho. Ele usou e disse que é o melhor kit de polos que já teve. Vai pedir mais um!' },
  { init: 'Ro', name: 'Roberto Carvalho', date: 'Janeiro 25, 2026', text: 'Chegou em apenas 5 dias úteis. As polos são de ótima qualidade, o caimento é perfeito e as cores são exatamente como na foto.', imgs: ['/polo/f1.png'] },
]

const CHECKOUT_URL = 'https://loja.zyron-oficial.sbs/pay/fb39577f-b044-41a1-9cec-74751d658c10'

export default function PoloPage() {
  const [mainImg, setMainImg] = useState(IMGS[0])
  const [activeThumb, setActiveThumb] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sizePickerOpen, setSizePickerOpen] = useState(false)
  const [pendingSize, setPendingSize] = useState('M')

  const overlayRef = useRef<HTMLDivElement>(null)

  function buyNow(size?: string) {
    const sz = size || selectedSize
    sessionStorage.setItem('selected_size', sz)
    window.location.href = CHECKOUT_URL
  }

  function selectThumb(i: number) {
    setActiveThumb(i)
    setMainImg(IMGS[i])
  }

  return (
    <>
      {drawerOpen && (
        <div
          ref={overlayRef}
          className="lp-overlay"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside className={`lp-drawer${drawerOpen ? ' on' : ''}`}>
        <div className="lp-drawer-h">
          <div className="logo">ZYRON</div>
          <button className="lp-drawer-close" onClick={() => setDrawerOpen(false)}>×</button>
        </div>
        <nav className="lp-drawer-nav">
          <a href="#" onClick={() => setDrawerOpen(false)}>
            <svg viewBox="0 0 24 24"><path d="M3 12l9-9 9 9"/><path d="M5 10v10h14V10"/></svg>
            Início
          </a>
          <a href="#faq" onClick={() => setDrawerOpen(false)}>
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16v.1"/></svg>
            FAQ
          </a>
          <a href="#contato" onClick={() => setDrawerOpen(false)}>
            <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>
            Contato
          </a>
        </nav>
        <div className="lp-drawer-foot">© ZYRON · help@zyron.co</div>
      </aside>

      <div className="lp-wrap">

        {/* topbar */}
        <div className="lp-topbar">
          <span className="heart">♡</span> Elegância e Qualidade em um clique
        </div>

        {/* header */}
        <header className="lp-header">
          <button className="lp-menu" onClick={() => setDrawerOpen(true)} aria-label="Menu">☰</button>
          <div className="logo">ZYRON</div>
          <span style={{ width: 28 }} />
        </header>

        {/* breadcrumb */}
        <nav className="lp-bread">
          <a href="/">Home</a><span className="sep">/</span><a href="#">Polos</a><span className="sep">/</span>
          <span className="cur">Kit 5 Polos Masculinas Clássicas Premium – Pague 3, Leve 5</span>
        </nav>

        {/* gallery */}
        <div className="lp-gal">
          <div className="lp-gal-main">
            <img src={`/polo/${mainImg}`} alt="Polo Clássica Premium" />
          </div>
          <div className="lp-thumbs">
            {IMGS.map((img, i) => (
              <button
                key={i}
                className={activeThumb === i ? 'active' : ''}
                onClick={() => selectThumb(i)}
              >
                <img src={`/polo/${img}`} alt={`Foto ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* badges */}
        <div className="lp-badges">
          <span className="lp-badge lp-badge-promo">Promoção: Pague 3 Leve 5</span>
          <span className="lp-badge lp-badge-off">57% OFF</span>
        </div>

        {/* title */}
        <h1 className="lp-title">Kit 5 Polos Masculinas Clássicas Premium – Pague 3, Leve 5</h1>

        {/* meta */}
        <div className="lp-meta">Cód. ZYR5POLO8821 | Em estoque.</div>

        {/* stars */}
        <div className="lp-stars-row">
          <span className="lp-stars">★★★★★</span>
          <span>(418 avaliações)</span>
        </div>

        {/* price */}
        <div className="lp-price">
          <span className="lp-price-old">R$ 299,00</span>
          <span className="lp-price-now">R$ 127,90</span>
        </div>
        <div className="lp-eco">Economia de R$ 171,10</div>

        {/* sizes */}
        <div className="lp-sizes">
          <div className="lp-sizes-label">Tamanho:</div>
          <div className="lp-sizes-grid">
            {SIZES.map(sz => (
              <button
                key={sz}
                className={`lp-size${selectedSize === sz ? ' active' : ''}`}
                onClick={() => setSelectedSize(sz)}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* buy btn */}
        <button className="lp-buy" onClick={() => buyNow(selectedSize)}>
          Comprar agora
        </button>

        {/* pay */}
        <div className="lp-pay-static">
          🔒 Pague com segurança usando <b>estas opções de pagamento</b>
        </div>

        {/* trust 3 */}
        <div className="lp-trust3">
          <div className="lp-trust-card">
            <svg viewBox="0 0 24 24"><path d="M3 6h13v10H3z"/><path d="M16 9h4l2 3v4h-6z"/><circle cx="7" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>
            <b>Frete Grátis</b><span>para todo Brasil</span>
          </div>
          <div className="lp-trust-card">
            <svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>
            <b>Compra Segura</b><span>seus dados protegidos</span>
          </div>
          <div className="lp-trust-card">
            <svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0114-5l2-2v6h-6"/><path d="M20 12a8 8 0 01-14 5l-2 2v-6h6"/></svg>
            <b>Troca Grátis</b><span>em até 30 dias</span>
          </div>
        </div>

        {/* MP badge */}
        <div className="lp-mp">
          <div className="lp-mp-logo">
            <img src="/assets/mercado.png" alt="Mercado Líder Premium" style={{ width: 48, height: 48, objectFit: 'contain' }} />
          </div>
          <div className="lp-mp-title">Mercado Líder Premium</div>
          <div className="lp-mp-sub">Um dos melhores sites da plataforma!</div>
          <div className="lp-mp-bars"><i/><i/><i/><i/><i/></div>
          <div className="lp-mp-stats">
            <div className="col"><div className="big">36907</div><small>Vendas nos<br/>últimos 60<br/>dias</small></div>
            <div className="col">
              <svg viewBox="0 0 24 24"><rect x="3" y="5" width="14" height="11" rx="2"/><circle cx="18" cy="12" r="4" fill="#16a34a" stroke="#16a34a"/><path d="M16.5 12l1 1 2-2" stroke="#fff" strokeWidth="2"/></svg>
              <small>Presta um<br/>bom<br/>atendimento</small>
            </div>
            <div className="col">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2"/><circle cx="18" cy="7" r="3" fill="#16a34a" stroke="#16a34a"/><path d="M16.6 7l1 1 1.8-2" stroke="#fff" strokeWidth="1.6"/></svg>
              <small>Entrega os<br/>produtos<br/>dentro<br/>do prazo</small>
            </div>
          </div>
        </div>

        {/* community vitrine */}
        <div className="lp-vitrine">
          <div className="lp-vitrine-eyebrow">COMUNIDADE ZYRON</div>
          <div className="lp-vitrine-title">Junte-se a <b>50.000+</b><br/>clientes satisfeitos</div>
          <div className="lp-vitrine-marquee">
            <div className="lp-vitrine-track">
              {[...MARQUEE_IMGS, ...MARQUEE_IMGS].map((img, i) => (
                <div key={i} className="lp-vitrine-slide">
                  <img src={`/polo/${img}`} alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* desc */}
        <div className="lp-desc-h">DESCRIÇÃO DO PRODUTO</div>

        {/* promo dark */}
        <div className="lp-promo-dark">
          <span className="lp-pill">PROMOÇÃO PAGUE 3 · LEVE 5</span>
          <h3>Vista-se com <span className="gold">presença</span><br/>todos os dias da semana</h3>
          <p>5 polos masculinas clássicas premium pelo preço de 3. Um kit pensado para quem quer um visual elegante, versátil e atemporal.</p>
          <div className="lp-boxes">
            <div className="b"><div className="v">5</div><div className="l">POLOS</div></div>
            <div className="b"><div className="v">1</div><div className="l">PREÇO</div></div>
            <div className="b"><div className="v">R$ 25</div><div className="l">POR PEÇA</div></div>
          </div>
        </div>

        {/* alert */}
        <div className="lp-alert">
          <div className="lp-alert-ic">⚠</div>
          <div>Restam poucas unidades do lote promocional</div>
        </div>

        {/* features */}
        <div className="lp-eyebrow">POR QUE ESSE KIT FUNCIONA</div>
        <h2 className="lp-h2">Cuidado com cada detalhe</h2>
        <div className="lp-divider" />
        <div className="lp-features">
          {[
            { title: 'Tecido Piqué Premium', desc: 'Estrutura firme, toque suave, respirável e de excelente durabilidade.' },
            { title: 'Modelagem Clássica', desc: 'Caimento perfeito para o trabalho, eventos e o dia a dia sem esforço.' },
            { title: '5 Cores Atemporais', desc: 'Branco, Preto, Navy, Cinza e Bege: combinações infalíveis para qualquer ocasião.' },
            { title: 'Envio Rápido do Brasil', desc: 'Despacho com agilidade e rastreio do início ao fim da entrega.' },
          ].map((f, i) => (
            <div key={i} className="lp-feat">
              <div className="lp-icbox">
                <svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-12"/></svg>
              </div>
              <div><b>{f.title}</b><span>{f.desc}</span></div>
            </div>
          ))}
        </div>

        {/* kit colors */}
        <div className="lp-kit">
          <div className="lp-kit-eb">O QUE VEM NO KIT</div>
          <h3>5 polos, 5 cores, 1 só compra</h3>
          <div className="lp-colors">
            {[
              { bg: '#111', label: 'Preto' },
              { bg: '#1e3a8a', label: 'Navy' },
              { bg: '#c4a47a', label: 'Bege' },
              { bg: '#d1d5db', label: 'Cinza' },
              { bg: '#f3ead8', label: 'Branco' },
            ].map((c, i) => (
              <div key={i} className="lp-color">
                <div className="lp-dot" style={{ background: c.bg }} />
                <small>{c.label}</small>
              </div>
            ))}
          </div>
          <div className="lp-sizes-note">TAMANHOS DISPONÍVEIS: P · M · G · GG · XG · XGG</div>
        </div>

        {/* compare */}
        <div className="lp-compare">
          <div className="lp-eyebrow">POR QUE ESCOLHER A ZYRON</div>
          <h3>Compare antes de decidir</h3>
          <div className="lp-divider" />
          <table>
            <thead>
              <tr>
                <th>Critério</th>
                <th className="gold">Kit Zyron</th>
                <th className="red">Loja Comum</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>5 polos por uma compra</td><td>Sim</td><td>Não</td></tr>
              <tr><td>Tecido Piqué Premium</td><td>Sim</td><td>Tecido básico</td></tr>
              <tr><td>Preço por peça</td><td>R$ 25,58</td><td>R$ 89+</td></tr>
              <tr><td>Troca em 7 dias garantida</td><td>Sim</td><td>Limitada</td></tr>
              <tr><td>Envio do Brasil</td><td>Sim</td><td>Importado</td></tr>
            </tbody>
          </table>
        </div>

        {/* how */}
        <div className="lp-eyebrow">SIMPLES E RÁPIDO</div>
        <h2 className="lp-h2">Como funciona</h2>
        <div className="lp-divider" />
        <div className="lp-how">
          {[
            { n: '1', title: 'Escolha seu tamanho', desc: 'Selecione o tamanho de P ao XGG e personalize seu kit.' },
            { n: '2', title: 'Finalize com segurança', desc: 'Pague via Pix de forma rápida e segura. Compra protegida.' },
            { n: '3', title: 'Receba em casa', desc: 'Despacho rápido com rastreio. Vista-se bem o ano inteiro.' },
          ].map((h, i) => (
            <div key={i} className="lp-how-card">
              <div className="lp-how-num">{h.n}</div>
              <b>{h.title}</b>
              <span>{h.desc}</span>
            </div>
          ))}
        </div>

        {/* warranty */}
        <div className="lp-warranty">
          <div className="lp-warranty-ic">
            <svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <div>
            <b>Garantia de 7 dias</b>
            <span>Se não amar o caimento, a gente troca ou devolve seu dinheiro. Sem complicação, conforme o CDC.</span>
          </div>
        </div>

        {/* testimonials */}
        <div className="lp-eyebrow">QUEM VESTIU, RECOMENDA</div>
        <h2 className="lp-h2">Avaliações reais de clientes</h2>
        <div className="lp-divider" />
        <div className="lp-testi">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="lp-testi-card">
              <div className="lp-av" style={{ width: 52, height: 52, borderRadius: '50%', background: '#111', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, margin: '0 auto 8px' }}>{t.init}</div>
              <div className="lp-testi-quote">"</div>
              <div className="lp-stars">{'★'.repeat(t.stars)}</div>
              <p>{t.text}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="lp-eyebrow">TIRE SUAS DÚVIDAS</div>
        <h2 className="lp-h2">Perguntas Frequentes</h2>
        <div className="lp-divider" />
        <div className="lp-faq" id="faq">
          {[
            { q: 'Quais são as formas de pagamento?', a: 'Aceitamos Pix. Tudo via ambiente 100% seguro com criptografia.' },
            { q: 'Qual o prazo de entrega?', a: 'Despachamos rapidamente do Brasil com código de rastreio. PAC de 3 a 9 dias úteis, SEDEX de 2 a 5 dias úteis.' },
            { q: 'Como funciona a troca ou devolução?', a: 'Você tem até 7 dias após o recebimento para solicitar a troca ou devolução, sem burocracia, conforme o Código de Defesa do Consumidor.' },
            { q: 'O produto tem garantia?', a: 'Sim. Garantia de qualidade em todas as peças. Se houver qualquer defeito de fabricação, trataremos com agilidade.' },
            { q: 'Como escolher o tamanho correto?', a: 'Siga a tabela: P (46-48), M (50-52), G (54-56), GG (58-60). Em caso de dúvida, escolha o tamanho maior.' },
          ].map((item, i) => (
            <details key={i}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        {/* final CTA */}
        <div className="lp-cta">
          <span className="lp-pill">GARANTA O SEU KIT</span>
          <h3>5 polos. 1 compra.<br/>Pra sempre estiloso.</h3>
          <p className="lp-cta-desc">Promoção Pague 3, Leve 5 enquanto durarem as últimas unidades.</p>
          <div className="lp-cta-prices">
            <span className="now">R$ 127,90</span>
            <span className="old">R$ 299,00</span>
          </div>
          <button
            className="lp-cta-btn"
            onClick={() => { setPendingSize(selectedSize); setSizePickerOpen(true) }}
          >
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12L5 3H2"/>
              <circle cx="9" cy="20" r="1.5"/>
              <circle cx="18" cy="20" r="1.5"/>
            </svg>
            COMPRAR AGORA
          </button>
          <div className="lp-cta-ext">Pagamento via Pix · Entrega garantida</div>
        </div>

        {/* specs */}
        <div className="lp-specs">
          <h4>Características</h4>
          <ul>
            <li>Tecido Piqué Premium respirável</li>
            <li>Gola polo estruturada com botões</li>
            <li>Bordado clássico no peito</li>
            <li>Modelagem clássica com comprimento ideal</li>
            <li>Durabilidade garantida lavagem após lavagem</li>
          </ul>
          <h4>Composição</h4>
          <p>100% algodão piqué de alta qualidade. Produzido com fios certificados, garantindo maciez, durabilidade e conforto superior.</p>
          <h4>Cuidados</h4>
          <ul>
            <li>Lavar à máquina em água fria</li>
            <li>Não usar alvejante</li>
            <li>Secar à sombra</li>
            <li>Passar em temperatura média</li>
          </ul>
        </div>

        {/* mini trust */}
        <div className="lp-minitrust">
          <div className="lp-minitrust-c">
            <svg viewBox="0 0 24 24"><path d="M4 7l8-3 8 3v10l-8 3-8-3z"/><path d="M9 13l2 2 4-4"/></svg>
            <b>ENTREGA SEGURA<br/>TODO BRASIL</b>
          </div>
          <div className="lp-minitrust-c">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            <b>DEVOLUÇÃO<br/>30 DIAS</b>
          </div>
          <div className="lp-minitrust-c">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="#111"/></svg>
            <b>GARANTIA DE<br/>QUALIDADE</b>
          </div>
        </div>

        {/* why zyron */}
        <div className="lp-why-h">POR QUE ESCOLHER A<br/><b>ZYRON?</b></div>
        <div className="lp-whycards">
          {[
            { icon: <svg viewBox="0 0 24 24"><path d="M3 7h13v10H3z"/><path d="M16 10h4l1 2v5h-5z"/><circle cx="7" cy="18" r="1.5"/><circle cx="18" cy="18" r="1.5"/></svg>, title: 'FRETE GRÁTIS', desc: 'Envio imediato para todo o Brasil' },
            { icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>, title: 'DEVOLUÇÃO', desc: '90 dias de garantia em todas as suas compras' },
            { icon: <svg viewBox="0 0 24 24"><path d="M12 22s7-7 7-13a7 7 0 10-14 0c0 6 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></svg>, title: 'RASTREIO', desc: 'Atualizações em tempo real do seu pedido' },
            { icon: <svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20"/></svg>, title: 'PAGAMENTO', desc: 'Pix seguro com confirmação automática' },
          ].map((w, i) => (
            <div key={i} className="lp-whycard">
              {w.icon}
              <div><b>{w.title}</b><span>{w.desc}</span></div>
            </div>
          ))}
        </div>

        {/* safe buy */}
        <div className="lp-safebuy">
          <h3>COMPRA SEGURA</h3>
          <p>Sua compra protegida pela<br/><b>Lei nº 8.078/1990 – Código de Defesa do Consumidor.</b> Até 7 dias após<br/>o recebimento para troca ou devolução,<br/>sem complicação.</p>
        </div>

        {/* attention */}
        <div className="lp-att">
          <div className="lp-att-ic">
            <svg viewBox="0 0 24 24"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M12 7v5M12 15v.1"/></svg>
          </div>
          <h3>ATENÇÃO: NÃO CAIA EM GOLPES</h3>
          <p>A ZYRON entrega mais de <b>50.000 pedidos<br/>anualmente</b>.<br/>Isso graças à confiança de nossos clientes e reputação<br/>consolidada no mercado.</p>
          <div className="lp-att-box">Nunca forneça dados pessoais ou bancários por<br/>mensagens suspeitas. Entre em contato apenas<br/>com nosso SAC oficial.</div>
        </div>

        {/* aggregate reviews */}
        <div className="lp-reviews">
          <div className="lp-reviews-h">AVALIAÇÕES DOS CLIENTES</div>
          <div className="lp-agg">
            <div className="score">4.9</div>
            <div className="ss"><span>★★★★★</span></div>
            <div className="based">Baseado em 418 avaliações</div>
            {[['5 estrelas', '92%', 385], ['4 estrelas', '10%', 20], ['3 estrelas', '6%', 8], ['2 estrelas', '2%', 3], ['1 estrelas', '3%', 2]].map(([lbl, pct, n]) => (
              <div key={lbl as string} className="row">
                <span>{lbl}</span>
                <div className="bar"><i style={{ width: pct as string }} /></div>
                <span className="n">{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* reviews list */}
        <div className="lp-rlist">
          {REVIEWS.map((r, i) => (
            <div key={i} className="lp-review">
              <div className="lp-review-h">
                <div className="lp-av">{r.init}</div>
                <div className="lp-rnm">
                  <b>{r.name}</b>
                  <small>{r.date}</small>
                </div>
                <div className="lp-rst">★★★★★</div>
              </div>
              <p>{r.text}</p>
              {r.imgs && r.imgs.length > 0 && (
                <div className="lp-review-imgs">
                  {r.imgs.map((src, j) => (
                    <img key={j} src={src} alt={`Foto do cliente ${r.name}`} className="lp-review-img" />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* footer */}
        <footer className="lp-foot" id="contato">
          <h5>ATENDIMENTO AO CLIENTE</h5>
          <div className="lp-foot-line">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            <span>Atendimento: seg. à sex. 09 às 18h</span>
          </div>
          <div className="lp-foot-line">
            <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>
            <span>help@zyron.co</span>
          </div>
          <h5>POLÍTICAS E TERMOS</h5>
          {['Aviso Legal','Formas de Pagamento','Política de Devolução','Política de Privacidade e Cookies','Política de Frete','Política de Privacidade','Política de Troca e Devolução','Termos de Serviço'].map(l => (
            <a key={l} href="#">{l}</a>
          ))}
          <h5>INFORMAÇÕES</h5>
          {['Contato','Rastrear Pedido','Sobre Nós','Informações Gerais','Busca','FAQ'].map(l => (
            <a key={l} href="#">{l}</a>
          ))}
        </footer>

      </div>

      {/* WhatsApp flutuante */}
      <a
        href="https://wa.me/5582956345244"
        target="_blank"
        rel="noopener noreferrer"
        className="lp-whatsapp-btn"
        aria-label="Contato via WhatsApp"
      >
        <img src="/assets/whatsapp.png" alt="WhatsApp" width={44} height={44} />
      </a>

      {/* Sticky bar fixa */}
      <div className="lp-sticky-bar">
        <button
          className="lp-stk-buy"
          onClick={() => { setPendingSize(selectedSize); setSizePickerOpen(true) }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12L5 3H2"/>
              <circle cx="9" cy="20" r="1.5"/>
              <circle cx="18" cy="20" r="1.5"/>
            </svg>
            COMPRAR AGORA
          </span>
          <span>R$ 127,90</span>
        </button>
      </div>

      {/* Size picker bottom sheet */}
      {sizePickerOpen && (
        <>
          <div
            className="lp-sheet-overlay"
            onClick={() => setSizePickerOpen(false)}
          />
          <div className="lp-size-sheet">
            <div className="lp-sheet-handle" />
            <div className="lp-sheet-title">Selecione o tamanho</div>
            <div className="lp-sheet-label">TAMANHO</div>
            <div className="lp-sheet-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {SIZES.map(sz => (
                <button
                  key={sz}
                  className={`lp-size${pendingSize === sz ? ' active' : ''}`}
                  onClick={() => setPendingSize(sz)}
                >
                  {sz}
                </button>
              ))}
            </div>
            <button
              className="lp-sheet-confirm"
              onClick={() => {
                setSelectedSize(pendingSize)
                setSizePickerOpen(false)
                buyNow(pendingSize)
              }}
            >
              Confirmar e comprar &nbsp;·&nbsp; R$ 127,90
            </button>
            <button className="lp-sheet-cancel" onClick={() => setSizePickerOpen(false)}>
              Cancelar
            </button>
          </div>
        </>
      )}
    </>
  )
}
