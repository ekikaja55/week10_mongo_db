const { faker } = require("@faker-js/faker");
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const port = 3000;
const app = express();
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbname = "db_kampus";
const db = client.db(dbname);

const Mhs = db.collection("Mahasiswa");
const Dosen = db.collection("Dosen");
const Matkul = db.collection("MataKuliah");
const Pengumuman = db.collection("Pengumuman");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const createIndexes = async () => {
  await Mhs.createIndex({ nrp: 1 }, { unique: true });
  await Dosen.createIndex({ nid: 1 }, { unique: true });
  await Matkul.createIndex({ kode: 1 }, { unique: true });
  await Pengumuman.createIndex({ kode: 1 }, { unique: true });
  console.log("berhasil bikin index ke mongo db semoga");
};

const connect = async () => {
  await client.connect(dbname);
  console.log("berhasil connect ke mongo db semoga");
  createIndexes();
};

const routesMhs = () => {
  app.get("/api/mhs/insert", async (req, res) => {
    let nrp = 225011701;
    const dataMhs = [];
    const prodi = [
      "S1 Desain Komunikasi Visual",
      "S1 Informatika",
      "S1 Sistem Informasi Bisnis",
      "D3 Sistem Informasi",
    ];

    await Mhs.deleteMany({});
    console.log("\nhapus isi document berhasil\n");

    for (let i = 0; i < 5; i++) {
      const namaMhs = `${faker.person.firstName()} ${faker.person.lastName()}`;
      dataMhs.push({
        _id: new ObjectId(),
        nrp: nrp + i,
        nama: namaMhs,
        email: `${namaMhs.split(" ")[0].toLocaleLowerCase()}.a25@istts.ac.id`,
        nomor_telepon: `628${faker.number.int({ max: 10000000000, min: 1 })}`,
        alamat: faker.location.streetAddress(true),
        jumlah_sks: `${faker.number.int({ max: 24, min: 1 })}`,
        prodi: prodi[Math.floor(Math.random() * prodi.length)],
        status: Math.floor(Math.random() * 2) ? "aktif" : "tidak aktif",
      });
    }

    await Mhs.insertMany(dataMhs);
    return res.status(200).json({
      message: "Berhasil Insert 5 Data Mahasiswa",
      result: dataMhs,
    });
  });

  //update 4 mahasiswa
  app.get("/api/mhs/update", async (req, res) => {
    const result = [];
    const dataNrp = await Mhs.find(
      {},
      { projection: { nrp: 1, nama: 1, _id: 0 } }
    )
      .limit(4)
      .toArray();

    for (let i = 0; i < dataNrp.length; i++) {
      let namaBaru = `${dataNrp[i].nama}1${1 + i}`;
      await Mhs.findOneAndUpdate(
        { nrp: dataNrp[i].nrp },
        {
          $set: {
            nama: namaBaru,
          },
          $currentDate: { lastModified: true },
        }
      );
      result.push(`${dataNrp[i].nama} -> ${namaBaru}`);
    }

    return res.status(200).json({
      message: "Berhasil Update Nama 4 Data Mahasiswa",
      result: result,
    });
  });

  //delete 1 mhs berdasarkan nrp
  app.get("/api/mhs/delete", async (req, res) => {
    const nrp = 225011701;
    const result = await Mhs.findOneAndDelete({ nrp: nrp });
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: `nrp ${nrp} tidak ditemukan` });
    }
    return res.status(200).json({
      message: `berhasil delete 1 data mahasiswa dengan nrp ${nrp}`,
    });
  });
};

const routesDosen = () => {
  app.get("/api/dosen/insert", async (req, res) => {
    let nid = 125011701;
    const dataDosen = [];

    await Dosen.deleteMany({});
    console.log("\nhapus isi document berhasil\n");

    for (let i = 0; i < 5; i++) {
      const namaDosen = `${faker.person.firstName()} ${faker.person.lastName()}`;
      dataDosen.push({
        _id: new ObjectId(),
        nid: nid + i,
        nama: namaDosen,
        email: `${namaDosen.split(" ")[0].toLocaleLowerCase()}.d25@istts.ac.id`,
        nomor_telepon: `628${faker.number.int({ max: 10000000000, min: 1 })}`,
        status: Math.floor(Math.random() * 2) ? "aktif" : "tidak aktif",
      });
    }

    await Dosen.insertMany(dataDosen);
    return res.status(200).json({
      message: "Berhasil Insert 5 Data Dosen",
      result: dataDosen,
    });
  });

  //update 4 dosen
  app.get("/api/dosen/update", async (req, res) => {
    const result = [];
    const dataNid = await Dosen.find(
      {},
      { projection: { nid: 1, nama: 1, _id: 0 } }
    )
      .limit(4)
      .toArray();

    for (let i = 0; i < dataNid.length; i++) {
      let namaBaru = `${dataNid[i].nama}1${1 + i}`;
      await Dosen.findOneAndUpdate(
        { nid: dataNid[i].nid },
        {
          $set: {
            nama: namaBaru,
          },
          $currentDate: { lastModified: true },
        }
      );
      result.push(`${dataNid[i].nama} -> ${namaBaru}`);
    }

    return res.status(200).json({
      message: "Berhasil Update Nama 4 Data Dosen",
      result: result,
    });
  });

  //delete 1 dosen berdasarkan nrp
  app.get("/api/dosen/delete", async (req, res) => {
    const nid = 125011701;
    const result = await Dosen.findOneAndDelete({ nid: nid });
    console.log(result);
    if (!result) {
      return res.status(404).json({ message: `nid ${nid} tidak ditemukan` });
    }
    return res.status(200).json({
      message: `berhasil delete 1 data dosen dengan nid ${nid}`,
    });
  });
};

const routesMatkul = () => {
  app.get("/api/matkul/insert", async (req, res) => {
    const dataMatkul = [];
    const matkul = [
      "Algoritma dan Pemrograman",
      "Manajemen Proyek TI",
      "Basis Data",
      "UI/UX Design",
      "Branding dan Identitas Visual",
    ];

    await Matkul.deleteMany({});
    console.log("\nhapus isi document berhasil\n");

    for (let i = 0; i < 5; i++) {
      dataMatkul.push({
        _id: new ObjectId(),
        kode: 1 + i,
        nama: matkul[Math.floor(Math.random() * matkul.length)],
        sks: Number(`${faker.number.int({ max: 24, min: 1 })}`),
      });
    }

    await Matkul.insertMany(dataMatkul);
    return res.status(200).json({
      message: "Berhasil Insert 5 Data Matkul",
      result: dataMatkul,
    });
  });

  //update 4 matkul
  app.get("/api/matkul/update", async (req, res) => {
    const result = [];
    const dataMatkul = await Matkul.find(
      { sks: { $lt: 24 } },
      { projection: { kode: 1, nama: 1, sks: 1, _id: 0 } }
    )
      .limit(4)
      .toArray();

    console.log(dataMatkul);

    for (let i = 0; i < dataMatkul.length; i++) {
      let sksBaru = dataMatkul[i].sks + 1;
      await Matkul.findOneAndUpdate(
        { kode: dataMatkul[i].kode },
        {
          $set: {
            sks: sksBaru,
          },
          $currentDate: { lastModified: true },
        }
      );
      result.push(
        `sks matkul ${dataMatkul[i].nama} : ${dataMatkul[i].sks} -> ${sksBaru}`
      );
    }

    return res.status(200).json({
      message: "Berhasil Update 4 SKS Mata Kuliah",
      result: result,
    });
  });

  //delete 1 matkul berdasarkan kode
  app.get("/api/matkul/delete", async (req, res) => {
    const kode = 1;
    const result = await Matkul.findOneAndDelete({ kode: kode });
    console.log(result);
    if (!result) {
      return res
        .status(404)
        .json({ message: `matkul dengan kode ${kode} tidak ditemukan` });
    }
    return res.status(200).json({
      message: `berhasil delete 1 data matkul dengan kode ${kode}`,
    });
  });
};

//main
const main = async () => {
  try {
    connect();
    routesMhs();
    routesDosen();
    routesMatkul();

    app.listen(port, () => {
      console.log(`nyambung di port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
