export interface InvoiceSettings {
  siteName?: string;
  tagline?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  siret?: string;
  footerBrand?: string;
  vatNumber?: string;
}

export interface InvoiceBuyer {
  company_name?: string;
  contact_name?: string;
  email?: string;
  siret?: string;
  vat_number?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
}

export interface InvoiceItem {
  product_name: string;
  product_reference?: string;
  quantity: number;
  unit_price_ht: number;
  line_total_ht: number;
}

export interface InvoiceOrder {
  id: string;
  reference: string;
  created_at: string;
  status: string;
  total_ttc: number;
  subtotal_ht: number;
  vat_amount: number;
  shipping_ht: number;
  carrier?: string | null;
  shipping_address?: Record<string, string> | null;
  items: InvoiceItem[];
}

export function renderInvoiceHTML(
  order: InvoiceOrder,
  settings: InvoiceSettings,
  buyer?: InvoiceBuyer | null
) {
  const date = new Date(order.created_at).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const brandName = settings.siteName || "UNIVER BIJOUX";
  const brandTagline = settings.tagline || "Grossiste bijoux français";

  const buyerCompany = buyer?.company_name || order.shipping_address?.company || "";
  const buyerContact = buyer?.contact_name || order.shipping_address?.name || "";
  const buyerSiret = buyer?.siret || "";
  const buyerVat = buyer?.vat_number || "";
  const buyerAddress = [
    buyer?.address || order.shipping_address?.address || "",
    [buyer?.postal_code || order.shipping_address?.postal_code || "", buyer?.city || order.shipping_address?.city || ""].filter(Boolean).join(" "),
    buyer?.country || order.shipping_address?.country || "",
  ].filter(Boolean).join("<br>");

  const rows = (order.items || [])
    .map(
      (item) => {
        const lineTotal = Number(item.line_total_ht).toFixed(2);
        const unitPrice = Number(item.unit_price_ht).toFixed(2);
        const ref = item.product_reference ? `<br><span style="color:#999;font-size:11px">Réf. ${item.product_reference}</span>` : "";
        return `<tr>
          <td>${item.product_name}${ref}</td>
          <td style="text-align:center">${item.quantity}</td>
          <td style="text-align:right">${unitPrice} €</td>
          <td style="text-align:right">${lineTotal} €</td>
        </tr>`;
      }
    )
    .join("");

  const vatRate = order.subtotal_ht > 0
    ? ((Number(order.vat_amount) / Number(order.subtotal_ht)) * 100).toFixed(0)
    : "20";

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <title>Facture ${order.reference}</title>
  <style>
    @page { size: A4; margin: 20mm; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      color: #1a1a1a;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
      font-size: 13px;
      line-height: 1.5;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 24px;
      border-bottom: 3px solid #3a1a25;
      margin-bottom: 32px;
    }
    .header-left img { height: 56px; width: auto; object-fit: contain; }
    .header-left h1 { font-size: 24px; color: #3a1a25; margin-bottom: 4px; }
    .header-left .tagline { color: #9a7a5a; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
    .header-right { text-align: right; }
    .header-right h2 { font-size: 28px; color: #9a7a5a; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
    .header-right p { font-size: 13px; color: #666; }
    .header-right .ref { font-size: 15px; font-weight: 600; color: #3a1a25; margin-top: 4px; }

    .info-blocks {
      display: flex;
      justify-content: space-between;
      gap: 40px;
      margin-bottom: 36px;
    }
    .info-block {
      flex: 1;
      padding: 16px 20px;
      background: #faf7f2;
      border-left: 3px solid #9a7a5a;
    }
    .info-block h3 {
      font-size: 10px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #9a7a5a;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .info-block p { font-size: 12px; color: #333; margin-bottom: 2px; }
    .info-block .name { font-weight: 600; font-size: 13px; color: #1a1a1a; }

    table.items {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }
    table.items thead th {
      background: #3a1a25;
      color: #fff;
      padding: 10px 12px;
      font-size: 10px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-weight: 600;
      text-align: left;
    }
    table.items thead th:not(:first-child) { text-align: right; }
    table.items thead th:nth-child(2) { text-align: center; }
    table.items tbody td {
      padding: 10px 12px;
      border-bottom: 1px solid #e8e0d6;
      font-size: 12px;
    }
    table.items tbody td:not(:first-child) { text-align: right; }
    table.items tbody td:nth-child(2) { text-align: center; }
    table.items tbody tr:nth-child(even) { background: #faf7f2; }

    .totals {
      margin-left: auto;
      width: 320px;
      margin-bottom: 36px;
    }
    .totals table { width: 100%; border-collapse: collapse; }
    .totals td { padding: 8px 12px; font-size: 12px; border-bottom: 1px solid #e8e0d6; }
    .totals tr:last-child td { border-bottom: none; }
    .totals .label { color: #666; }
    .totals .value { text-align: right; font-weight: 500; }
    .totals .grand-total {
      background: #3a1a25;
      color: #fff;
    }
    .totals .grand-total td {
      padding: 12px;
      font-size: 16px;
      font-weight: 700;
      border: none;
    }
    .totals .grand-total .value { color: #f0d9a8; }

    .footer {
      margin-top: 48px;
      padding-top: 20px;
      border-top: 1px solid #e8e0d6;
      font-size: 10px;
      color: #888;
      text-align: center;
      line-height: 1.8;
    }
    .footer strong { color: #3a1a25; }

    @media print {
      body { padding: 0; }
      .header { border-bottom-color: #3a1a25 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      table.items thead th { background: #3a1a25 !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      table.items tbody tr:nth-child(even) { background: #faf7f2 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .totals .grand-total { background: #3a1a25 !important; color: #fff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .totals .grand-total .value { color: #f0d9a8 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .info-block { background: #faf7f2 !important; border-left-color: #9a7a5a !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-left">
      ${settings.logo
        ? `<img src="${settings.logo}" alt="${brandName}">`
        : `<h1>${brandName}</h1>`
      }
      <div class="tagline">${brandTagline}</div>
    </div>
    <div class="header-right">
      <h2>Facture</h2>
      <p class="ref">N° ${order.reference}</p>
      <p>Date : ${date}</p>
    </div>
  </div>

  <div class="info-blocks">
    <div class="info-block">
      <h3>Émetteur</h3>
      <p class="name">${brandName}</p>
      ${settings.address ? `<p>${settings.address}</p>` : ""}
      ${settings.siret ? `<p>SIRET : ${settings.siret}</p>` : ""}
      ${settings.vatNumber ? `<p>TVA : ${settings.vatNumber}</p>` : ""}
      ${settings.email ? `<p>${settings.email}</p>` : ""}
      ${settings.phone ? `<p>${settings.phone}</p>` : ""}
    </div>
    <div class="info-block">
      <h3>Facturé à</h3>
      ${buyerCompany ? `<p class="name">${buyerCompany}</p>` : ""}
      ${buyerContact ? `<p>${buyerContact}</p>` : ""}
      ${buyerAddress ? `<p>${buyerAddress}</p>` : ""}
      ${buyerSiret ? `<p>SIRET : ${buyerSiret}</p>` : ""}
      ${buyerVat ? `<p>TVA intracom. : ${buyerVat}</p>` : ""}
    </div>
  </div>

  <table class="items">
    <thead>
      <tr>
        <th>Désignation</th>
        <th>Qté</th>
        <th>PU HT</th>
        <th>Total HT</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr>
        <td class="label">Sous-total HT</td>
        <td class="value">${Number(order.subtotal_ht).toFixed(2)} €</td>
      </tr>
      <tr>
        <td class="label">Livraison HT</td>
        <td class="value">${Number(order.shipping_ht).toFixed(2)} €</td>
      </tr>
      <tr>
        <td class="label">TVA (${vatRate}%)</td>
        <td class="value">${Number(order.vat_amount).toFixed(2)} €</td>
      </tr>
      <tr class="grand-total">
        <td>Total TTC</td>
        <td class="value">${Number(order.total_ttc).toFixed(2)} €</td>
      </tr>
    </table>
  </div>

  <div class="footer">
    <p><strong>${brandName}</strong> · ${brandTagline}
    ${settings.address ? ` · ${settings.address}` : ""}
    ${settings.siret ? ` · SIRET ${settings.siret}` : ""}</p>
    <p>TVA applicable selon la législation en vigueur · Exonération de TVA intracommunautaire si numéro valide fourni</p>
    <p>Conditions de paiement : 30 jours date de facture · Pas d'escompte pour paiement anticipé</p>
    <p>En cas de retard de paiement, des pénalités égales à 3 fois le taux d'intérêt légal seront appliquées</p>
  </div>
</body>
</html>`;
}
