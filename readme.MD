# Project UTS Service-to-Service Simple Online Learning Platform

Pada project ini, dikembangkan dua layanan yang saling berperan menjadi provider (menyediakan data) dan consumer (pengguna data dari layanan lain). Komunikasi antar sistem menggunakan standar HTTP protokol dengan format JSON. 

## Getting Started
Untuk instalasi lakukan
 ```bash
git clone https://github.com/itsqal/online-learning-services
 ```

 Masuk ke direktori project yang sudah diclone
 ```bash
 cd online-learning-services
 ```

 Masuk ke direktori masing-masing service dan tentukan environment variables yang dibutuhkan lalu install dependencies
 ```bash
cd course-service
touch .env
npm install
 ```

 ```bash
cd user-service
touch .env
npm install
 ```

Selanjutkan konfigurasikan environment variables berikut sesuai dengan device anda. Pastikan menggunakan dua PORT yang berbeda untuk masing-masing service dan gunakan JWT_SECRET yang sama untuk masing-masing service.

### Course Service Environment
```
PORT=
DATABASE_URL=
USER_SERVICE_URL=
JWT_SECRET=
```

### User Service Environment
```
PORT=
DATABASE_URL=
COURSE_SERVICE_URL=
JWT_SECRET=
```

## Lakukan migrasi database di masing-masing layanan
```bash
npx prisma migrate deploy
```

## 

Selanjutnya tinggal jalankan kedua service menggunakan 

```bash
npm run dev
```

Silahkan lihat dokumentasi masing-masing API untuk mencoba request masing-masing service.