# Admin registrations for remaining apps
from django.contrib import admin
from appointments.models import Appointment
from sessions.models import PatientSession
from reports.models import Invoice, PaymentReceipt
from notifications.models import Notification

admin.site.register(Appointment)
admin.site.register(PatientSession)
admin.site.register(Invoice)
admin.site.register(PaymentReceipt)
admin.site.register(Notification)
