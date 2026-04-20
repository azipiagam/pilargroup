# API Master Job Levels

Base URL: `https://pilargroup.id/api/master/job-levels`

Semua endpoint memerlukan header:
```
Authorization: Bearer <token>
```

> **GET** dapat diakses semua user yang sudah login.  
> **POST, PUT, DELETE** hanya bisa diakses oleh departemen IT.

---

## Endpoints

### GET /api/master/job-levels
Ambil semua job level, diurutkan dari level tertinggi.

**Response 200**
```json
[
  {
    "id": 1,
    "name": "Commissioner",
    "level": 7,
    "created_at": "2026-04-01 00:00:00",
    "updated_at": "2026-04-01 00:00:00"
  },
  {
    "id": 4,
    "name": "Manager",
    "level": 4,
    "created_at": "2026-04-01 00:00:00",
    "updated_at": "2026-04-01 00:00:00"
  }
]
```

---

### POST /api/master/job-levels
Tambah job level baru.

**Request Body**
```json
{
  "name": "Vice President",
  "level": 6
}
```

| Field | Type | Required | Keterangan |
|---|---|---|---|
| name | string | ✅ | Nama job level, max 100 karakter |
| level | integer | ✅ | Angka level, min 1. Semakin tinggi = semakin senior |

**Response 201**
```json
{
  "message": "Job level created successfully",
  "id": 12
}
```

**Response 422** — nama sudah ada
```json
{
  "message": "Job level already exists"
}
```

---

### PUT /api/master/job-levels/{id}
Update job level. Semua field opsional — kirim hanya field yang ingin diubah.

**Request Body**
```json
{
  "name": "VP of Engineering",
  "level": 6
}
```

| Field | Type | Required | Keterangan |
|---|---|---|---|
| name | string | ❌ | Nama baru job level |
| level | integer | ❌ | Level baru, min 1 |

**Response 200**
```json
{
  "message": "Job level updated successfully"
}
```

**Response 404** — job level tidak ditemukan
```json
{
  "message": "Job level not found"
}
```

**Response 422** — nama sudah dipakai job level lain
```json
{
  "message": "Job level name already exists"
}
```

---

### DELETE /api/master/job-levels/{id}
Hapus job level. Tidak bisa dihapus jika masih digunakan oleh user.

**Response 200**
```json
{
  "message": "Job level deleted successfully"
}
```

**Response 404** — job level tidak ditemukan
```json
{
  "message": "Job level not found"
}
```

**Response 422** — job level masih dipakai user
```json
{
  "message": "Job level masih digunakan oleh user, tidak bisa dihapus"
}
```

---

## Catatan untuk FE

- Field `level` adalah angka integer yang merepresentasikan senioritas. Tampilkan sebagai angka atau bisa dijadikan indikator visual (badge, warna, dsb).
- Saat render dropdown job level di form user, gunakan `GET /api/master/job-levels` dan kirim `id`-nya sebagai `job_level_id`.
- Sebelum delete, sebaiknya tampilkan konfirmasi. Jika response 422, tampilkan pesan bahwa job level masih digunakan.