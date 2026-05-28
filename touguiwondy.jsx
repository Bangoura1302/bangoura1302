import { useState, useEffect, useRef } from "react";

// ─── DONNÉES MOCK ───────────────────────────────────────────────────────────
const CONCESSIONS = [
  { id: 1, numero: "TGW-001", adresse: "Rue Principale, n°12", chef: "Mamadou Diallo", telephone: "+224 620 123 456", email: "m.diallo@email.com", membres: 8, statut: "Actif", remarques: "" },
  { id: 2, numero: "TGW-002", adresse: "Allée des Manguiers, n°3", chef: "Fatoumata Bah", telephone: "+224 621 234 567", email: "", membres: 5, statut: "Actif", remarques: "Concession partagée" },
  { id: 3, numero: "TGW-003", adresse: "Rue de l'École, n°7", chef: "Ibrahima Sow", telephone: "+224 622 345 678", email: "i.sow@email.com", membres: 12, statut: "Actif", remarques: "" },
  { id: 4, numero: "TGW-004", adresse: "Impasse Centrale, n°1", chef: "Aissatou Camara", telephone: "+224 623 456 789", email: "", membres: 3, statut: "Inactif", remarques: "Déménagement en cours" },
  { id: 5, numero: "TGW-005", adresse: "Rue du Marché, n°22", chef: "Ousmane Barry", telephone: "+224 624 567 890", email: "o.barry@email.com", membres: 9, statut: "Actif", remarques: "" },
  { id: 6, numero: "TGW-006", adresse: "Avenue de la Paix, n°15", chef: "Mariama Keita", telephone: "+224 625 678 901", email: "", membres: 6, statut: "Actif", remarques: "" },
];

const ANNONCES = [
  { id: 1, titre: "Réunion du Comité – Samedi 7 juin", type: "Réunion", contenu: "Le comité de quartier se réunit samedi 7 juin à 10h à la salle communautaire. Présence souhaitée de tous les chefs de ménage.", date: "2026-06-07", urgent: true },
  { id: 2, titre: "Collecte des cotisations – Mai 2026", type: "Finances", contenu: "La collecte des cotisations mensuelles débute le 1er juin. Merci de vous acquitter de votre contribution auprès du trésorier.", date: "2026-06-01", urgent: false },
  { id: 3, titre: "Nettoyage collectif du quartier", type: "Événement", contenu: "Une journée de nettoyage est organisée le dimanche 15 juin à 8h. Apportez vos outils. Merci pour votre participation.", date: "2026-06-15", urgent: false },
];

const COMITE = [
  { nom: "El Hadj Boubacar Diallo", role: "Président", telephone: "+224 628 001 001" },
  { nom: "Aminata Kouyaté", role: "Secrétaire Générale", telephone: "+224 628 001 002" },
  { nom: "Sekou Traoré", role: "Trésorier", telephone: "+224 628 001 003" },
  { nom: "Kadiatou Baldé", role: "Chargée de la Communication", telephone: "+224 628 001 004" },
  { nom: "Mamoudou Cellou", role: "Responsable Sécurité", telephone: "+224 628 001 005" },
];

// ─── PALETTE & STYLES ───────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --forest: #1a3a2a;
    --forest-mid: #2d5a3d;
    --forest-light: #3d7a52;
    --gold: #c8973a;
    --gold-light: #e5b86a;
    --cream: #faf7f2;
    --cream-mid: #f0ebe0;
    --text: #1a1a1a;
    --text-mid: #4a4a4a;
    --text-light: #888;
    --red: #c0392b;
    --white: #ffffff;
    --shadow: 0 4px 24px rgba(26,58,42,0.12);
    --shadow-sm: 0 2px 8px rgba(26,58,42,0.08);
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text);
    min-height: 100vh;
    font-size: 15px;
    line-height: 1.65;
  }

  /* NAV */
  .nav {
    background: var(--forest);
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 16px rgba(0,0,0,0.3);
  }
  .nav-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center;
    padding: 0 24px; gap: 8px;
    flex-wrap: wrap;
  }
  .nav-brand {
    font-family: 'Playfair Display', serif;
    color: var(--gold);
    font-size: 18px; font-weight: 700;
    padding: 14px 0;
    margin-right: 16px;
    cursor: pointer;
    white-space: nowrap;
    letter-spacing: 0.3px;
  }
  .nav-brand span { color: var(--white); font-weight: 600; }
  .nav-links { display: flex; flex-wrap: wrap; gap: 2px; flex: 1; }
  .nav-link {
    color: rgba(255,255,255,0.75);
    background: none; border: none;
    padding: 8px 12px; font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500; cursor: pointer;
    border-radius: 6px;
    transition: all 0.2s;
    white-space: nowrap;
  }
  .nav-link:hover, .nav-link.active {
    color: var(--gold-light);
    background: rgba(200,151,58,0.12);
  }
  .nav-login {
    background: var(--gold);
    color: var(--forest) !important;
    font-weight: 600 !important;
    border-radius: 6px;
    padding: 7px 14px !important;
  }
  .nav-login:hover { background: var(--gold-light); }

  /* HERO */
  .hero {
    background: linear-gradient(135deg, var(--forest) 0%, var(--forest-mid) 50%, #1f4d30 100%);
    color: var(--white);
    padding: 72px 24px 64px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8973a' fill-opacity='0.06'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.8;
  }
  .hero-badge {
    display: inline-block;
    background: rgba(200,151,58,0.2);
    border: 1px solid rgba(200,151,58,0.4);
    color: var(--gold-light);
    padding: 4px 14px; border-radius: 20px;
    font-size: 12px; font-weight: 500;
    letter-spacing: 1px; text-transform: uppercase;
    margin-bottom: 20px;
    position: relative;
  }
  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 5vw, 52px);
    font-weight: 700; line-height: 1.2;
    margin-bottom: 20px;
    position: relative;
  }
  .hero h1 em { color: var(--gold-light); font-style: normal; }
  .hero p {
    font-size: 17px; color: rgba(255,255,255,0.82);
    max-width: 600px; margin: 0 auto 36px;
    font-weight: 300; position: relative;
  }
  .hero-stats {
    display: flex; justify-content: center; gap: 48px;
    flex-wrap: wrap; position: relative;
  }
  .hero-stat { text-align: center; }
  .hero-stat strong {
    display: block;
    font-family: 'Playfair Display', serif;
    font-size: 32px; color: var(--gold-light);
  }
  .hero-stat span { font-size: 13px; color: rgba(255,255,255,0.6); }

  /* MAIN LAYOUT */
  .main { max-width: 1200px; margin: 0 auto; padding: 48px 24px; }
  .page-header {
    border-bottom: 2px solid var(--cream-mid);
    margin-bottom: 36px; padding-bottom: 20px;
  }
  .page-header h2 {
    font-family: 'Playfair Display', serif;
    font-size: 28px; color: var(--forest);
  }
  .page-header p { color: var(--text-mid); margin-top: 6px; }

  /* CARDS GRID */
  .grid-3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .grid-2 { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 20px; }

  .card {
    background: var(--white);
    border-radius: 12px;
    border: 1px solid rgba(26,58,42,0.08);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .card:hover { transform: translateY(-2px); box-shadow: var(--shadow); }
  .card-head {
    background: var(--forest);
    padding: 16px 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .card-head-icon {
    width: 40px; height: 40px; border-radius: 8px;
    background: rgba(200,151,58,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; flex-shrink: 0;
  }
  .card-num {
    font-family: 'Playfair Display', serif;
    color: var(--gold-light); font-size: 13px; font-weight: 600;
  }
  .card-name { color: var(--white); font-weight: 500; font-size: 15px; }
  .card-body { padding: 16px 20px; }
  .card-row {
    display: flex; gap: 8px; align-items: flex-start;
    margin-bottom: 8px; font-size: 13.5px;
  }
  .card-label { color: var(--text-light); min-width: 80px; font-weight: 500; }
  .card-val { color: var(--text-mid); }
  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .badge-actif { background: #e8f5e9; color: #2e7d32; }
  .badge-inactif { background: #fff3e0; color: #e65100; }
  .badge-urgent { background: #ffebee; color: var(--red); }
  .badge-info { background: #e3f2fd; color: #1565c0; }

  /* SEARCH BAR */
  .search-bar {
    background: var(--white);
    border: 1px solid rgba(26,58,42,0.12);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 28px;
    box-shadow: var(--shadow-sm);
    display: flex; gap: 12px; flex-wrap: wrap; align-items: flex-end;
  }
  .search-group { flex: 1; min-width: 200px; }
  .search-label { font-size: 12px; font-weight: 600; color: var(--text-mid); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
  .search-input, .search-select {
    width: 100%; padding: 10px 14px;
    border: 1.5px solid rgba(26,58,42,0.15);
    border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--text);
    background: var(--cream);
    outline: none; transition: border-color 0.2s;
  }
  .search-input:focus, .search-select:focus { border-color: var(--forest-light); }

  /* BUTTONS */
  .btn {
    padding: 10px 22px; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-primary { background: var(--forest); color: var(--white); }
  .btn-primary:hover { background: var(--forest-mid); }
  .btn-gold { background: var(--gold); color: var(--forest); }
  .btn-gold:hover { background: var(--gold-light); }
  .btn-outline {
    background: none; color: var(--forest);
    border: 1.5px solid var(--forest); 
  }
  .btn-outline:hover { background: var(--forest); color: var(--white); }
  .btn-sm { padding: 7px 14px; font-size: 13px; }

  /* FORM */
  .form-card {
    background: var(--white);
    border-radius: 12px;
    border: 1px solid rgba(26,58,42,0.08);
    box-shadow: var(--shadow-sm);
    padding: 32px;
    max-width: 680px; margin: 0 auto;
  }
  .form-title {
    font-family: 'Playfair Display', serif;
    font-size: 22px; color: var(--forest);
    margin-bottom: 24px; padding-bottom: 16px;
    border-bottom: 2px solid var(--cream-mid);
  }
  .form-group { margin-bottom: 20px; }
  .form-label {
    display: block; font-size: 13px; font-weight: 600;
    color: var(--text-mid); margin-bottom: 7px;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .form-label .req { color: var(--red); margin-left: 3px; }
  .form-input, .form-select, .form-textarea {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid rgba(26,58,42,0.15);
    border-radius: 8px; font-family: 'DM Sans', sans-serif;
    font-size: 14px; color: var(--text);
    background: var(--cream);
    outline: none; transition: border-color 0.2s;
  }
  .form-input:focus, .form-select:focus, .form-textarea:focus {
    border-color: var(--forest-light);
    background: var(--white);
  }
  .form-textarea { resize: vertical; min-height: 100px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-hint { font-size: 12px; color: var(--text-light); margin-top: 5px; }
  .form-check { display: flex; gap: 10px; align-items: flex-start; margin-top: 8px; }
  .form-check input { margin-top: 3px; accent-color: var(--forest); }
  .form-check label { font-size: 13px; color: var(--text-mid); line-height: 1.5; }
  .form-success {
    background: #e8f5e9; border: 1px solid #a5d6a7;
    border-radius: 8px; padding: 16px 20px;
    color: #2e7d32; font-size: 14px; margin-top: 16px;
    display: flex; gap: 10px; align-items: center;
  }

  /* ANNONCES */
  .annonce-card {
    background: var(--white);
    border-radius: 10px;
    border: 1px solid rgba(26,58,42,0.08);
    border-left: 4px solid var(--forest-light);
    padding: 20px 24px;
    box-shadow: var(--shadow-sm);
    margin-bottom: 16px;
  }
  .annonce-card.urgent { border-left-color: var(--red); }
  .annonce-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
  .annonce-title { font-family: 'Playfair Display', serif; font-size: 17px; color: var(--forest); }
  .annonce-meta { font-size: 12px; color: var(--text-light); margin-top: 4px; }
  .annonce-body { color: var(--text-mid); font-size: 14px; line-height: 1.65; }

  /* COMITE */
  .comite-card {
    background: var(--white);
    border-radius: 10px;
    border: 1px solid rgba(26,58,42,0.08);
    padding: 20px;
    display: flex; align-items: center; gap: 16px;
    box-shadow: var(--shadow-sm);
  }
  .comite-avatar {
    width: 52px; height: 52px; border-radius: 50%;
    background: linear-gradient(135deg, var(--forest), var(--forest-light));
    display: flex; align-items: center; justify-content: center;
    color: var(--gold-light); font-size: 20px;
    font-family: 'Playfair Display', serif; font-weight: 700;
    flex-shrink: 0;
  }
  .comite-name { font-weight: 600; color: var(--text); font-size: 15px; }
  .comite-role { font-size: 13px; color: var(--forest-light); font-weight: 500; }
  .comite-tel { font-size: 13px; color: var(--text-light); margin-top: 4px; }

  /* ESPACE CLIENT */
  .login-wrap {
    min-height: 60vh; display: flex;
    align-items: center; justify-content: center;
  }
  .login-card {
    background: var(--white);
    border-radius: 16px;
    border: 1px solid rgba(26,58,42,0.08);
    box-shadow: var(--shadow);
    padding: 40px; width: 100%; max-width: 420px;
  }
  .login-logo {
    text-align: center; margin-bottom: 28px;
  }
  .login-logo-icon {
    width: 64px; height: 64px; border-radius: 16px;
    background: var(--forest); margin: 0 auto 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
  }
  .login-logo h3 {
    font-family: 'Playfair Display', serif;
    font-size: 20px; color: var(--forest);
  }
  .login-logo p { font-size: 13px; color: var(--text-light); }
  .profile-box {
    background: var(--forest);
    border-radius: 12px; padding: 24px;
    color: var(--white); margin-bottom: 24px;
  }
  .profile-box h3 {
    font-family: 'Playfair Display', serif;
    font-size: 20px; color: var(--gold-light);
  }
  .profile-item { margin-top: 12px; }
  .profile-key { font-size: 11px; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.5px; }
  .profile-val { font-size: 15px; color: var(--white); font-weight: 500; }

  /* MENTIONS */
  .prose { max-width: 760px; }
  .prose h3 {
    font-family: 'Playfair Display', serif;
    color: var(--forest); font-size: 18px;
    margin: 28px 0 10px;
    padding-bottom: 6px;
    border-bottom: 1px solid var(--cream-mid);
  }
  .prose p { color: var(--text-mid); margin-bottom: 14px; font-size: 14.5px; }
  .prose ul { padding-left: 20px; color: var(--text-mid); font-size: 14.5px; margin-bottom: 14px; }
  .prose li { margin-bottom: 6px; }

  /* CARTE */
  .map-placeholder {
    background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
    border: 2px dashed rgba(26,58,42,0.2);
    border-radius: 12px; height: 340px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: var(--forest-mid); gap: 12px;
  }
  .map-placeholder .icon { font-size: 48px; }
  .map-sidebar { display: flex; gap: 24px; flex-wrap: wrap; }
  .map-main { flex: 1; min-width: 280px; }
  .map-legend { min-width: 220px; }
  .legend-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px; border-radius: 8px;
    background: var(--white); margin-bottom: 8px;
    font-size: 13px; color: var(--text-mid);
    border: 1px solid rgba(26,58,42,0.07);
  }
  .legend-dot {
    width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;
  }

  /* ADMIN PANEL */
  .admin-layout { display: flex; min-height: calc(100vh - 52px); }
  .admin-sidebar {
    width: 220px; background: var(--forest);
    flex-shrink: 0; padding: 24px 0;
  }
  .admin-sidebar-title {
    color: var(--gold-light); font-size: 11px;
    font-weight: 700; text-transform: uppercase;
    letter-spacing: 1px; padding: 0 20px; margin-bottom: 12px;
  }
  .admin-nav-item {
    padding: 11px 20px; cursor: pointer;
    color: rgba(255,255,255,0.7); font-size: 14px;
    display: flex; gap: 10px; align-items: center;
    transition: all 0.15s;
  }
  .admin-nav-item:hover, .admin-nav-item.active {
    background: rgba(200,151,58,0.15);
    color: var(--gold-light);
  }
  .admin-content { flex: 1; padding: 32px; overflow: auto; }
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .stat-box {
    background: var(--white);
    border-radius: 10px; padding: 20px;
    border: 1px solid rgba(26,58,42,0.08);
    box-shadow: var(--shadow-sm);
  }
  .stat-box .num {
    font-family: 'Playfair Display', serif;
    font-size: 32px; color: var(--forest); font-weight: 700;
  }
  .stat-box .lbl { font-size: 12px; color: var(--text-light); text-transform: uppercase; letter-spacing: 0.5px; }
  .table-wrap { background: var(--white); border-radius: 10px; border: 1px solid rgba(26,58,42,0.08); overflow: hidden; }
  .data-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  .data-table th {
    background: var(--forest); color: var(--gold-light);
    padding: 12px 16px; text-align: left;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--cream-mid); color: var(--text-mid); }
  .data-table tr:hover td { background: var(--cream); }

  /* INFO BOXES */
  .info-box {
    background: linear-gradient(135deg, var(--forest), var(--forest-mid));
    border-radius: 12px; padding: 28px;
    color: var(--white); margin-bottom: 32px;
  }
  .info-box h3 { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--gold-light); margin-bottom: 10px; }
  .info-box p { font-size: 14px; color: rgba(255,255,255,0.8); }

  /* REGLES */
  .regle-section {
    background: var(--white); border-radius: 10px;
    border: 1px solid rgba(26,58,42,0.08);
    padding: 24px; margin-bottom: 16px;
    box-shadow: var(--shadow-sm);
  }
  .regle-section h3 {
    font-family: 'Playfair Display', serif;
    color: var(--forest); font-size: 17px;
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 14px;
  }
  .regle-list { list-style: none; }
  .regle-list li {
    padding: 8px 0; border-bottom: 1px solid var(--cream-mid);
    display: flex; gap: 10px; align-items: flex-start;
    color: var(--text-mid); font-size: 14px;
  }
  .regle-list li:last-child { border-bottom: none; }
  .regle-list li::before {
    content: "✦"; color: var(--gold); font-size: 11px; margin-top: 3px; flex-shrink: 0;
  }

  /* FOOTER */
  .footer {
    background: var(--forest);
    color: rgba(255,255,255,0.6);
    text-align: center; padding: 28px 24px;
    font-size: 13px; margin-top: 64px;
  }
  .footer strong { color: var(--gold-light); }

  /* MISC */
  .divider { height: 1px; background: var(--cream-mid); margin: 32px 0; }
  .text-center { text-align: center; }
  .mt-16 { margin-top: 16px; }
  .mt-24 { margin-top: 24px; }
  .empty { text-align: center; padding: 48px; color: var(--text-light); }

  @media (max-width: 640px) {
    .form-grid { grid-template-columns: 1fr; }
    .nav-links { gap: 1px; }
    .nav-link { padding: 7px 8px; font-size: 12px; }
    .hero { padding: 48px 20px 40px; }
    .hero-stats { gap: 28px; }
    .admin-layout { flex-direction: column; }
    .admin-sidebar { width: 100%; display: flex; flex-wrap: wrap; padding: 12px; gap: 4px; }
    .admin-nav-item { padding: 8px 12px; font-size: 13px; border-radius: 6px; }
    .admin-sidebar-title { display: none; }
    .map-sidebar { flex-direction: column; }
  }
`;

// ─── COMPOSANTS UTILITAIRES ─────────────────────────────────────────────────
function Badge({ type }) {
  const cls = type === "Actif" ? "badge badge-actif" : "badge badge-inactif";
  return <span className={cls}>{type}</span>;
}

// ─── PAGES ──────────────────────────────────────────────────────────────────
function PageAccueil({ setPage }) {
  return (
    <>
      <div className="hero">
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
          <img src="data:image/jpeg;base64,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" alt="Logo Touguiwondy" style={{ height: '110px', width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))' }} />
        </div>
        <div className="hero-badge">Site Officiel</div>
        <h1>Quartier <em>Touguiwondy</em></h1>
        <p>Bienvenue sur le site officiel du quartier Touguiwondy. Ce site rassemble les informations des habitants, des concessions et des chefs de ménage afin de faciliter la communication, la coordination et la vie communautaire.</p>
        <div className="hero-stats">
          <div className="hero-stat"><strong>6</strong><span>Concessions</span></div>
          <div className="hero-stat"><strong>43</strong><span>Ménages</span></div>
          <div className="hero-stat"><strong>3</strong><span>Annonces actives</span></div>
        </div>
      </div>

      <div className="main">
        {/* Accès rapide */}
        <div className="page-header">
          <h2>Accès rapide</h2>
          <p>Naviguez vers les sections principales du site</p>
        </div>
        <div className="grid-3">
          {[
            { icon: "🏠", titre: "Concessions", desc: "Annuaire des concessions du quartier avec coordonnées et responsables.", page: "concessions" },
            { icon: "👤", titre: "Chefs de ménage", desc: "Liste complète des chefs de ménage, statuts et informations de contact.", page: "chefs" },
            { icon: "📍", titre: "Carte & Contacts", desc: "Carte interactive du quartier et lieux utiles de proximité.", page: "carte" },
            { icon: "📢", titre: "Annonces", desc: "Dernières nouvelles, réunions et événements du comité.", page: "annonces" },
            { icon: "📝", titre: "Inscription", desc: "Enregistrez ou mettez à jour vos informations personnelles.", page: "inscription" },
            { icon: "🔐", titre: "Espace client", desc: "Consultez votre fiche personnelle en toute sécurité.", page: "espace" },
          ].map(item => (
            <div key={item.page} className="card" style={{ cursor: "pointer" }} onClick={() => setPage(item.page)}>
              <div className="card-head">
                <div className="card-head-icon">{item.icon}</div>
                <div><div className="card-name">{item.titre}</div></div>
              </div>
              <div className="card-body">
                <p style={{ color: "var(--text-mid)", fontSize: 14 }}>{item.desc}</p>
                <button className="btn btn-outline btn-sm mt-16" onClick={(e) => { e.stopPropagation(); setPage(item.page); }}>
                  Accéder →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dernière annonce */}
        <div className="divider" />
        <div className="page-header">
          <h2>Dernière annonce</h2>
        </div>
        <div className="annonce-card urgent">
          <div className="annonce-top">
            <div>
              <div className="annonce-title">{ANNONCES[0].titre}</div>
              <div className="annonce-meta">📅 {ANNONCES[0].date} · <span className="badge badge-urgent">Urgent</span></div>
            </div>
          </div>
          <div className="annonce-body">{ANNONCES[0].contenu}</div>
          <button className="btn btn-outline btn-sm mt-16" onClick={() => setPage("annonces")}>Voir toutes les annonces</button>
        </div>
      </div>
    </>
  );
}

function PageConcessions() {
  const [query, setQuery] = useState("");
  const [statut, setStatut] = useState("Tous");
  const filtered = CONCESSIONS.filter(c =>
    (c.numero.toLowerCase().includes(query.toLowerCase()) ||
     c.chef.toLowerCase().includes(query.toLowerCase()) ||
     c.adresse.toLowerCase().includes(query.toLowerCase())) &&
    (statut === "Tous" || c.statut === statut)
  );

  return (
    <div className="main">
      <div className="page-header">
        <h2>Annuaire des Concessions</h2>
        <p>Liste officielle des concessions enregistrées du quartier Touguiwondy</p>
      </div>

      <div className="search-bar">
        <div className="search-group">
          <div className="search-label">Rechercher</div>
          <input className="search-input" placeholder="Nom, numéro, adresse…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div className="search-group" style={{ maxWidth: 160 }}>
          <div className="search-label">Statut</div>
          <select className="search-select" value={statut} onChange={e => setStatut(e.target.value)}>
            <option>Tous</option>
            <option>Actif</option>
            <option>Inactif</option>
          </select>
        </div>
        <div style={{ alignSelf: "flex-end" }}>
          <button className="btn btn-primary btn-sm" onClick={() => { setQuery(""); setStatut("Tous"); }}>Réinitialiser</button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Aucune concession trouvée.</div>
      ) : (
        <div className="grid-3">
          {filtered.map(c => (
            <div key={c.id} className="card">
              <div className="card-head">
                <div className="card-head-icon">🏠</div>
                <div>
                  <div className="card-num">{c.numero}</div>
                  <div className="card-name">{c.chef}</div>
                </div>
              </div>
              <div className="card-body">
                <div className="card-row"><span className="card-label">Adresse</span><span className="card-val">{c.adresse}</span></div>
                <div className="card-row"><span className="card-label">Téléphone</span><span className="card-val">{c.telephone}</span></div>
                <div className="card-row"><span className="card-label">Membres</span><span className="card-val">{c.membres} personnes</span></div>
                <div className="card-row"><span className="card-label">Statut</span><Badge type={c.statut} /></div>
                {c.remarques && <div className="card-row"><span className="card-label">Note</span><span className="card-val" style={{ fontStyle: "italic", color: "var(--text-light)" }}>{c.remarques}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "right", marginTop: 24, color: "var(--text-light)", fontSize: 13 }}>
        {filtered.length} concession(s) affichée(s) sur {CONCESSIONS.length}
      </div>
    </div>
  );
}

function PageChefs() {
  const [query, setQuery] = useState("");

  const filtered = CONCESSIONS.filter(c =>
    c.chef.toLowerCase().includes(query.toLowerCase()) ||
    c.numero.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="main">
      <div className="page-header">
        <h2>Chefs de Ménage</h2>
        <p>Registre des chefs de ménage et responsables de concession</p>
      </div>

      <div className="search-bar">
        <div className="search-group">
          <div className="search-label">Rechercher un chef de ménage</div>
          <input className="search-input" placeholder="Nom ou numéro de concession…" value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>N° Concession</th>
              <th>Nom complet</th>
              <th>Adresse</th>
              <th>Téléphone</th>
              <th>Membres</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td><strong style={{ color: "var(--forest)" }}>{c.numero}</strong></td>
                <td style={{ fontWeight: 500, color: "var(--text)" }}>{c.chef}</td>
                <td>{c.adresse}</td>
                <td>{c.telephone}</td>
                <td>{c.membres}</td>
                <td><Badge type={c.statut} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PageCarte() {
  return (
    <div className="main">
      <div className="page-header">
        <h2>Carte & Contacts du Quartier</h2>
        <p>Visualisation géographique des concessions et lieux utiles</p>
      </div>

      <div className="info-box" style={{ marginBottom: 24 }}>
        <h3>📍 Localisation du Quartier Touguiwondy</h3>
        <p>Quartier résidentiel, commune de Matam, Conakry, Guinée. Coordonnées approximatives : 9.58° N, 13.61° W</p>
      </div>

      <div className="map-sidebar">
        <div className="map-main">
          <div className="map-placeholder">
            <div className="icon">🗺️</div>
            <strong style={{ fontSize: 16 }}>Carte interactive</strong>
            <p style={{ fontSize: 13, textAlign: "center", maxWidth: 280 }}>
              Intégration Google Maps / OpenStreetMap avec marqueurs des concessions.<br />
              <em>(Nécessite une clé API Google Maps en production)</em>
            </p>
            <button className="btn btn-primary btn-sm mt-16">
              Ouvrir dans Google Maps
            </button>
          </div>
        </div>
        <div className="map-legend">
          <div style={{ fontWeight: 600, fontSize: 14, color: "var(--forest)", marginBottom: 12 }}>Légende</div>
          {[
            { color: "#2e7d32", label: "Concession active" },
            { color: "#e65100", label: "Concession inactive" },
            { color: "#1565c0", label: "École / Infrastructure" },
            { color: "#6a1b9a", label: "Lieu de culte" },
            { color: "#c62828", label: "Poste de santé" },
            { color: "#00695c", label: "Marché / Commerce" },
          ].map(l => (
            <div key={l.label} className="legend-item">
              <div className="legend-dot" style={{ background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />
      <div className="page-header" style={{ marginBottom: 20 }}>
        <h2>Contacts utiles du quartier</h2>
      </div>
      <div className="grid-3">
        {[
          { icon: "🏛️", titre: "Mairie de Matam", tel: "+224 628 100 200", note: "Lundi–Vendredi, 8h–16h" },
          { icon: "🏥", titre: "Poste de santé", tel: "+224 628 200 300", note: "Urgences 24h/24" },
          { icon: "🚒", titre: "Pompiers / Urgences", tel: "18", note: "Numéro national" },
          { icon: "👮", titre: "Commissariat", tel: "+224 628 300 400", note: "Permanence 24h/24" },
        ].map(c => (
          <div key={c.titre} className="card">
            <div className="card-head">
              <div className="card-head-icon">{c.icon}</div>
              <div className="card-name">{c.titre}</div>
            </div>
            <div className="card-body">
              <div className="card-row"><span className="card-label">Tél.</span><span className="card-val">{c.tel}</span></div>
              <div className="card-row"><span className="card-label">Horaires</span><span className="card-val">{c.note}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageAnnonces() {
  return (
    <div className="main">
      <div className="page-header">
        <h2>Annonces du Quartier</h2>
        <p>Informations officielles, réunions et événements communautaires</p>
      </div>

      {ANNONCES.map(a => (
        <div key={a.id} className={`annonce-card ${a.urgent ? "urgent" : ""}`}>
          <div className="annonce-top">
            <div>
              <div className="annonce-title">{a.titre}</div>
              <div className="annonce-meta">📅 {a.date} · <span className={`badge ${a.urgent ? "badge-urgent" : "badge-info"}`}>{a.type}</span></div>
            </div>
            {a.urgent && <span className="badge badge-urgent">⚡ Urgent</span>}
          </div>
          <div className="annonce-body">{a.contenu}</div>
        </div>
      ))}

      <div className="divider" />
      <div className="info-box">
        <h3>📮 Soumettre une annonce</h3>
        <p>Vous souhaitez publier une information communautaire ? Contactez le comité de quartier ou connectez-vous à votre espace client pour soumettre une demande.</p>
      </div>
    </div>
  );
}

function PageInscription() {
  const [type, setType] = useState("inscription");
  const [sent, setSent] = useState(false);
  const [consent, setConsent] = useState(false);

  return (
    <div className="main">
      <div className="page-header">
        <h2>Inscription & Mise à jour</h2>
        <p>Enregistrez vos informations ou signalez un changement de situation</p>
      </div>

      <div style={{ marginBottom: 24, display: "flex", gap: 10, flexWrap: "wrap" }}>
        {["inscription", "demenagement", "naissance", "deces", "telephone", "autre"].map(t => (
          <button key={t} className={`btn btn-sm ${type === t ? "btn-primary" : "btn-outline"}`} onClick={() => { setType(t); setSent(false); }}>
            {{ inscription: "📝 Nouvelle inscription", demenagement: "📦 Déménagement", naissance: "👶 Naissance", deces: "🕯️ Décès", telephone: "📞 Changement tél.", autre: "✏️ Autre" }[t]}
          </button>
        ))}
      </div>

      <div className="form-card">
        <div className="form-title">
          {{ inscription: "Nouvelle inscription", demenagement: "Signaler un déménagement", naissance: "Déclarer une naissance", deces: "Déclarer un décès", telephone: "Mettre à jour un téléphone", autre: "Autre demande" }[type]}
        </div>

        {sent ? (
          <div className="form-success">
            ✅ Votre demande a bien été transmise au comité de quartier. Vous serez contacté pour confirmation.
          </div>
        ) : (
          <>
            {type === "inscription" && (
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nom complet <span className="req">*</span></label>
                  <input className="form-input" placeholder="Prénom NOM" />
                </div>
                <div className="form-group">
                  <label className="form-label">N° Concession <span className="req">*</span></label>
                  <input className="form-input" placeholder="TGW-XXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone principal <span className="req">*</span></label>
                  <input className="form-input" placeholder="+224 6XX XXX XXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Téléphone secondaire</label>
                  <input className="form-input" placeholder="+224 6XX XXX XXX" />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input className="form-input" placeholder="email@exemple.com" />
                </div>
                <div className="form-group">
                  <label className="form-label">Nb. membres du ménage <span className="req">*</span></label>
                  <input className="form-input" type="number" placeholder="Ex: 6" min="1" />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{{ inscription: "Informations complémentaires", demenagement: "Nouvelle adresse et date de départ", naissance: "Prénom de l'enfant, date de naissance", deces: "Nom du défunt, date du décès", telephone: "Ancien et nouveau numéro", autre: "Description de la demande" }[type]} <span className="req">*</span></label>
              <textarea className="form-textarea" placeholder="Décrivez votre demande ici…" />
            </div>

            <div className="form-group">
              <label className="form-label">Pièce jointe (optionnel)</label>
              <input className="form-input" type="file" style={{ paddingTop: 7 }} />
              <div className="form-hint">Formats acceptés : PDF, JPG, PNG (max 5 Mo)</div>
            </div>

            <div className="form-check">
              <input type="checkbox" id="consent" checked={consent} onChange={e => setConsent(e.target.checked)} />
              <label htmlFor="consent">
                J'accepte que mes données personnelles soient collectées et traitées par le comité du quartier Touguiwondy à des fins de gestion communautaire, conformément au <strong>droit à la protection des données</strong>. Je peux demander la rectification ou la suppression de mes données à tout moment.
              </label>
            </div>

            <button className="btn btn-gold mt-24" style={{ width: "100%", justifyContent: "center" }}
              disabled={!consent} onClick={() => setSent(true)}>
              Envoyer la demande
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PageEspaceClient() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (email === "chef@touguiwondy.gn" && pwd === "demo1234") {
      setLoggedIn(true); setError("");
    } else {
      setError("Identifiants incorrects. Essayez : chef@touguiwondy.gn / demo1234");
    }
  };

  if (!loggedIn) return (
    <div className="main">
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">
            <img src="data:image/jpeg;base64,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" alt="Logo Touguiwondy" style={{ height: '70px', width: 'auto', objectFit: 'contain', marginBottom: 10 }} />
            <h3>Espace Client</h3>
            <p>Quartier Touguiwondy</p>
          </div>
          <div className="form-group">
            <label className="form-label">Adresse email</label>
            <input className="form-input" placeholder="votre@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input className="form-input" type="password" placeholder="••••••••" value={pwd} onChange={e => setPwd(e.target.value)} />
          </div>
          {error && <div style={{ color: "var(--red)", fontSize: 13, marginBottom: 12, padding: "10px 14px", background: "#ffebee", borderRadius: 8 }}>{error}</div>}
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={handleLogin}>
            Se connecter
          </button>
          <p style={{ fontSize: 12, color: "var(--text-light)", textAlign: "center", marginTop: 16 }}>
            Vous n'avez pas encore de compte ? Rendez-vous sur la page <strong>Inscription</strong>.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="main">
      <div className="page-header">
        <h2>Mon Espace Client</h2>
        <p>Consultez votre fiche et envoyez des demandes de correction</p>
      </div>

      <div className="profile-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h3>Mamadou Diallo</h3>
          <Badge type="Actif" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          {[["N° Concession", "TGW-001"], ["Adresse", "Rue Principale, n°12"], ["Téléphone", "+224 620 123 456"], ["Membres du ménage", "8 personnes"], ["Dernière MAJ", "15/04/2026"]].map(([k, v]) => (
            <div key={k} className="profile-item">
              <div className="profile-key">{k}</div>
              <div className="profile-val">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-card" style={{ marginTop: 0 }}>
        <div className="form-title">Demande de correction</div>
        <div className="form-group">
          <label className="form-label">Type de demande</label>
          <select className="form-select">
            <option>Correction d'informations</option>
            <option>Changement de téléphone</option>
            <option>Mise à jour du nombre de membres</option>
            <option>Autre</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description <span className="req">*</span></label>
          <textarea className="form-textarea" placeholder="Décrivez la correction souhaitée…" />
        </div>
        <button className="btn btn-gold" style={{ justifyContent: "center" }}>
          Envoyer la demande
        </button>
      </div>

      <div className="mt-24 text-center">
        <button className="btn btn-outline btn-sm" onClick={() => setLoggedIn(false)}>Se déconnecter</button>
      </div>
    </div>
  );
}

function PageRegles() {
  return (
    <div className="main">
      <div className="page-header">
        <h2>Règles & Vie du Quartier</h2>
        <p>Charte communautaire et règles de bon voisinage</p>
      </div>

      {[
        {
          icon: "🕊️", titre: "Vivre ensemble",
          rules: ["Respecter les voisins et leur propriété.", "Maintenir la propreté devant et autour de sa concession.", "Éviter les nuisances sonores entre 00h30 et 06h.", "Régler les conflits par la dialogue et, si nécessaire, via le comité."]
        },
        {
          icon: "🧹", titre: "Hygiène & Environnement",
          rules: ["Ne pas jeter les ordures dans la rue ou les caniveaux.", "Participer aux journées de nettoyage collectif.", "Signaler les problèmes d'assainissement au comité.", "Utiliser les points de collecte des déchets désignés."]
        },
        {
          icon: "🔒", titre: "Sécurité",
          rules: ["Signaler tout incident ou comportement suspect au responsable sécurité.", "Fermer les accès à sa concession la nuit.", "Coopérer avec les initiatives de surveillance communautaire.", "Ne pas laisser les enfants sans surveillance dans la rue."]
        },
        {
          icon: "💰", titre: "Finances & Cotisations",
          rules: ["S'acquitter des cotisations mensuelles dans les délais fixés.", "Toute exonération doit être demandée auprès du trésorier.", "Les fonds collectés sont utilisés pour les projets communautaires.", "Un compte rendu financier est présenté chaque trimestre."]
        },
      ].map(s => (
        <div key={s.titre} className="regle-section">
          <h3>{s.icon} {s.titre}</h3>
          <ul className="regle-list">
            {s.rules.map(r => <li key={r}>{r}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function PageComite() {
  return (
    <div className="main">
      <div className="page-header">
        <h2>Comité de Quartier</h2>
        <p>L'équipe élue qui administre et représente le quartier Touguiwondy</p>
      </div>

      <div className="info-box" style={{ marginBottom: 28 }}>
        <h3>🏛️ Rôle du Comité</h3>
        <p>Le comité de quartier est l'organe représentatif des habitants. Il assure la coordination des activités communautaires, la gestion des cotisations, la communication avec les autorités locales, et la résolution des conflits internes.</p>
      </div>

      <div className="grid-2">
        {COMITE.map(m => (
          <div key={m.nom} className="comite-card">
            <div className="comite-avatar">{m.nom[0]}</div>
            <div>
              <div className="comite-name">{m.nom}</div>
              <div className="comite-role">{m.role}</div>
              <div className="comite-tel">📞 {m.telephone}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />
      <div className="regle-section">
        <h3>📅 Réunions du Comité</h3>
        <ul className="regle-list">
          <li>Les réunions ordinaires ont lieu le premier samedi de chaque mois à 10h.</li>
          <li>Les réunions extraordinaires sont convoquées en cas d'urgence avec préavis de 48h.</li>
          <li>La présence des chefs de ménage est fortement souhaitée.</li>
          <li>Les comptes rendus sont affichés sur ce site et à la salle communautaire.</li>
        </ul>
      </div>
    </div>
  );
}

function PageMentions() {
  return (
    <div className="main">
      <div className="page-header">
        <h2>Mentions Légales & Protection des Données</h2>
        <p>Informations légales, confidentialité et droits des utilisateurs</p>
      </div>
      <div className="prose">
        <h3>1. Éditeur du site</h3>
        <p>Ce site est édité par le Comité du Quartier Touguiwondy, situé dans la commune de Matam, Conakry, République de Guinée. Contact : comite@touguiwondy.gn</p>

        <h3>2. Finalité du traitement des données</h3>
        <p>Les données collectées (nom, téléphone, adresse, email) sont utilisées exclusivement pour :</p>
        <ul>
          <li>La gestion du registre des habitants et concessions du quartier</li>
          <li>La communication interne entre le comité et les chefs de ménage</li>
          <li>La coordination des activités communautaires</li>
          <li>La sécurité et la protection des résidents</li>
        </ul>

        <h3>3. Droits des utilisateurs</h3>
        <p>Conformément aux principes de protection des données personnelles, tout habitant dispose des droits suivants :</p>
        <ul>
          <li><strong>Droit d'accès</strong> : consulter les données vous concernant via l'espace client</li>
          <li><strong>Droit de rectification</strong> : corriger toute information inexacte</li>
          <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données</li>
          <li><strong>Droit d'opposition</strong> : vous opposer à l'utilisation de vos données</li>
        </ul>
        <p>Pour exercer ces droits, envoyez une demande écrite au comité ou utilisez le formulaire de l'espace client.</p>

        <h3>4. Sécurité des données</h3>
        <p>Les données personnelles sont stockées sur des serveurs sécurisés avec contrôle d'accès, chiffrement, et sauvegardes régulières. L'accès aux données sensibles est restreint aux membres autorisés du comité.</p>

        <h3>5. Données non publiées</h3>
        <p>Les données personnelles (email, téléphone, adresse précise) ne sont jamais affichées publiquement sur ce site. Seuls les numéros de concession et les noms des responsables peuvent être visibles.</p>

        <h3>6. Consentement</h3>
        <p>Toute inscription ou mise à jour de données requiert le consentement explicite de l'habitant concerné, matérialisé par la case à cocher sur le formulaire d'inscription.</p>

        <h3>7. Contact</h3>
        <p>Pour toute question relative à ce site ou à vos données personnelles, contactez : <strong>comite@touguiwondy.gn</strong> ou appelez le <strong>+224 628 001 001</strong>.</p>
      </div>
    </div>
  );
}

// ─── PANNEAU ADMIN ───────────────────────────────────────────────────────────
function PageAdmin({ setPage }) {
  const [section, setSection] = useState("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);
  const [pwd, setPwd] = useState("");

  if (!loggedIn) return (
    <div className="main">
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo">
            <div className="login-logo-icon">⚙️</div>
            <h3>Panneau Administration</h3>
            <p>Accès réservé au comité</p>
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe admin</label>
            <input className="form-input" type="password" placeholder="••••••••" value={pwd} onChange={e => setPwd(e.target.value)} />
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}
            onClick={() => { if (pwd === "admin2026") setLoggedIn(true); }}>
            Accéder au panneau
          </button>
          <p style={{ fontSize: 12, color: "var(--text-light)", textAlign: "center", marginTop: 12 }}>Demo : admin2026</p>
        </div>
      </div>
    </div>
  );

  const navItems = [
    { id: "dashboard", icon: "📊", label: "Tableau de bord" },
    { id: "concessions", icon: "🏠", label: "Concessions" },
    { id: "demandes", icon: "📋", label: "Demandes" },
    { id: "annonces", icon: "📢", label: "Annonces" },
    { id: "export", icon: "⬇️", label: "Export CSV" },
  ];

  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <div className="admin-sidebar-title">Administration</div>
        {navItems.map(n => (
          <div key={n.id} className={`admin-nav-item ${section === n.id ? "active" : ""}`} onClick={() => setSection(n.id)}>
            <span>{n.icon}</span>{n.label}
          </div>
        ))}
        <div style={{ marginTop: "auto", paddingTop: 24 }}>
          <div className="admin-nav-item" onClick={() => setLoggedIn(false)}>🚪 Déconnexion</div>
          <div className="admin-nav-item" onClick={() => setPage("accueil")}>← Site public</div>
        </div>
      </div>

      <div className="admin-content">
        {section === "dashboard" && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--forest)", marginBottom: 24, fontSize: 22 }}>Tableau de bord</h2>
            <div className="stat-grid">
              {[["6", "Concessions"], ["5", "Actives"], ["43", "Membres total"], ["3", "Annonces"], ["2", "Demandes en attente"]].map(([n, l]) => (
                <div key={l} className="stat-box"><div className="num">{n}</div><div className="lbl">{l}</div></div>
              ))}
            </div>
            <div className="info-box">
              <h3>Demandes en attente de traitement</h3>
              <p>2 demandes de mise à jour sont en attente de validation. Cliquez sur "Demandes" dans le menu pour les traiter.</p>
            </div>
          </>
        )}

        {section === "concessions" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--forest)", fontSize: 22 }}>Gestion des Concessions</h2>
              <button className="btn btn-gold btn-sm">+ Ajouter</button>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>N°</th><th>Chef</th><th>Adresse</th><th>Tél.</th><th>Membres</th><th>Statut</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {CONCESSIONS.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.numero}</strong></td>
                      <td>{c.chef}</td>
                      <td>{c.adresse}</td>
                      <td>{c.telephone}</td>
                      <td>{c.membres}</td>
                      <td><Badge type={c.statut} /></td>
                      <td>
                        <button className="btn btn-outline btn-sm" style={{ marginRight: 6 }}>✏️</button>
                        <button className="btn btn-sm" style={{ background: "#ffebee", color: "var(--red)", border: "1px solid #ffcdd2" }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {section === "demandes" && (
          <>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--forest)", marginBottom: 24, fontSize: 22 }}>Demandes de mise à jour</h2>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th>Chef de ménage</th><th>Type</th><th>Description</th><th>Statut</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>20/05/2026</td>
                    <td>Mamadou Diallo</td>
                    <td>Changement tél.</td>
                    <td>Nouveau numéro : +224 622 000 111</td>
                    <td><span className="badge badge-urgent">En attente</span></td>
                    <td>
                      <button className="btn btn-sm" style={{ background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7", marginRight: 6 }}>✅ Valider</button>
                      <button className="btn btn-sm" style={{ background: "#ffebee", color: "var(--red)", border: "1px solid #ffcdd2" }}>✗ Rejeter</button>
                    </td>
                  </tr>
                  <tr>
                    <td>18/05/2026</td>
                    <td>Aissatou Camara</td>
                    <td>Déménagement</td>
                    <td>Départ prévu fin juin 2026, retour incertain</td>
                    <td><span className="badge badge-urgent">En attente</span></td>
                    <td>
                      <button className="btn btn-sm" style={{ background: "#e8f5e9", color: "#2e7d32", border: "1px solid #a5d6a7", marginRight: 6 }}>✅ Valider</button>
                      <button className="btn btn-sm" style={{ background: "#ffebee", color: "var(--red)", border: "1px solid #ffcdd2" }}>✗ Rejeter</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        )}

        {section === "annonces" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--forest)", fontSize: 22 }}>Gestion des Annonces</h2>
              <button className="btn btn-gold btn-sm">+ Nouvelle annonce</button>
            </div>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Date</th><th>Titre</th><th>Type</th><th>Urgent</th><th>Actions</th></tr></thead>
                <tbody>
                  {ANNONCES.map(a => (
                    <tr key={a.id}>
                      <td>{a.date}</td>
                      <td>{a.titre}</td>
                      <td><span className="badge badge-info">{a.type}</span></td>
                      <td>{a.urgent ? <span className="badge badge-urgent">Oui</span> : "Non"}</td>
                      <td>
                        <button className="btn btn-outline btn-sm" style={{ marginRight: 6 }}>✏️</button>
                        <button className="btn btn-sm" style={{ background: "#ffebee", color: "var(--red)", border: "1px solid #ffcdd2" }}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {section === "export" && (
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", color: "var(--forest)", marginBottom: 24, fontSize: 22 }}>Export des données</h2>
            <div className="grid-2">
              {[
                { titre: "Export Concessions", desc: "Liste complète des concessions avec coordonnées", icon: "🏠" },
                { titre: "Export Chefs de ménage", desc: "Registre complet des chefs et membres", icon: "👥" },
                { titre: "Export Demandes", desc: "Toutes les demandes de mise à jour reçues", icon: "📋" },
                { titre: "Export Annonces", desc: "Historique des annonces publiées", icon: "📢" },
              ].map(e => (
                <div key={e.titre} className="card">
                  <div className="card-head"><div className="card-head-icon">{e.icon}</div><div className="card-name">{e.titre}</div></div>
                  <div className="card-body">
                    <p style={{ color: "var(--text-mid)", fontSize: 13.5, marginBottom: 16 }}>{e.desc}</p>
                    <button className="btn btn-primary btn-sm">⬇️ Télécharger CSV</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── APP PRINCIPALE ──────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("accueil");

  const NAV = [
    { id: "accueil", label: "Accueil" },
    { id: "concessions", label: "Concessions" },
    { id: "chefs", label: "Chefs de ménage" },
    { id: "carte", label: "Carte & Contacts" },
    { id: "annonces", label: "Annonces" },
    { id: "regles", label: "Règles" },
    { id: "comite", label: "Comité" },
    { id: "inscription", label: "Inscription" },
    { id: "espace", label: "Espace client", login: true },
    { id: "admin", label: "Admin", login: true },
  ];

  const renderPage = () => {
    switch (page) {
      case "accueil": return <PageAccueil setPage={setPage} />;
      case "concessions": return <PageConcessions />;
      case "chefs": return <PageChefs />;
      case "carte": return <PageCarte />;
      case "annonces": return <PageAnnonces />;
      case "inscription": return <PageInscription />;
      case "espace": return <PageEspaceClient />;
      case "regles": return <PageRegles />;
      case "comite": return <PageComite />;
      case "mentions": return <PageMentions />;
      case "admin": return <PageAdmin setPage={setPage} />;
      default: return <PageAccueil setPage={setPage} />;
    }
  };

  return (
    <>
      <style>{css}</style>

      <nav className="nav">
        <div className="nav-inner">
          <div onClick={() => setPage("accueil")} style={{ cursor: 'pointer', padding: '5px 0', marginRight: 16, display: 'flex', alignItems: 'center' }}>
            <img src="data:image/jpeg;base64,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" alt="Logo Touguiwondy" style={{ height: '46px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <div className="nav-links">
            {NAV.filter(n => !n.login).map(n => (
              <button key={n.id} className={`nav-link ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                {n.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginLeft: "auto" }}>
            <button className={`nav-link ${page === "espace" ? "active" : ""}`} style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }} onClick={() => setPage("espace")}>🔐 Espace client</button>
            <button className={`nav-link nav-login`} onClick={() => setPage("admin")}>⚙️ Admin</button>
          </div>
        </div>
      </nav>

      <main>
        {renderPage()}
      </main>

      <footer className="footer">
        <div>
          <strong>Quartier Touguiwondy</strong> · Commune de Matam, Conakry, Guinée<br />
          <span style={{ marginTop: 6, display: "inline-block" }}>
            © 2026 Comité de Quartier ·{" "}
            <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => setPage("mentions")}>Mentions légales & Confidentialité</span>
          </span>
        </div>
      </footer>
    </>
  );
}
