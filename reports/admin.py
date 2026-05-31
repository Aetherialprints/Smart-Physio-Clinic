from django.contrib import admin
from .models import Invoice, PaymentReceipt

@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'patient', 'amount', 'status', 'issue_date']
    list_filter = ['status', 'issue_date']
    search_fields = ['invoice_number', 'patient__first_name', 'patient__last_name']

@admin.register(PaymentReceipt)
class PaymentReceiptAdmin(admin.ModelAdmin):
    list_display = ['receipt_number', 'patient', 'amount', 'payment_method', 'payment_date']
    list_filter = ['payment_method', 'payment_date']
    search_fields = ['receipt_number']
