from django.urls import path
from . import views

urlpatterns = [
    path("invoices/", views.InvoiceListCreateView.as_view(), name="invoice-list-create"),
    path("invoices/<uuid:pk>/", views.InvoiceDetailView.as_view(), name="invoice-detail"),
    path("invoices/<uuid:invoice_id>/pdf/", views.GenerateInvoicePDFView.as_view(), name="invoice-pdf"),
    path("receipts/", views.PaymentReceiptListCreateView.as_view(), name="receipt-list-create"),
    path("receipts/<uuid:receipt_id>/pdf/", views.GenerateReceiptPDFView.as_view(), name="receipt-pdf"),
]
