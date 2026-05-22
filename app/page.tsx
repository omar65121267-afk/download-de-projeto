'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const IMGS = [
  'fotoproduto1.webp',
  'fotoproduto2.webp',
  'fotoproduto3.webp',
  'fotoproduto4.webp',
  'fotoproduto5.webp',
  'fotoproduto6.webp',
  'fotoproduto7.webp',
  'fotoproduto8.webp',
]

const SIZES = ['36','38','40','42','44','46','48','50','52','54']

const MARQUEE_IMGS = ['calca1.webp','calca2.webp','calca3.webp','calca4.webp','calca5.webp','calca6.webp']

const TESTIMONIALS = [
  { pic: 'dep1.jpg', stars: 5, text: 'Sinceramente surpreendido. Tecido firme, caimento ótimo e o preço por peça é absurdo de bom.' },
  { pic: 'dep2.jpg', stars: 5, text: 'Comprei pra renovar o guarda-roupa e foi a melhor decisão. Cinco cores, combina com tudo.' },
  { pic: 'dep3.jpg', stars: 5, text: 'Chegou rápido e bem embalado. Já estou de olho em comprar mais um kit pra dar de presente.' },
  { pic: 'dep4.jpg', stars: 5, text: 'Servem perfeitamente. O acabamento é de loja cara. Recomendo pra quem cansou de pagar caro por uma só.' },
  { pic: 'dep5.jpg', stars: 5, text: 'Calças confortáveis, qualidade excelente. Já comprei e indiquei pra vários amigos.' },
]

const REVIEWS = [
  { init: 'M', name: 'Marcos Oliveira', date: 'Fevereiro 13, 2026', text: 'Produto chegou bem embalado e no prazo. A qualidade da sarja é excelente, muito melhor do que eu esperava pelo preço. Vale muito a pena o kit!' },
  { init: 'R', name: 'Raimundo Souza', date: 'Fevereiro 11, 2026', text: 'Comprei o kit e fiquei impressionado. As 5 calças são todas de ótima qualidade, o tecido é encorpado e bem acabado. Recomendo demais!' },
  { init: 'G', name: 'Gilberto Nunes', date: 'Fevereiro 9, 2026', text: 'Entrega rápida, produto conforme descrito. As calças têm um caimento ótimo e o material é de primeira. Compra aprovada!' },
  { init: 'S', name: 'Sandra Mota', date: 'Fevereiro 7, 2026', text: 'Comprei para o meu marido e ele ficou encantado com a qualidade. As cores são exatamente como na foto. Já vou pedir mais um kit!' },
  { init: 'C', name: 'Claudio Ferreira', date: 'Fevereiro 5, 2026', text: 'Produto de altíssima qualidade. As costuras são impecáveis e o tecido tem uma maciez incrível. Muito satisfeito com a compra.' },
  { init: 'P', name: 'Patrícia Alves', date: 'Fevereiro 3, 2026', text: 'Presenteei meu pai e ele adorou! As calças têm um caimento excelente e o material é muito bonito. A entrega foi rápida e bem embalada.' },
  { init: 'E', name: 'Eduardo Barbosa', date: 'Fevereiro 1, 2026', text: 'Excelente custo-benefício! 5 calças de qualidade premium por esse preço é imperdível. O tecido sarja retrô é muito bonito e resistente.' },
  { init: 'L', name: 'Luiz Henrique', date: 'Janeiro 29, 2026', text: 'Super satisfeito! As calças são lindas, bem acabadas e confortáveis. Já lavei duas vezes e não desbotaram nada. Excelente produto!' },
  { init: 'F', name: 'Fátima Rocha', date: 'Janeiro 27, 2026', text: 'Comprei para presentear meu filho. Ele usou e disse que é o melhor kit de calças que já teve. Vai pedir mais um para o irmão!' },
  { init: 'R2', name: 'Roberto Carvalho', date: 'Janeiro 25, 2026', text: 'Chegou rapidinho, em apenas 6 dias úteis. As calças são de ótima qualidade, o caimento é perfeito e as cores são exatamente como na foto.' },
]

export default function LandingPage() {
  const router = useRouter()
  const [mainImg, setMainImg] = useState(IMGS[0])
  const [activeThumb, setActiveThumb] = useState(0)
  const [selectedSize, setSelectedSize] = useState('36')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const overlayRef = useRef<HTMLDivElement>(null)

  function buyNow(size?: string) {
    const sz = size || selectedSize
    sessionStorage.setItem('selected_size', sz)
    router.push('/checkout')
  }

  function selectThumb(i: number) {
    setActiveThumb(i)
    setMainImg(IMGS[i])
  }

  return (
    <>
      {/* overlay drawer */}
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

        {/* 1 topbar */}
        <div className="lp-topbar">
          <span className="heart">♡</span> Diversidade e Qualidade em um clique
        </div>

        {/* 2 header */}
        <header className="lp-header">
          <button className="lp-menu" onClick={() => setDrawerOpen(true)} aria-label="Menu">☰</button>
          <div className="logo">ZYRON</div>
          <span style={{ width: 28 }} />
        </header>

        {/* 3 breadcrumb */}
        <nav className="lp-bread">
          <a href="#">Home</a><span className="sep">/</span><a href="#">Calças</a><span className="sep">/</span>
          <span className="cur">Kit 5 Calças Masculinas em Sarja Retrô Premium – Pague 3, Leve 5</span>
        </nav>

        {/* 4 gallery */}
        <div className="lp-gal">
          <div className="lp-gal-main">
            <img src={`/assets/${mainImg}`} alt="Calça Sarja Retrô Premium" />
          </div>
          <div className="lp-thumbs">
            {IMGS.map((img, i) => (
              <button
                key={i}
                className={activeThumb === i ? 'active' : ''}
                onClick={() => selectThumb(i)}
              >
                <img src={`/assets/${img}`} alt={`Foto ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* 5 badges */}
        <div className="lp-badges">
          <span className="lp-badge lp-badge-promo">Promoção: Pague 3 Leve 5</span>
          <span className="lp-badge lp-badge-off">57% OFF</span>
        </div>

        {/* 6 title */}
        <h1 className="lp-title">Kit 5 Calças Masculinas em Sarja Retrô Premium – Pague 3, Leve 5</h1>

        {/* 7 meta */}
        <div className="lp-meta">Cód. ZYR2885634719 | Em estoque.</div>

        {/* 8 stars */}
        <div className="lp-stars-row">
          <span className="lp-stars">★★★★★</span>
          <span>(373 avaliações)</span>
        </div>

        {/* 9 price */}
        <div className="lp-price">
          <span className="lp-price-old">R$ 299,00</span>
          <span className="lp-price-now">R$ 127,90</span>
        </div>
        <div className="lp-eco">Economia de R$ 171,10</div>
        {/* 10 sizes */}
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

        {/* 11 buy btn */}
        <button className="lp-buy" onClick={() => buyNow(selectedSize)}>
          Comprar agora
        </button>

        {/* 12 pay */}
        <div className="lp-pay-static">
          🔒 Pague com segurança usando <b>estas opções de pagamento</b>
        </div>

        {/* 13 trust 3 */}
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

        {/* 14 MP badge */}
        <div className="lp-mp">
          <div className="lp-mp-logo">
            <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="22" fill="#fff" stroke="#3b82f6" strokeWidth="2"/><path d="M14 26c2-4 6-6 10-6s8 2 10 6" stroke="#1d4ed8" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M16 22l4 4 4-3 4 3 4-4" stroke="#1d4ed8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div className="lp-mp-title">MercadoPago Líder Platinum</div>
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

        {/* 15 community */}
        <div className="lp-community">Junte-se à nossa comunidade de <b>50.000+</b> clientes satisfeitos</div>

        {/* 16 marquee */}
        <div className="lp-marquee">
          <div className="lp-track">
            {[...MARQUEE_IMGS, ...MARQUEE_IMGS].map((img, i) => (
              <div key={i} className="lp-slide">
                <img src={`/assets/${img}`} alt="" />
              </div>
            ))}
          </div>
        </div>

        {/* 17 desc */}
        <div className="lp-desc-h">DESCRIÇÃO DO PRODUTO</div>

        {/* 18 promo dark */}
        <div className="lp-promo-dark">
          <span className="lp-pill">PROMOÇÃO PAGUE 3 · LEVE 5</span>
          <h3>Vista-se com <span className="gold">presença</span><br/>todos os dias da semana</h3>
          <p>5 calças de Sarja Retrô Premium pelo preço de 3. Um kit pensado para quem quer um visual maduro, prático e versátil.</p>
          <div className="lp-boxes">
            <div className="b"><div className="v">5</div><div className="l">CALÇAS</div></div>
            <div className="b"><div className="v">1</div><div className="l">PREÇO</div></div>
            <div className="b"><div className="v">R$ 25</div><div className="l">POR PEÇA</div></div>
          </div>
        </div>

        {/* 19 alert */}
        <div className="lp-alert">
          <div className="lp-alert-ic">⚠</div>
          <div>Restam poucas unidades do lote promocional</div>
        </div>

        {/* 20 features */}
        <div className="lp-eyebrow">POR QUE ESSE KIT FUNCIONA</div>
        <h2 className="lp-h2">Cuidado com cada detalhe</h2>
        <div className="lp-divider" />
        <div className="lp-features">
          {[
            { title: 'Sarja Retrô Premium', desc: 'Tecido de toque firme, caimento de alfaiataria e durabilidade superior.' },
            { title: 'Modelagem Versátil', desc: 'Funciona no trabalho, em compromissos e no dia a dia sem esforço.' },
            { title: '5 Cores Atemporais', desc: 'Combinações fáceis, sem erro: monte semanas inteiras com 1 só compra.' },
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

        {/* 21 kit colors */}
        <div className="lp-kit">
          <div className="lp-kit-eb">O QUE VEM NO KIT</div>
          <h3>5 calças, 5 cores, 1 só compra</h3>
          <div className="lp-colors">
            {[
              { bg: '#111', label: 'Preto' },
              { bg: '#1e3a8a', label: 'Marinho' },
              { bg: '#c4a47a', label: 'Cáqui' },
              { bg: '#d1d5db', label: 'Cinza' },
              { bg: '#f3ead8', label: 'Branco' },
            ].map((c, i) => (
              <div key={i} className="lp-color">
                <div className="lp-dot" style={{ background: c.bg }} />
                <small>{c.label}</small>
              </div>
            ))}
          </div>
          <div className="lp-sizes-note">TAMANHOS DISPONÍVEIS: 36 AO 54</div>
        </div>

        {/* 22 compare */}
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
              <tr><td>5 calças por uma compra</td><td>Sim</td><td>Não</td></tr>
              <tr><td>Sarja Retrô Premium</td><td>Sim</td><td>Tecido básico</td></tr>
              <tr><td>Preço por peça</td><td>R$ 25,58</td><td>R$ 89+</td></tr>
              <tr><td>Troca em 7 dias garantida</td><td>Sim</td><td>Limitada</td></tr>
              <tr><td>Envio do Brasil</td><td>Sim</td><td>Importado</td></tr>
            </tbody>
          </table>
        </div>

        {/* 23 how */}
        <div className="lp-eyebrow">SIMPLES E RÁPIDO</div>
        <h2 className="lp-h2">Como funciona</h2>
        <div className="lp-divider" />
        <div className="lp-how">
          {[
            { n: '1', title: 'Escolha seu tamanho', desc: 'Selecione o tamanho do 36 ao 54 e personalize seu kit.' },
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

        {/* 24 warranty */}
        <div className="lp-warranty">
          <div className="lp-warranty-ic">
            <svg viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5l8-3z"/><path d="M9 12l2 2 4-4"/></svg>
          </div>
          <div>
            <b>Garantia de 7 dias</b>
            <span>Se não amar o caimento, a gente troca ou devolve seu dinheiro. Sem complicação, conforme o CDC.</span>
          </div>
        </div>

        {/* 26 testimonials */}
        <div className="lp-eyebrow">QUEM VESTIU, RECOMENDA</div>
        <h2 className="lp-h2">Avaliações reais de clientes</h2>
        <div className="lp-divider" />
        <div className="lp-testi">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="lp-testi-card">
              <div className="lp-testi-pic">
                <img src={`/assets/${t.pic}`} alt={`Depoimento ${i + 1}`} />
              </div>
              <div className="lp-testi-quote">"</div>
              <div className="lp-stars">{'★'.repeat(t.stars)}</div>
              <p>{t.text}</p>
            </div>
          ))}
        </div>

        {/* 27 FAQ */}
        <div className="lp-eyebrow">TIRE SUAS DÚVIDAS</div>
        <h2 className="lp-h2">Perguntas frequentes</h2>
        <div className="lp-divider" />
        <div className="lp-faq" id="faq">
          {[
            { q: 'O kit vem mesmo com 5 calças?', a: 'Sim. Você paga 1 valor e recebe 5 calças de cores diferentes (Preto, Marinho, Cáqui, Cinza e Branco), todas no tamanho que você escolher.' },
            { q: 'Como escolho meu tamanho?', a: 'A modelagem segue padrão brasileiro (do 36 ao 54). Em caso de dúvida entre dois tamanhos, recomendamos optar pelo maior para mais conforto.' },
            { q: 'E se não servir?', a: 'Você tem até 7 dias após o recebimento para solicitar a troca ou devolução, sem burocracia, conforme o Código de Defesa do Consumidor.' },
            { q: 'Quanto tempo demora pra chegar?', a: 'Despachamos rapidamente do Brasil com código de rastreio. Capitais geralmente recebem em poucos dias úteis.' },
            { q: 'Como é feito o pagamento?', a: 'Aceitamos Pix. Tudo via ambiente seguro com criptografia.' },
          ].map((item, i) => (
            <details key={i} open>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>

        {/* 28 final CTA */}
        <div className="lp-cta">
          <span className="lp-pill">GARANTA O SEU KIT</span>
          <h3>5 calças. 1 compra. Pra sempre estiloso.</h3>
          <p className="lp-cta-desc">Promoção Pague 3, Leve 5 enquanto durarem as últimas unidades.</p>
          <div className="lp-cta-prices">
            <span className="now">R$ 127,90</span>
            <span className="old">R$ 299,00</span>
          </div>
          <div className="lp-cta-ext">Pagamento via Pix · Entrega garantida</div>
        </div>

        {/* 29-31 specs */}
        <div className="lp-specs">
          <h4>Características</h4>
          <ul>
            <li>Material de alta qualidade selecionado</li>
            <li>Acabamento premium com atenção aos detalhes</li>
            <li>Design moderno e atemporal</li>
            <li>Conforto excepcional para uso diário</li>
            <li>Durabilidade garantida</li>
          </ul>
          <h4>Composição</h4>
          <p>Produzido com materiais selecionados de fornecedores certificados, garantindo qualidade e sustentabilidade em toda a cadeia produtiva.</p>
          <h4>Cuidados</h4>
          <ul>
            <li>Lavar à máquina em água fria</li>
            <li>Não usar alvejante</li>
            <li>Secar à sombra</li>
            <li>Passar em temperatura média</li>
          </ul>
        </div>

        {/* 32 mini trust */}
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

        {/* 33 bag */}
        <div className="lp-bag">
          <div className="lp-bag-img">
            <img src="/assets/sacolas.webp" alt="Sacola ZYRON" />
          </div>
        </div>

        {/* 34 why zyron */}
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

        {/* 35 safe buy */}
        <div className="lp-safebuy">
          <h3>COMPRA SEGURA</h3>
          <p>Sua compra protegida pela<br/><b>Lei nº 8.078/1990 – Código de Defesa do Consumidor.</b> Até 7 dias após<br/>o recebimento para troca ou devolução,<br/>sem complicação.</p>
        </div>

        {/* 36 attention */}
        <div className="lp-att">
          <div className="lp-att-ic">
            <svg viewBox="0 0 24 24"><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M12 7v5M12 15v.1"/></svg>
          </div>
          <h3>ATENÇÃO: NÃO CAIA EM GOLPES</h3>
          <p>A ZYRON entrega mais de <b>50.000 pedidos<br/>anualmente</b>.<br/>Isso graças à confiança de nossos clientes e reputação<br/>consolidada no mercado.</p>
          <div className="lp-att-box">Nunca forneça dados pessoais ou bancários por<br/>mensagens suspeitas. Entre em contato apenas<br/>com nosso SAC oficial.</div>
        </div>

        {/* 37 reclame aqui */}
        <div className="lp-reclame-img">
          <img src="/assets/reclameaq.webp" alt="ReclameAQUI 9.1" />
        </div>

        {/* 39 big stats */}
        {[
          { num: '100 Mil', lab: 'Pedidos Enviados', txt: 'Enviamos para você onde você estiver com qualidade e agilidade comprovada!' },
          { num: '5 anos', lab: 'De experiência', txt: 'Há cinco anos, a ZYRON seleciona a dedo os melhores produtos e entrega excelência em cada compra.' },
          { num: '80 Mil', lab: 'Clientes Satisfeitos', txt: '20% dos clientes voltam para novas compras, comprovando a confiança e a satisfação em cada pedido.' },
        ].map((s, i) => (
          <div key={i} className="lp-bigstat">
            <div className="num">{s.num}</div>
            <div className="lab">{s.lab}</div>
            <div className="txt">{s.txt}</div>
          </div>
        ))}

        {/* 40 aggregate reviews */}
        <div className="lp-reviews">
          <div className="lp-reviews-h">AVALIAÇÕES DOS CLIENTES</div>
          <div className="lp-agg">
            <div className="score">4.8</div>
            <div className="ss"><span>★★★★★</span></div>
            <div className="based">Baseado em 373 avaliações</div>
            {[['5 estrelas', '90%', 335], ['4 estrelas', '12%', 16], ['3 estrelas', '10%', 14], ['2 estrelas', '3%', 3], ['1 estrelas', '5%', 5]].map(([lbl, pct, n]) => (
              <div key={lbl as string} className="row">
                <span>{lbl}</span>
                <div className="bar"><i style={{ width: pct as string }} /></div>
                <span className="n">{n}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 41 reviews list */}
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
    </>
  )
}
