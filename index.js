const express = require("express");
const { MongoClient } = require("mongodb");
const port = 3000;
const app = express();
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbname = "db_kampus";
const db = client.db(dbname);

const Mhs = db.collection("Mahasiswa");
const Dosen = db.collection("Dosen");
const Matkul = db.collection("Matkul");
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
};

const routesMhs = () => {
  app.get("/api/mhs/insert", async (req, res) => {
    return res.status(200).json({
      message: "berhasil insert 5 data mahasiswa",
    });
  });
  app.get("/api/mhs/update", async (req, res) => {
    return res.status(200).json({
      message: "berhasil update 4 data mahasiswa",
    });
  });
  app.get("/api/mhs/delete", async (req, res) => {
    return res.status(200).json({
      message: "berhasil delete 1 data mahasiswa",
    });
  });

};

//main
const main = async () => {
  try {
    connect();
    createIndexes();
    routesMhs();

    app.listen(port, () => {
      console.log(`nyambung di port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
