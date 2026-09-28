import { useEffect, useRef, useState } from 'react';
import './App.css';

const sections = [
  { id: 'inicio', number: '00', label: 'Resumen', group: 'EMPEZAR' },
  { id: 'nube', number: '01', label: 'La nube', group: 'FUNDAMENTOS' },
  { id: 'responsabilidad', number: '02', label: 'Responsabilidad', group: 'FUNDAMENTOS' },
  { id: 'seguridad', number: '03', label: 'Pilar de seguridad', group: 'DISEÑO SEGURO' },
  { id: 'laboratorio', number: '04', label: 'Laboratorio Azure', group: 'PRACTICAR' },
];

const characteristics = [
  ['01', 'Autoservicio bajo demanda', 'Obtener capacidad sin intervención humana del proveedor.'],
  ['02', 'Acceso amplio por red', 'Llegar a los recursos desde distintos dispositivos y redes.'],
  ['03', 'Agrupación de recursos', 'Compartir infraestructura con aislamiento entre clientes.'],
  ['04', 'Elasticidad rápida', 'Aumentar o reducir capacidad según la demanda.'],
  ['05', 'Servicio medido', 'Medir, controlar y cobrar el consumo de recursos.'],
];

const serviceModels = [
  { id: 'IaaS', title: 'Infraestructura como servicio', desc: 'El cliente administra el sistema operativo, las aplicaciones y los datos.', examples: 'Máquinas virtuales · discos · redes virtuales', tone: 'green' },
  { id: 'PaaS', title: 'Plataforma como servicio', desc: 'El cliente despliega su aplicación sin administrar los servidores subyacentes.', examples: 'App Service · Azure SQL · Storage', tone: 'orange' },
  { id: 'SaaS', title: 'Software como servicio', desc: 'El cliente utiliza una aplicación terminada y configura su uso.', examples: 'Microsoft 365 · Dynamics 365', tone: 'rose' },
];

const deploymentModels = [
  ['Pública', 'Infraestructura del proveedor disponible para distintos clientes.'],
  ['Privada', 'Uso exclusivo de una organización, propio o administrado por un tercero.'],
  ['Comunitaria', 'Compartida por organizaciones con requisitos comunes.'],
  ['Híbrida', 'Dos o más modelos conectados, con movimiento de datos y aplicaciones.'],
];

const responsibilityRows = [
  ['Datos del cliente', 'Cliente', 'Cliente', 'Cliente', 'Cliente'],
  ['Configuraciones', 'Cliente', 'Cliente', 'Cliente', 'Cliente'],
  ['Identidades y usuarios', 'Cliente', 'Cliente', 'Cliente', 'Cliente'],
  ['Dispositivos cliente', 'Cliente', 'Cliente', 'Cliente', 'Compartida'],
  ['Aplicaciones', 'Cliente', 'Cliente', 'Compartida', 'Compartida'],
  ['Controles de red', 'Cliente', 'Cliente', 'Compartida', 'Microsoft'],
  ['Sistema operativo', 'Cliente', 'Cliente', 'Microsoft', 'Microsoft'],
  ['Hosts físicos', 'Cliente', 'Microsoft', 'Microsoft', 'Microsoft'],
  ['Red física', 'Cliente', 'Microsoft', 'Microsoft', 'Microsoft'],
  ['Centro de datos físico', 'Cliente', 'Microsoft', 'Microsoft', 'Microsoft'],
];

const recommendations = [
  ['SE:01', 'Establecer una línea base de seguridad'],
  ['SE:02', 'Integrar el ciclo de desarrollo seguro'],
  ['SE:03', 'Clasificar y etiquetar los datos'],
  ['SE:04', 'Segmentar y definir perímetros'],
  ['SE:05', 'Gestionar identidades y accesos de forma estricta y auditable'],
  ['SE:06', 'Aislar, filtrar y controlar el tráfico de red'],
  ['SE:07', 'Cifrar los datos con métodos estándar'],
  ['SE:08', 'Endurecer los componentes'],
  ['SE:09', 'Proteger los secretos de las aplicaciones'],
  ['SE:10', 'Monitorear y detectar amenazas'],
  ['SE:11', 'Mantener un régimen integral de pruebas de seguridad'],
  ['SE:12', 'Preparar procedimientos de respuesta a incidentes'],
];
const exercisedRecommendations = new Set(['SE:01', 'SE:05', 'SE:06', 'SE:07', 'SE:09', 'SE:10']);

const command = `az login
az group create -n rg-permisos -l brazilsouth
az storage account create \\
  -n stpermisosmuni01 -g rg-permisos \\
  --sku Standard_LRS --https-only true \\
  --min-tls-version TLS1_2 \\
  --allow-blob-public-access false
az storage account show \\
  -n stpermisosmuni01 -g rg-permisos -o tsv \\
  --query "[enableHttpsTrafficOnly, minimumTlsVersion, allowBlobPublicAccess]"`;

const sectionDescriptions = {
  inicio: ['Unidad 2 · Guía de estudio', 'La nube y quién responde por ella', 'Modelos de servicio, responsabilidad compartida y diseño seguro en Azure.'],
  nube: ['01 · Fundamentos', 'Qué es la nube', 'Las características y modelos que distinguen la computación en la nube.'],
  responsabilidad: ['02 · Modelo compartido', 'Quién responde por qué', 'El proveedor protege la infraestructura; la organización conserva decisiones críticas.'],
  seguridad: ['03 · Azure Well-Architected Framework', 'El pilar de seguridad', 'Principios de diseño y recomendaciones para construir cargas de trabajo seguras.'],
  laboratorio: ['04 · Trabajo práctico', 'Laboratorio Azure CLI', 'Crear y verificar una cuenta de almacenamiento con una configuración inicial segura.'],
};
const sectionSearchCorpus = {
  inicio: 'responsabilidad nube proveedor cliente Azure seguridad modelos Zero Trust configuración datos identidad',
  nube: JSON.stringify([characteristics, serviceModels, deploymentModels]),
  responsabilidad: JSON.stringify(responsibilityRows) + ' Twitch Capital One riesgo configuración identidad cuentas accesos MFA',
  seguridad: JSON.stringify(recommendations) + ' Zero Trust confidencialidad integridad disponibilidad CIA pilares evaluación auditoría',
  laboratorio: `${command} Azure for Students TLS almacenamiento HTTPS cifrado blobs acceso red evidencia bitácora`,
};

function PageHeading({ section }) {
  const [eyebrow, title, description] = sectionDescriptions[section];
  return (
    <header className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
    </header>
  );
}

function ResponsibilityBadge({ value }) {
  return <span className={`responsibility-badge ${value.toLowerCase()}`}>{value}</span>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [search, setSearch] = useState('');
  const [copied, setCopied] = useState(false);
  const searchInput = useRef(null);

  useEffect(() => {
    const handleSearchShortcut = (event) => {
      const activeElement = document.activeElement;
      const isTyping = activeElement instanceof HTMLElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement.tagName);
      if (event.key === '/' && !isTyping) {
        event.preventDefault();
        searchInput.current?.focus();
      }
      if (event.key === 'Escape') {
        setSearch('');
        searchInput.current?.blur();
      }
    };

    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  const changeTab = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleSections = sections.filter((section) =>
    `${section.number} ${section.label} ${section.group} ${sectionSearchCorpus[section.id]}`.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="wiki-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => changeTab('inicio')} aria-label="Ir al resumen">
          <span className="brand-mark">N</span>
          <span className="brand-copy"><strong>Bitácora cloud</strong><small>GSI · TI3062 · Unidad 2</small></span>
        </button>

        <label className="search-box">
          <span aria-hidden="true">⌕</span>
          <input ref={searchInput} value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar en la wiki" aria-label="Buscar en la wiki" />
          <kbd>/</kbd>
        </label>

        <nav className="side-nav" aria-label="Secciones de la wiki">
          {['EMPEZAR', 'FUNDAMENTOS', 'DISEÑO SEGURO', 'PRACTICAR'].map((group) => {
            const groupSections = visibleSections.filter((section) => section.group === group);
            if (!groupSections.length) return null;
            return (
              <div className="nav-group" key={group}>
                <p className="nav-group-title">{group}</p>
                {groupSections.map((section) => (
                  <button key={section.id} className={`nav-link ${activeTab === section.id ? 'selected' : ''}`} onClick={() => changeTab(section.id)} aria-current={activeTab === section.id ? 'page' : undefined}>
                    <span className="nav-number">{section.number}</span><span>{section.label}</span>
                  </button>
                ))}
              </div>
            );
          })}
          {visibleSections.length === 0 && <p className="empty-search">No hay secciones con ese nombre.</p>}
        </nav>

        <div className="sidebar-note"><span className="status-dot" /> Material de estudio <strong>Bloque 1 de 3</strong></div>
      </aside>

      <main className="main-area">
        <div className="topbar"><div className="breadcrumb">GSI <span>/</span> UNIDAD 2 <span>/</span> {sectionDescriptions[activeTab][0].split(' · ')[0]}</div><span className="topbar-tag">INACAP · VALPARAÍSO</span></div>
        <div className="mobile-nav" aria-label="Navegación móvil">
          {sections.map((section) => <button key={section.id} className={activeTab === section.id ? 'mobile-active' : ''} onClick={() => changeTab(section.id)}>{section.number} {section.label}</button>)}
        </div>

        <div className="article-layout">
          <article className="article-content" key={activeTab}>
            <PageHeading section={activeTab} />

            {activeTab === 'inicio' && <>
              <section className="overview-hero">
                <div className="hero-copy"><p className="hero-kicker">GESTIÓN DE SEGURIDAD DE LA INFORMACIÓN</p><h2>La nube no terceriza la responsabilidad.</h2><p>El proveedor protege la infraestructura. Quién entra, con qué permisos y qué se publica sigue siendo decisión de la organización.</p><button className="primary-button" onClick={() => changeTab('nube')}>Comenzar la guía <span aria-hidden="true">→</span></button></div>
                <div className="hero-stamp"><span>UNIDAD</span><strong>02</strong><span>TI3062</span></div>
                <div className="hero-lines" aria-hidden="true" />
              </section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">RECORRIDO DE APRENDIZAJE</p><h2>Explora la unidad</h2></div><span className="section-count">04 TEMAS</span></div>
                <div className="topic-list">
                  {sections.slice(1).map((section, index) => <button className="topic-row" key={section.id} onClick={() => changeTab(section.id)}><span className="topic-index">{section.number}</span><span className="topic-info"><strong>{section.label}</strong><small>{['Características NIST y modelos de servicio y despliegue.', 'Matriz por modelo y responsabilidades que no se transfieren.', 'Zero Trust, principios CIA y lista de revisión SE:01–SE:12.', 'Configuración segura de Storage y evidencia con Azure CLI.'][index]}</small></span><span className="topic-arrow">↗</span></button>)}
                </div>
              </section>
              <aside className="quote-callout"><span className="callout-mark">!</span><div><strong>Idea central</strong><p>“Está en Azure” no significa “Azure lo protege”. Datos, identidades y configuraciones siguen requiriendo decisiones del cliente.</p></div></aside>
              <section className="section-block reference-strip"><p className="eyebrow">BASADO EN</p><p>NIST SP 800-145 · Microsoft Azure Well-Architected Framework · Modelo de responsabilidad compartida</p><small>Material docente · Rubén Schnettler · INACAP Valparaíso</small></section>
            </>}

            {activeTab === 'nube' && <>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">NIST SP 800-145</p><h2>Cinco características esenciales</h2></div></div><div className="characteristic-list">{characteristics.map(([number, title, desc]) => <div className="characteristic-row" key={number}><span>{number}</span><div><h3>{title}</h3><p>{desc}</p></div></div>)}</div><aside className="quote-callout"><span className="callout-mark">!</span><div><strong>Consecuencia para la seguridad</strong><p>El autoservicio permite que una configuración insegura quede publicada en segundos; la agrupación de recursos exige aislar a cada cliente.</p></div></aside></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">MODELOS DE SERVICIO</p><h2>¿Qué administra el cliente?</h2></div><span className="section-count">IaaS → PaaS → SaaS</span></div><div className="service-grid">{serviceModels.map((model) => <div className={`service-panel ${model.tone}`} key={model.id}><span className="service-code">{model.id}</span><h3>{model.title}</h3><p>{model.desc}</p><small>{model.examples}</small></div>)}</div><p className="inline-note">A medida que el proveedor administra más, disminuye el trabajo operativo del cliente. Los controles sobre datos e identidades nunca desaparecen.</p></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">MODELOS DE DESPLIEGUE</p><h2>Dónde vive la infraestructura</h2></div></div><div className="deployment-grid">{deploymentModels.map(([title, desc], index) => <div className="deployment-item" key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{desc}</p></div>)}</div><aside className="note-band"><strong>En la práctica</strong><p>Una migración gradual suele producir un modelo híbrido. Durante ese período, tanto la nube como la sala de servidores deben protegerse.</p></aside></section>
              <SourceLine>Fuente: Mell, P. y Grance, T. (2011). The NIST Definition of Cloud Computing (SP 800-145).</SourceLine>
            </>}

            {activeTab === 'responsabilidad' && <>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">MODELO DE RESPONSABILIDAD COMPARTIDA</p><h2>La responsabilidad cambia con el servicio</h2></div></div><p className="section-intro">La tabla muestra quién administra cada componente. En todos los modelos, datos, configuraciones e identidades permanecen bajo responsabilidad del cliente.</p><div className="table-scroll"><table className="responsibility-table"><thead><tr><th>Componente</th><th>Local</th><th>IaaS</th><th>PaaS</th><th>SaaS</th></tr></thead><tbody>{responsibilityRows.map(([component, ...owners]) => <tr key={component}><th scope="row">{component}</th>{owners.map((owner, index) => <td key={`${component}-${index}`}><ResponsibilityBadge value={owner} /></td>)}</tr>)}</tbody></table></div><div className="legend"><span><i className="legend-client" /> Cliente</span><span><i className="legend-shared" /> Compartida</span><span><i className="legend-provider" /> Microsoft</span></div></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">CONTROLES QUE NO SE TRANSFIEREN</p><h2>La organización conserva la decisión</h2></div></div><div className="responsibility-points"><div><span>01</span><h3>Datos</h3><p>Clasificación, protección y decisión de cifrado.</p></div><div><span>02</span><h3>Configuraciones</h3><p>Revisar cada opción que se activa o se deja por defecto.</p></div><div><span>03</span><h3>Cuentas y accesos</h3><p>Administrar usuarios, roles, MFA y políticas de acceso.</p></div></div></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">CASOS REALES</p><h2>Cuando falla la evaluación del cliente</h2></div></div><div className="case-grid"><article className="case-article"><span className="case-date">OCTUBRE DE 2021 · TWITCH</span><h3>Una configuración expuso código fuente</h3><p>Un tercero accedió a documentos del repositorio y a parte de los datos de pagos. Twitch atribuyó el incidente a un cambio de configuración de un servidor.</p><div className="case-takeaway"><strong>Aprendizaje</strong><span>Cada cambio de configuración debe revisarse antes y registrarse después.</span></div></article><article className="case-article"><span className="case-date">JULIO DE 2019 · CAPITAL ONE</span><h3>Migrar sin evaluar riesgos tiene consecuencias</h3><p>El regulador OCC impuso una multa de 80 millones de dólares por no establecer procesos eficaces de evaluación antes de migrar operaciones significativas a la nube.</p><div className="case-takeaway"><strong>Aprendizaje</strong><span>Identificar activos, amenazas y riesgos antes de decidir una migración.</span></div></article></div></section>
              <SourceLine>Fuentes: Microsoft Learn, Shared responsibility in the cloud · Twitch (2021) · OCC (2020).</SourceLine>
            </>}

            {activeTab === 'seguridad' && <>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">AZURE WELL-ARCHITECTED FRAMEWORK</p><h2>Seguridad dentro de una arquitectura completa</h2></div></div><div className="pillars-layout"><div className="pillar-lead"><span className="pillar-icon">05</span><h3>Cinco pilares</h3><p>El marco evalúa una carga de trabajo desde cinco perspectivas que deben mantenerse en equilibrio.</p></div><div className="pillar-list"><span>Confiabilidad</span><span className="pillar-highlight">Seguridad</span><span>Optimización de costos</span><span>Excelencia operativa</span><span>Eficiencia del rendimiento</span></div></div></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">ZERO TRUST · CONFIANZA CERO</p><h2>Tres principios para tomar decisiones</h2></div></div><div className="zero-trust-grid"><article><span>01</span><h3>Verificar explícitamente</h3><p>Validar identidad, ubicación y contexto antes de permitir una acción.</p></article><article><span>02</span><h3>Usar mínimo privilegio</h3><p>Otorgar solo los permisos necesarios, durante el tiempo necesario.</p></article><article><span>03</span><h3>Asumir la vulneración</h3><p>Diseñar controles que limiten el daño si una defensa falla.</p></article></div></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">CONFIDENCIALIDAD · INTEGRIDAD · DISPONIBILIDAD</p><h2>Principios de diseño seguro</h2></div></div><div className="cia-list"><div><b>01</b><strong>Preparar</strong><span>Definir prácticas, responsables y respuesta a incidentes desde el diseño.</span></div><div><b>02</b><strong>Confidencialidad</strong><span>Restringir accesos, clasificar datos, cifrar y auditar.</span></div><div><b>03</b><strong>Integridad</strong><span>Impedir modificaciones no autorizadas del diseño, operación y datos.</span></div><div><b>04</b><strong>Disponibilidad</strong><span>Evitar que un incidente detenga o degrade el servicio.</span></div><div><b>05</b><strong>Sostener la postura</strong><span>Mantener inventario, pruebas, detección y aprendizaje continuo.</span></div></div></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">LISTA DE REVISIÓN DEL PILAR</p><h2>Doce recomendaciones de seguridad</h2></div><span className="section-count">SE:01 — SE:12</span></div><div className="recommendation-list">{recommendations.map(([code, text]) => <div className={`recommendation ${exercisedRecommendations.has(code) ? 'practiced' : ''}`} key={code}><code>{code}</code><span>{text}</span>{exercisedRecommendations.has(code) && <small>UNIDAD</small>}</div>)}</div><p className="inline-note">Las recomendaciones destacadas conectan con los pasos de configuración, control de acceso, identidad, auditoría y mejora.</p></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">APLICACIÓN A LA EVALUACIÓN</p><h2>Del criterio a la configuración</h2></div></div><div className="evaluation-list"><div><b>PASO 1</b><span><strong>Configuración inicial</strong><small>SE:06 · SE:07 · Cifrado, HTTPS y red restringida</small></span></div><div><b>PASO 2</b><span><strong>Control de acceso</strong><small>SE:05 · MFA, roles y mínimo privilegio</small></span></div><div><b>PASO 3</b><span><strong>Identidad y permisos</strong><small>SE:05 · SE:09 · Usuarios, grupos y secretos</small></span></div><div><b>PASO 4</b><span><strong>Auditoría</strong><small>SE:10 · Registros y eventos críticos</small></span></div><div><b>PASO 5</b><span><strong>Evaluación y mejora</strong><small>SE:01 · Comparación con la línea base</small></span></div></div></section>
              <SourceLine>Fuente: Microsoft Azure Well-Architected Framework, Security design principles y design review checklist.</SourceLine>
            </>}

            {activeTab === 'laboratorio' && <>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">PASO 1 · CONFIGURACIÓN INICIAL</p><h2>Almacenamiento con valores seguros</h2></div></div><p className="section-intro">El ejemplo fija tres controles al crear la cuenta: transferencia segura, TLS mínimo y acceso anónimo a blobs deshabilitado.</p><div className="table-scroll"><table className="lab-table"><thead><tr><th>Configuración</th><th>Valor seguro</th><th>WAF</th><th>Protege</th></tr></thead><tbody><tr><th>Transferencia segura requerida</th><td>Activada · HTTPS</td><td>SE:07</td><td>Datos en tránsito</td></tr><tr><th>Versión mínima de TLS</th><td>TLS 1.2</td><td>SE:07</td><td>Protocolos obsoletos</td></tr><tr><th>Acceso anónimo a blobs</th><td>Deshabilitado</td><td>SE:05</td><td>Documentos públicos por error</td></tr><tr><th>Cifrado en reposo</th><td>Activo · claves de Microsoft</td><td>SE:07</td><td>Datos almacenados</td></tr><tr><th>Acceso de red</th><td>Solo direcciones autorizadas</td><td>SE:06</td><td>Exposición a internet</td></tr></tbody></table></div></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">EJECUCIÓN EN CONSOLA</p><h2>Crear y verificar con Azure CLI</h2></div><button className="copy-button" onClick={handleCopyCode}>{copied ? 'Copiado' : 'Copiar comandos'} <span aria-hidden="true">{copied ? '✓' : '⧉'}</span></button></div><div className="terminal"><div className="terminal-bar"><span /><span /><span /><small>AZURE CLI</small></div><pre><code>{command}</code></pre></div><div className="command-notes"><p><b>01</b><span><strong>Autenticación</strong>az login abre el navegador y puede requerir MFA.</span></p><p><b>02</b><span><strong>Organización</strong>El grupo de recursos reúne y ordena los recursos del caso.</span></p><p><b>03</b><span><strong>Evidencia</strong>La consulta final permite comprobar los valores configurados.</span></p></div><div className="expected-output"><span>RESULTADO ESPERADO</span><code>True&nbsp;&nbsp; TLS1_2&nbsp;&nbsp; False</code></div></section>
              <section className="section-block"><div className="section-title-row"><div><p className="eyebrow">LISTA DE VERIFICACIÓN</p><h2>Entregable de la sesión</h2></div></div><ol className="checklist"><li>Activar la suscripción Azure for Students.</li><li>Crear un grupo de recursos para el caso.</li><li>Crear la cuenta de almacenamiento con los controles indicados.</li><li>Verificar los valores y guardar una captura con el nombre de la cuenta.</li><li>Registrar en la bitácora tres características de seguridad y su propósito.</li></ol><aside className="note-band"><strong>Cuidar el crédito</strong><p>Evitar máquinas virtuales. Al cerrar la evaluación sumativa, eliminar el grupo solo después de conservar la evidencia necesaria.</p></aside></section>
            </>}

            <footer className="article-footer"><span>TI3062 · GESTIÓN DE SEGURIDAD DE LA INFORMACIÓN</span><button onClick={() => changeTab('inicio')}>Volver al resumen ↑</button></footer>
          </article>
          <aside className="article-aside"><div className="aside-sticky"><p className="eyebrow">EN ESTA UNIDAD</p><button onClick={() => changeTab('nube')}>Características de la nube</button><button onClick={() => changeTab('responsabilidad')}>Modelo compartido</button><button onClick={() => changeTab('seguridad')}>Diseño seguro en Azure</button><button onClick={() => changeTab('laboratorio')}>Laboratorio práctico</button><div className="aside-rule" /><p className="aside-caption">DOCENTE</p><strong>Rubén Schnettler</strong><small>Ingeniería en Informática<br />INACAP Valparaíso</small></div></aside>
        </div>
      </main>
    </div>
  );
}

function SourceLine({ children }) {
  return <p className="source-line">{children}</p>;
}