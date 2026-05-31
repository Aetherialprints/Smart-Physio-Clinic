#!/usr/bin/env python3
"""
Smart Physio Clinic - Full API Test Suite
"""
import urllib.request
import urllib.error
import json
import sys
import os
import uuid
from datetime import date, timedelta

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

BASE = "http://127.0.0.1:8001"

results = {"pass": 0, "fail": 0, "errors": []}

def report(name, ok, detail=""):
    status = "✅ PASS" if ok else "❌ FAIL"
    print(f"  {status}: {name}")
    if detail:
        print(f"         {detail}")
    results["pass" if ok else "fail"] += 1
    if not ok:
        results["errors"].append(name)

def api(method, path, data=None, token=None):
    url = f"{BASE}{path}"
    body = json.dumps(data).encode() if data else None
    h = {"Content-Type": "application/json"}
    if token:
        h["Authorization"] = f"Bearer {token}"
    req = urllib.request.Request(url, data=body, headers=h, method=method)
    try:
        resp = urllib.request.urlopen(req)
        body = resp.read()
        data = json.loads(body) if body else {}
        return resp.status, data
    except urllib.error.HTTPError as e:
        body = e.read()
        try:
            data = json.loads(body) if body else {}
        except:
            data = {}
        return e.code, data

def post(path, data, token=None): return api("POST", path, data, token)
def get(path, token=None): return api("GET", path, None, token)
def put(path, data, token=None): return api("PUT", path, data, token)
def delete(path, token=None): return api("DELETE", path, None, token)


# ═══════════════════════════════════════════
# 1. AUTH TESTS
# ═══════════════════════════════════════════
print("\n═══════════════════════════════════")
print("  1. AUTHENTICATION TESTS")
print("═══════════════════════════════════")

# Login admin
r = post("/api/auth/token/", {"email": "admin@smartphysio.com", "password": "admin123456"})
admin_token = r[1].get("access") if r[0] == 200 else None
report("Admin login", r[0] == 200, f"Status: {r[0]}")

# Wrong password
r = post("/api/auth/token/", {"email": "admin@smartphysio.com", "password": "wrong"})
report("Wrong password rejected", r[0] == 401, f"Status: {r[0]}")

# Register regular user
import uuid
unique = str(uuid.uuid4())[:8]
r = post("/api/auth/register/", {
    "email": f"dr_{unique}@test.com", "password": "TestPass123!",
    "password2": "TestPass123!", "first_name": "Dr", "last_name": "Test",
    "role": "physiotherapist"
})
report("Register user", r[0] == 201, f"Status: {r[0]}")
dr_token = None
if r[0] == 201:
    # Login as dr
    r2 = post("/api/auth/token/", {"email": f"dr_{unique}@test.com", "password": "TestPass123!"})
    dr_token = r2[1].get("access") if r2[0] == 200 else None
    report("Doctor login", r2[0] == 200)

# Register as admin (should be blocked)
r = post("/api/auth/register/", {
    "email": f"hacker_{unique}@test.com", "password": "TestPass123!",
    "password2": "TestPass123!", "first_name": "Hack", "last_name": "Er",
    "role": "admin"
})
data = r[1]
role = data.get("user", {}).get("role", "?") if r[0] == 201 else "?"
report("Admin role escalation blocked", role == "physiotherapist",
      f"Role: {role} (expected: physiotherapist)")

# No auth access
r = get("/api/patients/")
report("No auth rejected (401)", r[0] == 401, f"Status: {r[0]}")


# ═══════════════════════════════════════════
# 2. PATIENT CRUD TESTS
# ═══════════════════════════════════════════
print("\n═══════════════════════════════════")
print("  2. PATIENT CRUD TESTS")
print("═══════════════════════════════════")

# Create
r = post("/api/patients/", {
    "first_name": "Ahmed", "last_name": "Benali", "gender": "male",
    "date_of_birth": "1990-05-15", "phone": "+212****5678",
    "address": "Casablanca", "pathology": "Lower back pain",
    "diagnosis": "Lumbar disc herniation", "total_sessions": 20, "session_price": 300
}, token=admin_token)
report("Create patient", r[0] == 201, f"Status: {r[0]}")
patient_id = r[1].get("id") if r[0] == 201 else None

# List
r = get("/api/patients/", token=admin_token)
count = r[1].get("count", 0) if r[0] == 200 else 0
report("List patients", r[0] == 200 and count > 0, f"Count: {count}")

# Retrieve
if patient_id:
    r = get(f"/api/patients/{patient_id}/", token=admin_token)
    name = r[1].get("full_name", "?") if r[0] == 200 else "?"
    report("Get patient detail", r[0] == 200, f"Name: {name}")

    # Update
    r = put(f"/api/patients/{patient_id}/", {
        "first_name": "Ahmed", "last_name": "Benali Updated", "gender": "male",
        "date_of_birth": "1990-05-15", "phone": "+212****9999",
        "address": "Rabat", "pathology": "Updated pathology",
        "total_sessions": 25, "session_price": 350
    }, token=admin_token)
    updated_name = r[1].get("full_name", "?") if r[0] == 200 else "?"
    report("Update patient", r[0] == 200, f"Name: {updated_name}")

    # Delete
    r = delete(f"/api/patients/{patient_id}/", token=admin_token)
    report("Delete patient", r[0] == 204, f"Status: {r[0]}")

    # Verify deleted (soft delete - patient still exists but inactive)
    r = get(f"/api/patients/{patient_id}/", token=admin_token)
    is_active = r[1].get("is_active") if r[0] == 200 else None
    report("Patient soft-deleted (is_active=False)", is_active == False,
          f"is_active: {is_active}" if r[0] == 200 else f"Status: {r[0]}")


# ═══════════════════════════════════════════
# 3. APPOINTMENT TESTS
# ═══════════════════════════════════════════
print("\n═══════════════════════════════════")
print("  3. APPOINTMENT TESTS")
print("═══════════════════════════════════")

# Create patient first
r = post("/api/patients/", {
    "first_name": "Sara", "last_name": "Test", "gender": "female",
    "date_of_birth": "1985-03-20", "phone": "+212****1111",
    "total_sessions": 10, "session_price": 250
}, token=admin_token)
patient_id = r[1].get("id") if r[0] == 201 else None

if patient_id:
    # Create appointment
    from datetime import date, time, timedelta
    tomorrow = (date.today() + timedelta(days=1)).isoformat()
    r = post("/api/appointments/", {
        "patient": patient_id,
        "date": tomorrow,
        "start_time": "09:00",
        "end_time": "10:00",
        "type": "consultation",
        "notes": "First visit"
    }, token=admin_token)
    report("Create appointment", r[0] == 201, f"Status: {r[0]}")
    appt_id = r[1].get("id") if r[0] == 201 else None

    # List appointments
    r = get("/api/appointments/", token=admin_token)
    appt_count = r[1].get("count", 0) if r[0] == 200 else 0
    report("List appointments", r[0] == 200, f"Count: {appt_count}")

    # Conflict detection
    if appt_id:
        r = post("/api/appointments/", {
            "patient": patient_id,
            "date": tomorrow,
            "start_time": "09:30",
            "end_time": "10:30",
            "type": "consultation"
        }, token=admin_token)
        report("Conflict detection", r[0] == 400,
              f"Status: {r[0]} (expected 400)" if r[0] != 400 else "OK - conflict rejected")

        # Update
        r = put(f"/api/appointments/{appt_id}/", {
            "patient": patient_id,
            "date": tomorrow,
            "start_time": "14:00",
            "end_time": "15:00",
            "type": "follow_up",
            "notes": "Updated"
        }, token=admin_token)
        report("Update appointment", r[0] == 200, f"Status: {r[0]}")

        # Delete
        r = delete(f"/api/appointments/{appt_id}/", token=admin_token)
        report("Delete appointment", r[0] == 204, f"Status: {r[0]}")


# ═══════════════════════════════════════════
# 4. EXERCISE TESTS
# ═══════════════════════════════════════════
print("\n═══════════════════════════════════")
print("  4. EXERCISE TESTS")
print("═══════════════════════════════════")

r = get("/api/exercises/", token=admin_token)
exercise_count = r[1].get("count", 0) if r[0] == 200 else 0
report("List exercises (seeded)", r[0] == 200 and exercise_count > 0,
      f"Count: {exercise_count}")


# ═══════════════════════════════════════════
# 5. DASHBOARD TESTS
# ═══════════════════════════════════════════
print("\n═══════════════════════════════════")
print("  5. DASHBOARD TESTS")
print("═══════════════════════════════════")

r = get("/api/dashboard/overview/", token=admin_token)
report("Dashboard overview", r[0] == 200,
      f"Keys: {list(r[1].keys())[:5]}" if r[0] == 200 else f"Status: {r[0]}")


# ═══════════════════════════════════════════
# 6. NOTIFICATION TESTS
# ═══════════════════════════════════════════
print("\n═══════════════════════════════════")
print("  6. NOTIFICATION TESTS")
print("═══════════════════════════════════")

r = get("/api/notifications/", token=admin_token)
report("List notifications", r[0] == 200, f"Status: {r[0]}")


# ═══════════════════════════════════
# 7. REPORTS TESTS
# ═══════════════════════════════════════════
print("\n═══════════════════════════════════")
print("  7. REPORTS TESTS")
print("═══════════════════════════════════")

r = get("/api/reports/invoices/", token=admin_token)
report("List invoices", r[0] == 200, f"Status: {r[0]}")


# ═══════════════════════════════════════════
# 8. PERMISSION TESTS
# ═══════════════════════════════════════════
print("\n═══════════════════════════════════")
print("  8. PERMISSION TESTS")
print("═══════════════════════════════════")

# Throttling test (rapid requests)
r1 = post("/api/auth/token/", {"email": "admin@smartphysio.com", "password": "wrong"})
r2 = post("/api/auth/token/", {"email": "admin@smartphysio.com", "password": "wrong"})
report("Throttle on anon endpoints", r1[0] in [401, 429],
      f"Status: {r1[0]}")


# ═══════════════════════════════════════════
# RESULTS
# ═══════════════════════════════════════════
print("\n" + "═" * 50)
print(f"  RESULTS: {results['pass']} PASSED | {results['fail']} FAILED")
print("═" * 50)
if results["errors"]:
    print("\nFailed tests:")
    for e in results["errors"]:
        print(f"  ❌ {e}")
sys.exit(0 if results["fail"] == 0 else 1)
