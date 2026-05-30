import uuid
from django.db import models


class Invoice(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SENT = "sent", "Sent"
        PAID = "paid", "Paid"
        OVERDUE = "overdue", "Overdue"
        CANCELLED = "cancelled", "Cancelled"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    invoice_number = models.CharField(max_length=50, unique=True)
    patient = models.ForeignKey("patients.Patient", on_delete=models.CASCADE, related_name="invoices")
    session = models.ForeignKey(
        "treatment_sessions.PatientSession", on_delete=models.SET_NULL, null=True, blank=True, related_name="invoices"
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    issue_date = models.DateField()
    due_date = models.DateField()
    payment_date = models.DateField(null=True, blank=True)
    payment_method = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    pdf_file = models.FileField(upload_to="invoices/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-issue_date"]

    def __str__(self):
        return f"Invoice #{self.invoice_number} - {self.patient}"

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            from datetime import datetime
            count = Invoice.objects.count() + 1
            self.invoice_number = f"INV-{datetime.now().strftime('%Y%m%d')}-{count:04d}"
        self.total_amount = self.amount + self.tax
        super().save(*args, **kwargs)


class PaymentReceipt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    receipt_number = models.CharField(max_length=50, unique=True)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="receipts")
    patient = models.ForeignKey("patients.Patient", on_delete=models.CASCADE, related_name="receipts")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=50)
    payment_date = models.DateField()
    notes = models.TextField(blank=True)
    pdf_file = models.FileField(upload_to="receipts/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-payment_date"]

    def __str__(self):
        return f"Receipt #{self.receipt_number} - {self.patient}"

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            count = PaymentReceipt.objects.count() + 1
            self.receipt_number = f"RCP-{self.payment_date.strftime('%Y%m%d')}-{count:04d}"
        super().save(*args, **kwargs)
