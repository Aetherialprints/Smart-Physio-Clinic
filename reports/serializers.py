from rest_framework import serializers
from .models import Invoice, PaymentReceipt


class InvoiceSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    class Meta:
        model = Invoice
        fields = '__all__'


class PaymentReceiptSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    class Meta:
        model = PaymentReceipt
        fields = '__all__'
