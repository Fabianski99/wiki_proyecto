import React, { useState } from 'react';

// --- DATOS DE LA WIKI (Extraídos del PDF original) ---
const WIKI_DATA = {
  characteristics: [
    { title: "Autoservicio bajo demanda", desc: "El cliente obtiene capacidad sin intervención humana del proveedor.", icon: "⚙️" },
    { title: "Acceso amplio por red", desc: "Los recursos se alcanzan por la red, desde distintos dispositivos.", icon: "🌐" },
    { title: "Agrupación de recursos", desc: "La misma infraestructura atiende a muchos clientes a la vez.", icon: "🗄️" },
    { title: "Elasticidad rápida", desc: "La capacidad crece y se reduce según la demanda.", icon: "📈" },
    { title: "Servicio medido", desc: "El uso se mide, se controla y se cobra.", icon: "⏱️" }
  ],
  serviceModels: [
    { name: "IaaS", fullName: "Infraestructura como servicio", desc: "El cliente administra el sistema operativo, las aplicaciones y los datos.", examples: "Máquinas virtuales, discos, redes", color: "border-blue-400" },
    { name: "PaaS", fullName: "Plataforma como servicio", desc: "El cliente despliega su aplicación sin administrar servidores.", examples: "App Service, Azure SQL, Storage", color: "border-indigo-400" },
    { name: "SaaS", fullName: "Software como servicio", desc: "El cliente usa una aplicación terminada y configura su uso.", examples: "Microsoft 365, Dynamics 365", color: "border-purple-400" }
  ],
  responsibilityTable: [
    { comp: "Datos del cliente", local: "Cliente", iaas: "Cliente", paas: "Cliente", saas: "Cliente" },
    { comp: "Configuraciones", local: "Cliente", iaas: "Cliente", paas: "Cliente", saas: "Cliente" },
    { comp: "Identidades y usuarios", local: "Cliente", iaas: "Cliente", paas: "Cliente", saas: "Cliente" },
    { comp: "Dispositivos cliente", local: "Cliente", iaas: "Cliente", paas: "Cliente", saas: "Compartida" },
    { comp: "Aplicaciones", local: "Cliente", iaas: "Cliente", paas: "Compartida", saas: "Compartida" },
    { comp: "Controles de red", local: "Cliente", iaas: "Cliente", paas: "Compartida", saas: "Microsoft" },
    { comp: "Sistema operativo", local: "Cliente", iaas: "Cliente", paas: "Microsoft", saas: "Microsoft" },
    { comp: "Hosts físicos", local: "Cliente", iaas: "Microsoft", paas: "Microsoft", saas: "Microsoft" },
    { comp: "Red física", local: "Cliente", iaas: "Microsoft", paas: "Microsoft", saas: "Microsoft" },
    { comp: "Centro de datos físico", local: "Cliente", iaas: "Microsoft", paas: "Microsoft", saas: "Microsoft" }
  ],
  cases: [
    { title: "Twitch (Octubre 2021)", error: "Configuración", desc: "Un tercero accedió a código fuente por un cambio en la configuración de un servidor. Responsabilidad del cliente.", icon: "⚠️" },
    { title: "Capital One (Julio 2019)", error: "Evaluación de Riesgo", desc: "Multa de $80M por no establecer procesos eficaces de evaluación de riesgos antes de migrar datos a la nube.", icon: "🏦" }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const handleCopyCode = () => {
    const code = `az login\naz group create -n rg-permisos -l brazilsouth\naz storage account create -n stpermisosmuni01 -g rg-permisos --sku Standard_LRS --https-only true --min-tls-version TLS1_2 --allow-blob-public-access false\naz storage account show -n stpermisosmuni01 -g rg-permisos -o tsv --query "[enableHttpsTrafficOnly, minimumTlsVersion, allowBlobPublicAccess]"`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getResponsibilityBadge = (type) => {
    if (type === "Cliente") return <span className="badge badge-cliente">Cliente</span>;
    if (type === "Compartida") return <span className="badge badge-compartida">Compartida</span>;
    if (type === "Microsoft") return <span className="badge badge-microsoft">Microsoft</span>;
    return type;
  };

  return (
    <div className="wiki-root">
      <style>{`
        /* Anulación de estilos globales de Vite */
        html, body, #root, .wiki-root {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: none !important;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .wiki-root * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        /* Variables Profesionales */
        :root {
          --bg-sidebar: #0f172a;
          --bg-sidebar-hover: #1e293b;
          --text-sidebar: #cbd5e1;
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --primary: #0284c7;
          --text-main: #334155;
          --text-muted: #64748b;
          --border-color: #e2e8f0;
          --danger: #ef4444;
          --warning: #f59e0b;
          --success: #10b981;
        }

        .wiki-layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--bg-main);
          color: var(--text-main);
          line-height: 1.6;
          width: 100%;
        }

        /* SIDEBAR */
        .sidebar {
          width: 280px;
          background-color: var(--bg-sidebar);
          color: var(--text-sidebar);
          display: flex;
          flex-direction: column;
          position: fixed;
          height: 100vh;
          z-index: 50;
          box-shadow: 4px 0 15px rgba(0,0,0,0.1);
        }
        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }
        .sidebar-header h1 {
          font-size: 1.25rem;
          color: white;
          font-weight: 700;
        }
        .sidebar-nav {
          padding: 16px 0;
          flex-grow: 1;
        }
        .nav-item {
          width: 100%;
          text-align: left;
          padding: 14px 24px;
          background: transparent;
          border: none;
          color: var(--text-sidebar);
          font-size: 0.95rem;
          cursor: pointer;
          transition: 0.2s;
          display: flex;
          align-items: center;
          gap: 12px;
          border-left: 4px solid transparent;
        }
        .nav-item:hover {
          background-color: var(--bg-sidebar-hover);
          color: white;
        }
        .nav-item.active {
          background-color: rgba(2, 132, 199, 0.15);
          color: var(--primary);
          border-left-color: var(--primary);
          font-weight: 600;
        }

        /* CONTENIDO PRINCIPAL */
        .main-wrapper {
          margin-left: 280px;
          width: calc(100% - 280px);
          display: flex;
          justify-content: center; /* Centra el contenido en pantallas gigantes */
          padding: 40px;
        }
        
        .content-container {
          width: 100%;
          max-width: 1200px; /* Evita que el contenido se estire al infinito */
        }

        .page-header {
          margin-bottom: 35px;
          padding-bottom: 15px;
          border-bottom: 2px solid var(--border-color);
          text-align: center;
        }
        .page-header h2 {
          font-size: 2.4rem;
          color: var(--bg-sidebar);
          font-weight: 800;
        }

        /* TARJETAS Y CAJAS */
        .card {
          background: var(--bg-card);
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          border: 1px solid var(--border-color);
          margin-bottom: 30px;
          width: 100%;
        }
        .card-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--bg-sidebar);
          margin-bottom: 20px;
          text-align: center;
        }

        .grid-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }
        .info-box {
          background: #f8fafc;
          border: 1px solid var(--border-color);
          padding: 24px;
          border-radius: 8px;
          text-align: center;
          transition: 0.2s;
        }
        .info-box:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        }

        /* TABLA DE RESPONSABILIDAD PROFESIONAL */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
          border: 1px solid var(--border-color);
          border-radius: 8px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          text-align: center;
        }
        th, td {
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          border-right: 1px solid var(--border-color);
        }
        th {
          background-color: #f1f5f9;
          font-weight: 700;
          color: var(--bg-sidebar);
        }
        td:first-child {
          text-align: left;
          font-weight: 600;
          background-color: #f8fafc;
        }
        
        .badge {
          padding: 6px 0;
          border-radius: 4px;
          font-weight: 600;
          font-size: 0.9rem;
          display: block;
          width: 100%;
        }
        .badge-cliente { background-color: #fca5a5; color: #7f1d1d; } /* Rojo claro */
        .badge-compartida { background-color: #e2e8f0; color: #475569; } /* Gris claro */
        .badge-microsoft { background-color: #475569; color: #f8fafc; } /* Gris oscuro */

        /* CÓDIGO BASH */
        .code-container { position: relative; margin: 15px 0; }
        .code-block {
          background: #1e293b;
          color: #e2e8f0;
          padding: 25px;
          border-radius: 8px;
          font-family: 'Courier New', Courier, monospace;
          text-align: left;
          overflow-x: auto;
        }
        .copy-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
        }

        @media (max-width: 900px) {
          .sidebar { display: none; }
          .main-wrapper { margin-left: 0; width: 100%; padding: 20px; }
        }
      `}</style>

      <div className="wiki-layout">
        
        {/* BARRA LATERAL */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h1>☁️ GSI - Unidad 2</h1>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-item ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => changeTab('inicio')}>
              <span>🏠</span> Resumen General
            </button>
            <button className={`nav-item ${activeTab === 'nube' ? 'active' : ''}`} onClick={() => changeTab('nube')}>
              <span>☁️</span> 1. ¿Qué es la Nube?
            </button>
            <button className={`nav-item ${activeTab === 'responsabilidad' ? 'active' : ''}`} onClick={() => changeTab('responsabilidad')}>
              <span>⚖️</span> 2. Responsabilidad
            </button>
            <button className={`nav-item ${activeTab === 'pilar' ? 'active' : ''}`} onClick={() => changeTab('pilar')}>
              <span>🛡️</span> 3. Pilar de Seguridad
            </button>
            <button className={`nav-item ${activeTab === 'laboratorio' ? 'active' : ''}`} onClick={() => changeTab('laboratorio')}>
              <span>💻</span> 4. Laboratorio (CLI)
            </button>
          </nav>
        </aside>

        {/* CONTENIDO PRINCIPAL CENTRADO Y LIMITADO EN ANCHO */}
        <main className="main-wrapper">
          <div className="content-container">
            
            {/* --- SECCIÓN 0: INICIO --- */}
            {activeTab === 'inicio' && (
              <div>
                <div className="page-header">
                  <h2>La nube y quién responde por ella</h2>
                  <p>Gestión de Seguridad de la Información (T13062) - Unidad 2</p>
                </div>
                
                <div className="card">
                  <h3 className="card-title">📖 Acerca de esta Wiki</h3>
                  <p style={{textAlign: 'center', marginBottom: '30px', fontSize: '1.1rem'}}>
                    Este documento interactivo consolida el conocimiento sobre la infraestructura Cloud, 
                    los modelos de responsabilidad compartida y el diseño de arquitecturas seguras utilizando 
                    el <strong>Well-Architected Framework</strong> de Microsoft Azure.
                  </p>
                  
                  <div className="grid-cards">
                    <div className="info-box" style={{borderTop: '4px solid var(--primary)'}}>
                      <h4 style={{color: 'var(--primary)', marginBottom: '10px', fontSize: '1.2rem'}}>Bloque 1: Conceptos</h4>
                      <p>Cinco características, tres modelos de servicio (IaaS, PaaS, SaaS) y cuatro modelos de despliegue según NIST.</p>
                    </div>
                    <div className="info-box" style={{borderTop: '4px solid var(--warning)'}}>
                      <h4 style={{color: 'var(--warning)', marginBottom: '10px', fontSize: '1.2rem'}}>Bloque 2: Responsabilidad</h4>
                      <p>El modelo de responsabilidad compartida. Qué gestiona el proveedor y qué controles <strong>nunca</strong> se transfieren.</p>
                    </div>
                    <div className="info-box" style={{borderTop: '4px solid var(--success)'}}>
                      <h4 style={{color: 'var(--success)', marginBottom: '10px', fontSize: '1.2rem'}}>Bloque 3: Seguridad</h4>
                      <p>Principios de diseño, Zero Trust y la lista de revisión SE:01 a SE:12 aplicada a Azure.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- SECCIÓN 1: NUBE --- */}
            {activeTab === 'nube' && (
              <div>
                <div className="page-header">
                  <h2>¿Qué es la nube?</h2>
                  <p>Definiciones fundamentales según NIST SP 800-145</p>
                </div>

                <div className="card">
                  <h3 className="card-title">📦 3 Modelos de Servicio</h3>
                  <p style={{textAlign: 'center', marginBottom: '25px'}}>Mientras más administra el proveedor, menos controles quedan en manos del cliente. Pero los controles sobre <strong>datos e identidades nunca desaparecen</strong>.</p>
                  
                  <div className="grid-cards">
                    {WIKI_DATA.serviceModels.map((model, i) => (
                      <div key={i} className={`info-box`} style={{borderTop: `4px solid ${model.color.split('-')[2] === 'blue' ? '#3b82f6' : model.color.split('-')[2] === 'indigo' ? '#6366f1' : '#a855f7'}`}}>
                        <h4 style={{fontSize: '1.2rem', marginBottom: '15px'}}>{model.fullName} ({model.name})</h4>
                        <p style={{marginBottom: '15px'}}>{model.desc}</p>
                        <p style={{fontSize: '0.9rem', fontWeight: 'bold'}}>Ejemplos: {model.examples}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h3 className="card-title">📌 5 Características Esenciales</h3>
                  <div className="grid-cards">
                    {WIKI_DATA.characteristics.map((item, i) => (
                      <div key={i} className="info-box">
                        <div style={{fontSize: '2.5rem', marginBottom: '10px'}}>{item.icon}</div>
                        <h4>{item.title}</h4>
                        <p style={{fontSize: '0.9rem'}}>{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* --- SECCIÓN 2: RESPONSABILIDAD --- */}
            {activeTab === 'responsabilidad' && (
              <div>
                <div className="page-header">
                  <h2>Quién responde por qué</h2>
                  <p>El proveedor protege la infraestructura. La configuración, las identidades y los datos siguen siendo del cliente.</p>
                </div>

                <div className="card">
                  <h3 className="card-title">🛡️ Modelo de Responsabilidad Compartida</h3>
                  <p style={{textAlign: 'center', marginBottom: '20px'}}>La responsabilidad cambia con el modelo de servicio.</p>
                  
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Componente</th>
                          <th>On-Premises (LOCAL)</th>
                          <th>IaaS</th>
                          <th>PaaS</th>
                          <th>SaaS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {WIKI_DATA.responsibilityTable.map((row, idx) => (
                          <tr key={idx}>
                            <td>{row.comp}</td>
                            <td>{getResponsibilityBadge(row.local)}</td>
                            <td>{getResponsibilityBadge(row.iaas)}</td>
                            <td>{getResponsibilityBadge(row.paas)}</td>
                            <td>{getResponsibilityBadge(row.saas)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="grid-cards">
                  {WIKI_DATA.cases.map((c, i) => (
                    <div key={i} className="info-box" style={{borderTop: '4px solid var(--danger)'}}>
                      <h4 style={{display: 'flex', justifyContent: 'center', gap: '8px'}}>{c.icon} Caso: {c.title}</h4>
                      <p><strong>Falla en:</strong> {c.error}</p>
                      <p style={{marginTop: '10px'}}>{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* --- SECCIÓN 3: PILAR --- */}
            {activeTab === 'pilar' && (
              <div>
                <div className="page-header">
                  <h2>El pilar de seguridad</h2>
                  <p>Diseño de cargas de trabajo seguras según Microsoft (Well-Architected Framework)</p>
                </div>

                <div className="card">
                  <h3 className="card-title">✅ Lista de Revisión del Pilar (Selección)</h3>
                  <div className="table-responsive">
                    <table style={{textAlign: 'left'}}>
                      <thead>
                        <tr>
                          <th style={{textAlign: 'center'}}>Código</th>
                          <th>Recomendación (Qué se configura)</th>
                          <th>Protección</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td style={{textAlign: 'center'}}><strong>SE:01</strong></td><td>Establecer una línea base de seguridad.</td><td>Comparación con la base.</td></tr>
                        <tr><td style={{textAlign: 'center'}}><strong>SE:05</strong></td><td>Gestión de identidades y accesos estricta (MFA).</td><td>Usuarios, evitar accesos anónimos.</td></tr>
                        <tr><td style={{textAlign: 'center'}}><strong>SE:06</strong></td><td>Aislar, filtrar y controlar el tráfico de red.</td><td>Exposición a internet.</td></tr>
                        <tr><td style={{textAlign: 'center'}}><strong>SE:07</strong></td><td>Cifrar los datos con métodos estándar (HTTPS, TLS 1.2).</td><td>Datos en tránsito y en reposo.</td></tr>
                        <tr><td style={{textAlign: 'center'}}><strong>SE:10</strong></td><td>Monitoreo integral y detección (Auditoría).</td><td>Revisión de registros críticos.</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* --- SECCIÓN 4: LABORATORIO --- */}
            {activeTab === 'laboratorio' && (
              <div>
                <div className="page-header">
                  <h2>Laboratorio Azure CLI</h2>
                  <p>Configuración inicial segura del almacenamiento</p>
                </div>

                <div className="card">
                  <h3 className="card-title">💻 Ejecución en la Consola</h3>
                  <div className="code-container">
                    <button className="copy-btn" onClick={handleCopyCode}>
                      {copied ? '¡Copiado!' : 'Copiar'}
                    </button>
                    <div className="code-block">
                      <span style={{color: '#8b949e'}}># Iniciar sesión (exige MFA)</span><br/>
                      <span style={{color: '#38bdf8'}}>az login</span><br/><br/>
                      
                      <span style={{color: '#8b949e'}}># Crear grupo de recursos</span><br/>
                      <span style={{color: '#38bdf8'}}>az group create</span> <span style={{color: '#a7f3d0'}}>-n</span> rg-permisos <span style={{color: '#a7f3d0'}}>-l</span> brazilsouth<br/><br/>
                      
                      <span style={{color: '#8b949e'}}># Crear cuenta de almacenamiento con seguridad estricta</span><br/>
                      <span style={{color: '#38bdf8'}}>az storage account create</span> \<br/>
                      &nbsp;&nbsp;<span style={{color: '#a7f3d0'}}>-n</span> stpermisosmuni01 <span style={{color: '#a7f3d0'}}>-g</span> rg-permisos \<br/>
                      &nbsp;&nbsp;<span style={{color: '#a7f3d0'}}>--sku</span> Standard_LRS <span style={{color: '#a7f3d0'}}>--https-only</span> true \<br/>
                      &nbsp;&nbsp;<span style={{color: '#a7f3d0'}}>--min-tls-version</span> TLS1_2 \<br/>
                      &nbsp;&nbsp;<span style={{color: '#a7f3d0'}}>--allow-blob-public-access</span> false
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}