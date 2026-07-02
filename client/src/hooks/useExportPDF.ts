import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import type { Transaction } from '@budgetwise/shared';
import { TransactionType } from '@budgetwise/shared';

// Type étendu pour inclure les données enrichies (category et account)
type TransactionWithDetails = Transaction & {
  category?: { name: string };
  account?: { name: string };
};

interface ExportPDFOptions {
  title: string;
  subtitle?: string;
  transactions: TransactionWithDetails[];
  summary?: {
    totalIncome: number;
    totalExpense: number;
    balance: number;
  };
}

export function useExportPDF() {
  const exportTransactionsToPDF = ({
    title,
    subtitle,
    transactions,
    summary
  }: ExportPDFOptions) => {
    const doc = new jsPDF();

    // En-tête
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // Vert émeraude
    doc.text(title, 14, 20);

    if (subtitle) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(subtitle, 14, 28);
    }

    // Footer avec branding Nefertiti Digital Solutions
    doc.setFontSize(8);
    doc.setTextColor(0, 136, 255); // Bleu NDS
    doc.text('Generated with BudgetWise', 14, 285);
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text('Powered by Nefertiti Digital Solutions', 14, 290);

    // Tableau des transactions
    const tableData = transactions.map((t) => [
      format(new Date(t.date), 'dd/MM/yyyy'),
      t.description,
      t.category?.name || '-',
      t.account?.name || '-',
      t.type === TransactionType.INCOME ? `+${t.amount.toLocaleString('fr-FR')}` : `-${t.amount.toLocaleString('fr-FR')}`,
    ]);

    autoTable(doc, {
      startY: subtitle ? 35 : 30,
      head: [['Date', 'Description', 'Catégorie', 'Compte', 'Montant (XOF)']],
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [16, 185, 129], // Vert émeraude
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 60 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 },
        4: { cellWidth: 30, halign: 'right', fontStyle: 'bold' },
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
    });

    // Résumé financier
    if (summary) {
      const finalY = (doc as any).lastAutoTable.finalY || 35;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text('Résumé Financier', 14, finalY + 15);

      autoTable(doc, {
        startY: finalY + 20,
        head: [['Type', 'Montant (XOF)']],
        body: [
          ['Revenus', `+${summary.totalIncome.toLocaleString('fr-FR')}`],
          ['Dépenses', `-${summary.totalExpense.toLocaleString('fr-FR')}`],
          ['Solde', summary.balance.toLocaleString('fr-FR')],
        ],
        theme: 'plain',
        headStyles: {
          fillColor: [16, 185, 129],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        columnStyles: {
          1: { halign: 'right', fontStyle: 'bold' },
        },
        bodyStyles: {
          fontSize: 10,
        },
        footStyles: {
          fillColor: [240, 253, 244],
          textColor: [0, 0, 0],
          fontStyle: 'bold',
        },
      });
    }

    // Télécharger le PDF
    const filename = `budgetwise-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
    doc.save(filename);
  };

  return { exportTransactionsToPDF };
}
