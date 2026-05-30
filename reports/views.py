import io
from django.http import HttpResponse
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from .models import Invoice, PaymentReceipt
from .serializers import InvoiceSerializer, PaymentReceiptSerializer


class InvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]


class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]


class GenerateInvoicePDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, invoice_id):
        try:
            invoice = Invoice.objects.select_related('patient').get(id=invoice_id)
        except Invoice.DoesNotExist:
            return Response({'error': 'Invoice not found'}, status=404)
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
        styles = getSampleStyleSheet()
        elements = []
        title_style = ParagraphStyle('T', parent=styles['Title'], fontSize=24, textColor=colors.HexColor('#1E40AF'), spaceAfter=6)
        sub_style = ParagraphStyle('S', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#6B7280'), spaceAfter=20)
        h_style = ParagraphStyle('H', parent=styles['Heading3'], fontSize=12, textColor=colors.HexColor('#374151'))
        elements.append(Paragraph("SMART PHYSIO CLINIC", title_style))
        elements.append(Paragraph("Invoice", sub_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#1E40AF')))
        elements.append(Spacer(1, 10))
        elements.append(Paragraph(f"INVOICE #{invoice.invoice_number}", h_style))
        elements.append(Spacer(1, 5))
        info_data = [['Date:', invoice.issue_date.strftime('%B %d, %Y')], ['Due Date:', invoice.due_date.strftime('%B %d, %Y')], ['Status:', invoice.status.upper()]]
        info_table = Table(info_data, colWidths=[4*cm, 6*cm])
        info_table.setStyle(TableStyle([('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'), ('FONTSIZE', (0,0), (-1,-1), 10)]))
        elements.append(info_table)
        elements.append(Spacer(1, 20))
        elements.append(Paragraph("BILL TO:", h_style))
        p = invoice.patient
        elements.append(Paragraph(f"{p.first_name} {p.last_name}", ParagraphStyle('PN', parent=styles['Normal'], fontSize=11, fontName='Helvetica-Bold')))
        elements.append(Paragraph(f"Phone: {p.phone}", styles['Normal']))
        elements.append(Paragraph(f"Pathology: {p.pathology}", styles['Normal']))
        elements.append(Spacer(1, 20))
        elements.append(Paragraph("SESSION DETAILS:", h_style))
        elements.append(Spacer(1, 5))
        line_data = [['Description', 'Amount']]
        treatment = invoice.session.treatment_type if invoice.session else 'Physiotherapy Session'
        line_data.append([treatment, f"${invoice.amount:.2f}"])
        if invoice.tax:
            line_data.append(['Tax', f"${invoice.tax:.2f}"])
        line_data.append(['', ''])
        line_data.append(['TOTAL', f"${invoice.total_amount:.2f}"])
        line_table = Table(line_data, colWidths=[12*cm, 4*cm])
        line_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E40AF')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.white),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,-1), 10),
            ('ALIGN', (1,0), (1,-1), 'RIGHT'),
            ('GRID', (0,0), (-1,-3), 0.5, colors.HexColor('#E5E7EB')),
            ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
            ('FONTSIZE', (0,-1), (-1,-1), 12),
            ('TEXTCOLOR', (0,-1), (-1,-1), colors.HexColor('#1E40AF')),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ]))
        elements.append(line_table)
        elements.append(Spacer(1, 30))
        elements.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#E5E7EB')))
        elements.append(Paragraph("Thank you for choosing Smart Physio Clinic", ParagraphStyle('F', parent=styles['Normal'], fontSize=9, textColor=colors.HexColor('#9CA3AF'), alignment=TA_CENTER)))
        doc.build(elements)
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="invoice_{invoice.invoice_number}.pdf"'
        return response


class PaymentReceiptListCreateView(generics.ListCreateAPIView):
    queryset = PaymentReceipt.objects.all()
    serializer_class = PaymentReceiptSerializer
    permission_classes = [permissions.IsAuthenticated]


class GenerateReceiptPDFView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, receipt_id):
        try:
            receipt = PaymentReceipt.objects.select_related('patient', 'invoice').get(id=receipt_id)
        except PaymentReceipt.DoesNotExist:
            return Response({'error': 'Receipt not found'}, status=404)
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=2*cm, rightMargin=2*cm, topMargin=2*cm, bottomMargin=2*cm)
        styles = getSampleStyleSheet()
        elements = []
        elements.append(Paragraph("SMART PHYSIO CLINIC", ParagraphStyle('T', parent=styles['Title'], fontSize=22, textColor=colors.HexColor('#059669'), spaceAfter=6)))
        elements.append(Paragraph("Payment Receipt", ParagraphStyle('S', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#6B7280'), spaceAfter=20)))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#059669')))
        elements.append(Spacer(1, 10))
        elements.append(Paragraph(f"RECEIPT #{receipt.receipt_number}", ParagraphStyle('H', parent=styles['Heading3'], fontSize=12)))
        info_data = [
            ['Date:', receipt.payment_date.strftime('%B %d, %Y')],
            ['Patient:', f"{receipt.patient.first_name} {receipt.patient.last_name}"],
            ['Amount Paid:', f"${receipt.amount:.2f}"],
            ['Payment Method:', receipt.payment_method],
        ]
        info_table = Table(info_data, colWidths=[5*cm, 10*cm])
        info_table.setStyle(TableStyle([('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'), ('FONTSIZE', (0,0), (-1,-1), 10), ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6)]))
        elements.append(info_table)
        elements.append(Spacer(1, 30))
        elements.append(Paragraph("PAID", ParagraphStyle('P', parent=styles['Normal'], fontSize=36, textColor=colors.HexColor('#059669'), alignment=TA_CENTER)))
        doc.build(elements)
        buffer.seek(0)
        response = HttpResponse(buffer, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="receipt_{receipt.receipt_number}.pdf"'
        return response
