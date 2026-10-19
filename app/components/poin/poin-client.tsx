"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Check,
  Coins,
  Copy,
  Eye,
  EyeOff,
  Gift,
  History,
  KeyRound,
  Loader2,
  LogOut,
  RefreshCw,
  Ticket,
  UserPlus,
} from "lucide-react";
import { poinCopy } from "../../data/poin";
import {
  ambilPoinSaya,
  bacaTokenAnggota,
  daftarAnggotaSendiri,
  formatPoin,
  formatTanggal,
  formatWaktu,
  gantiPinAnggota,
  hapusTokenAnggota,
  masukAnggota,
  pesanGalat,
  rapikanNomor,
  sandiValid,
  simpanTokenAnggota,
  tukarHadiah,
  waValid,
  type Hadiah,
  type Kupon,
  type PoinSaya,
} from "../../lib/poin";

type Tab = "tukar" | "kupon" | "riwayat";

const INPUT =
  "w-full rounded-md border border-ink/50 bg-white px-4 py-3 text-sm text-ink transition-colors duration-150 placeholder:text-ink/65 focus:border-sambal-700 focus:ring-1 focus:ring-sambal-700 focus:outline-none disabled:opacity-60";
const TOMBOL =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-sambal-700 px-5 py-3 text-sm font-bold text-paper transition-colors duration-150 hover:bg-sambal-800 active:bg-sambal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 disabled:cursor-not-allowed disabled:opacity-50";
const TOMBOL_KEDUA =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-ink/50 bg-white px-4 py-2.5 text-sm font-bold text-ink/80 transition-colors duration-150 hover:border-sambal-600 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 disabled:cursor-not-allowed disabled:opacity-50";

export default function PoinClient() {
  const [sesi, setSesi] = useState<string | null>(null);
  const [data, setData] = useState<PoinSaya | null>(null);
  const [galat, setGalat] = useState("");

  // Form masuk / daftar
  const [mode, setMode] = useState<"masuk" | "daftar">("masuk");
  const [nomor, setNomor] = useState("");
  const [pin, setPin] = useState("");
  const [lihatPin, setLihatPin] = useState(false);
  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [sandi, setSandi] = useState("");
  const [sandiUlang, setSandiUlang] = useState("");
  const [nomorBaru, setNomorBaru] = useState("");
  const [sibuk, setSibuk] = useState(false);

  // Isi dashboard
  const [tab, setTab] = useState<Tab>("tukar");
  const [konfirmasi, setKonfirmasi] = useState<Hadiah | null>(null);
  const [kuponBaru, setKuponBaru] = useState<Kupon | null>(null);
  const [salinKode, setSalinKode] = useState("");

  // Ganti PIN
  const [gantiPinBuka, setGantiPinBuka] = useState(false);
  const [pinLama, setPinLama] = useState("");
  const [pinBaru, setPinBaru] = useState("");
  const [pinUlang, setPinUlang] = useState("");
  const [pesanPin, setPesanPin] = useState("");
  const [galatPin, setGalatPin] = useState("");

  // Pulihkan sesi yang tersimpan di browser ini.
  // (Halaman tetap tampil walau tanpa JavaScript — formulir login
  //  sudah ada di HTML pertama; sesi hanya menggantinya setelah ada.)
  useEffect(() => {
    (async () => {
      const token = bacaTokenAnggota();
      if (!token) return;
      try {
        const hasil = await ambilPoinSaya(token);
        setSesi(token);
        setData(hasil);
      } catch {
        hapusTokenAnggota();
      }
    })();
  }, []);

  const tanganiGalat = useCallback((err: unknown) => {
    const pesan = pesanGalat(err);
    if (err instanceof Error && err.message === "sesi") {
      hapusTokenAnggota();
      setSesi(null);
      setData(null);
    }
    setGalat(pesan);
  }, []);

  const muatData = useCallback(
    async (token: string) => {
      const hasil = await ambilPoinSaya(token);
      setData(hasil);
      return hasil;
    },
    []
  );

  async function kirimMasuk(e: FormEvent) {
    e.preventDefault();
    setGalat("");
    if (!sandiValid(pin)) {
      setGalat(poinCopy.login.sandiPendek);
      return;
    }
    setSibuk(true);
    try {
      const hasil = await masukAnggota(rapikanNomor(nomor), pin);
      simpanTokenAnggota(hasil.token);
      setSesi(hasil.token);
      setPin("");
      setNomorBaru("");
      setTab("tukar");
      try {
        await muatData(hasil.token);
      } catch (err) {
        // Login berhasil — kartu tetap tampil, data bisa disegarkan.
        setData({
          anggota: hasil.anggota,
          hadiah: [],
          kupon: [],
          riwayat: [],
        });
        setGalat(pesanGalat(err));
      }
    } catch (err) {
      setGalat(pesanGalat(err));
    } finally {
      setSibuk(false);
    }
  }

  async function kirimDaftar(e: FormEvent) {
    e.preventDefault();
    setGalat("");
    const namaBersih = nama.replace(/\s+/g, " ").trim();
    if (namaBersih.length < 2) {
      setGalat(poinCopy.daftar.namaPendek);
      return;
    }
    if (!waValid(wa)) {
      setGalat(poinCopy.daftar.waSalah);
      return;
    }
    if (!sandiValid(sandi)) {
      setGalat(poinCopy.daftar.sandiPendek);
      return;
    }
    if (sandi !== sandiUlang) {
      setGalat(poinCopy.daftar.bedaSandi);
      return;
    }
    setSibuk(true);
    try {
      const hasil = await daftarAnggotaSendiri(namaBersih, wa, sandi);
      simpanTokenAnggota(hasil.token);
      setSesi(hasil.token);
      setNomorBaru(hasil.anggota.nomor);
      setNama("");
      setWa("");
      setSandi("");
      setSandiUlang("");
      setTab("tukar");
      try {
        await muatData(hasil.token);
      } catch (err) {
        // Kartu tetap bisa dipakai; data lain menyusul saat disegarkan.
        setData({
          anggota: hasil.anggota,
          hadiah: [],
          kupon: [],
          riwayat: [],
        });
        setGalat(pesanGalat(err));
      }
    } catch (err) {
      // Backend lama belum punya aksi "poinDaftar" dan menjawab
      // "rating tidak valid" — beri pesan yang lebih jelas.
      setGalat(
        err instanceof Error && err.message === "rating tidak valid"
          ? poinCopy.daftar.belumAktif
          : pesanGalat(err)
      );
    } finally {
      setSibuk(false);
    }
  }

  async function segarkan() {
    if (!sesi) return;
    setSibuk(true);
    setGalat("");
    try {
      await muatData(sesi);
    } catch (err) {
      tanganiGalat(err);
    } finally {
      setSibuk(false);
    }
  }

  async function lakukanTukar(h: Hadiah) {
    if (!sesi) return;
    setSibuk(true);
    setGalat("");
    try {
      const hasil = await tukarHadiah(sesi, h.nama);
      setKuponBaru(hasil.kupon);
      setKonfirmasi(null);
      setTab("kupon");
      await muatData(sesi);
    } catch (err) {
      tanganiGalat(err);
    } finally {
      setSibuk(false);
    }
  }

  async function simpanPin(e: FormEvent) {
    e.preventDefault();
    if (!sesi) return;
    setGalatPin("");
    setPesanPin("");
    if (!sandiValid(pinBaru)) {
      setGalatPin(poinCopy.gantiPin.format);
      return;
    }
    if (pinBaru !== pinUlang) {
      setGalatPin(poinCopy.gantiPin.beda);
      return;
    }
    setSibuk(true);
    try {
      await gantiPinAnggota(sesi, pinLama, pinBaru);
      setPesanPin(poinCopy.gantiPin.berhasil);
      setPinLama("");
      setPinBaru("");
      setPinUlang("");
    } catch (err) {
      setGalatPin(pesanGalat(err));
    } finally {
      setSibuk(false);
    }
  }

  function keluar() {
    hapusTokenAnggota();
    setSesi(null);
    setData(null);
    setGalat("");
    setKuponBaru(null);
    setKonfirmasi(null);
    setGantiPinBuka(false);
    setPin("");
    setNomor("");
    setNama("");
    setWa("");
    setSandi("");
    setSandiUlang("");
    setNomorBaru("");
    setMode("masuk");
    setLihatPin(false);
    setTab("tukar");
  }

  async function salin(teks: string) {
    try {
      await navigator.clipboard.writeText(teks);
      setSalinKode(teks);
      window.setTimeout(() => setSalinKode(""), 2000);
    } catch {
      /* clipboard kadang diblokir browser — abaikan */
    }
  }

  return (
    <section className="bg-paper pt-28 pb-20 md:pt-36 md:pb-24">
      <div className="mx-auto max-w-6xl px-6">
        {!sesi ? (
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
            {/* Penjelasan singkat */}
            <div>
              <p className="mb-4 font-display text-sm uppercase tracking-[0.22em] text-sambal-700">
                {poinCopy.kicker}
              </p>
              <h1 className="max-w-xl font-display text-4xl leading-tight md:text-5xl">
                {poinCopy.heading}
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink/70 md:text-base">
                {poinCopy.subheading}
              </p>

              <ol className="mt-8 border-y border-ink/10">
                {poinCopy.cara.map((item, index) => (
                  <li
                    key={item.judul}
                    className="flex gap-4 border-b border-ink/10 py-4 last:border-b-0"
                  >
                    <span
                      className="w-8 shrink-0 pt-0.5 font-display text-lg leading-none text-gold-800"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-bold">{item.judul}</p>
                      <p className="mt-1 max-w-md text-xs leading-relaxed text-ink/65">
                        {item.isi}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link
                href="/"
                className="mt-8 inline-flex items-center gap-2 rounded-sm text-sm font-bold text-ink/65 transition-colors duration-150 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sambal-700"
              >
                ← {poinCopy.tombol.kembali}
              </Link>
            </div>

            {/* Masuk / daftar */}
            <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm md:p-8">
              <div
                role="tablist"
                aria-label={poinCopy.mode.aria}
                className="grid grid-cols-2 gap-1 rounded-lg bg-cream/70 p-1"
              >
                {(
                  [
                    ["masuk", poinCopy.mode.masuk],
                    ["daftar", poinCopy.mode.daftar],
                  ] as const
                ).map(([id, label]) => {
                  const aktif = mode === id;
                  return (
                    <button
                      key={id}
                      id={`poin-tab-${id}`}
                      type="button"
                      role="tab"
                      aria-selected={aktif}
                      aria-controls="poin-panel"
                      onClick={() => {
                        setMode(id);
                        setGalat("");
                        setLihatPin(false);
                      }}
                      className={`cursor-pointer rounded-md px-3 py-2 text-sm font-bold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 ${
                        aktif
                          ? "bg-white text-sambal-700 shadow-sm"
                          : "text-ink/65 hover:text-ink"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <div
                id="poin-panel"
                role="tabpanel"
                aria-labelledby={`poin-tab-${mode}`}
              >
                <span className="mt-5 grid h-12 w-12 place-items-center rounded-lg bg-sambal-50 text-sambal-700">
                  {mode === "masuk" ? (
                    <Coins className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <UserPlus className="h-6 w-6" aria-hidden="true" />
                  )}
                </span>
                <h2 className="mt-4 font-display text-2xl">
                  {mode === "masuk"
                    ? poinCopy.login.judul
                    : poinCopy.daftar.judul}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">
                  {mode === "masuk"
                    ? poinCopy.login.keterangan
                    : poinCopy.daftar.keterangan}
                </p>

                {mode === "masuk" ? (
                  <>
                    <form className="mt-6 space-y-4" onSubmit={kirimMasuk}>
                      <div>
                        <label
                          htmlFor="poin-nomor"
                          className="mb-1.5 block text-sm font-bold"
                        >
                          {poinCopy.login.nomorLabel}
                        </label>
                        <input
                          id="poin-nomor"
                          className={INPUT}
                          value={nomor}
                          onChange={(e) => {
                            setNomor(e.target.value);
                            setGalat("");
                          }}
                          placeholder={poinCopy.login.nomorPlaceholder}
                          autoComplete="username"
                          autoCapitalize="none"
                          spellCheck={false}
                          required
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="poin-pin"
                          className="mb-1.5 block text-sm font-bold"
                        >
                          {poinCopy.login.pinLabel}
                        </label>
                        <div className="relative">
                          <input
                            id="poin-pin"
                            className={`${INPUT} pr-12`}
                            value={pin}
                            onChange={(e) => {
                              setPin(
                                e.target.value.replace(/\s/g, "").slice(0, 20)
                              );
                              setGalat("");
                            }}
                            placeholder={poinCopy.login.pinPlaceholder}
                            type={lihatPin ? "text" : "password"}
                            autoComplete="current-password"
                            maxLength={20}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setLihatPin((b) => !b)}
                            className="absolute inset-y-0 right-1 my-auto grid h-9 w-9 cursor-pointer place-items-center rounded-md text-ink/65 transition-colors duration-150 hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
                            aria-label={
                              lihatPin
                                ? poinCopy.login.sembunyikan
                                : poinCopy.login.lihat
                            }
                          >
                            {lihatPin ? (
                              <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>

                      {galat && (
                        <p
                          role="alert"
                          className="rounded-md border border-sambal-600/25 bg-sambal-50 px-3 py-2 text-sm text-sambal-800"
                        >
                          {galat}
                        </p>
                      )}

                      <button
                        type="submit"
                        className={`${TOMBOL} w-full`}
                        disabled={sibuk}
                      >
                        {sibuk ? (
                          <>
                            <Loader2
                              className="h-4 w-4 animate-spin"
                              aria-hidden="true"
                            />
                            {poinCopy.login.sibuk}
                          </>
                        ) : (
                          poinCopy.login.tombol
                        )}
                      </button>
                    </form>

                    <div className="mt-6 rounded-lg bg-cream/60 p-4">
                      <p className="text-sm font-bold">
                        {poinCopy.login.belumPunya}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-ink/65">
                        {poinCopy.login.belumPunyaIsi}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("daftar");
                          setGalat("");
                          setLihatPin(false);
                        }}
                        className={`${TOMBOL_KEDUA} mt-3`}
                      >
                        <UserPlus className="h-4 w-4" aria-hidden="true" />
                        {poinCopy.login.keDaftar}
                      </button>
                    </div>
                  </>
                ) : (
                  <form className="mt-6 space-y-4" onSubmit={kirimDaftar}>
                    <div>
                      <label
                        htmlFor="daftar-nama"
                        className="mb-1.5 block text-sm font-bold"
                      >
                        {poinCopy.daftar.namaLabel}
                      </label>
                      <input
                        id="daftar-nama"
                        className={INPUT}
                        value={nama}
                        onChange={(e) => {
                          setNama(e.target.value);
                          setGalat("");
                        }}
                        placeholder={poinCopy.daftar.namaPlaceholder}
                        autoComplete="name"
                        maxLength={60}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="daftar-wa"
                        className="mb-1.5 block text-sm font-bold"
                      >
                        {poinCopy.daftar.waLabel}
                      </label>
                      <input
                        id="daftar-wa"
                        className={INPUT}
                        value={wa}
                        onChange={(e) => {
                          setWa(e.target.value.slice(0, 20));
                          setGalat("");
                        }}
                        placeholder={poinCopy.daftar.waPlaceholder}
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={20}
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="daftar-sandi"
                        className="mb-1.5 block text-sm font-bold"
                      >
                        {poinCopy.daftar.sandiLabel}
                      </label>
                      <div className="relative">
                        <input
                          id="daftar-sandi"
                          className={`${INPUT} pr-12`}
                          value={sandi}
                          onChange={(e) => {
                            setSandi(
                              e.target.value.replace(/\s/g, "").slice(0, 20)
                            );
                            setGalat("");
                          }}
                          placeholder={poinCopy.daftar.sandiPlaceholder}
                          type={lihatPin ? "text" : "password"}
                          autoComplete="new-password"
                          maxLength={20}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setLihatPin((b) => !b)}
                          className="absolute inset-y-0 right-1 my-auto grid h-9 w-9 cursor-pointer place-items-center rounded-md text-ink/65 transition-colors duration-150 hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
                          aria-label={
                            lihatPin
                              ? poinCopy.daftar.sembunyikan
                              : poinCopy.daftar.lihat
                          }
                        >
                          {lihatPin ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="daftar-ulang"
                        className="mb-1.5 block text-sm font-bold"
                      >
                        {poinCopy.daftar.ulangLabel}
                      </label>
                      <input
                        id="daftar-ulang"
                        className={INPUT}
                        value={sandiUlang}
                        onChange={(e) => {
                          setSandiUlang(
                            e.target.value.replace(/\s/g, "").slice(0, 20)
                          );
                          setGalat("");
                        }}
                        placeholder={poinCopy.daftar.ulangPlaceholder}
                        type={lihatPin ? "text" : "password"}
                        autoComplete="new-password"
                        maxLength={20}
                        required
                      />
                    </div>

                    <p className="text-xs leading-relaxed text-ink/65">
                      {poinCopy.daftar.catatan}
                    </p>

                    {galat && (
                      <p
                        role="alert"
                        className="rounded-md border border-sambal-600/25 bg-sambal-50 px-3 py-2 text-sm text-sambal-800"
                      >
                        {galat}
                      </p>
                    )}

                    <button
                      type="submit"
                      className={`${TOMBOL} w-full`}
                      disabled={sibuk}
                    >
                      {sibuk ? (
                        <>
                          <Loader2
                            className="h-4 w-4 animate-spin"
                            aria-hidden="true"
                          />
                          {poinCopy.daftar.sibuk}
                        </>
                      ) : (
                        poinCopy.daftar.tombol
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : !data ? (
          <div className="mx-auto max-w-md rounded-lg border border-ink/10 bg-white p-8 text-center">
            <Loader2
              className="mx-auto h-6 w-6 animate-spin text-sambal-700"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-ink/65">{poinCopy.memuat}</p>
            {galat && (
              <p role="alert" className="mt-3 text-sm text-sambal-700">
                {galat}
              </p>
            )}
            <button
              type="button"
              onClick={segarkan}
              className={`${TOMBOL_KEDUA} mt-4`}
              disabled={sibuk}
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {poinCopy.tombol.segarkan}
            </button>
          </div>
        ) : (
          <Dashboard
            data={data}
            nomorBaru={nomorBaru}
            setNomorBaru={setNomorBaru}
            tab={tab}
            setTab={setTab}
            sibuk={sibuk}
            galat={galat}
            konfirmasi={konfirmasi}
            setKonfirmasi={setKonfirmasi}
            kuponBaru={kuponBaru}
            setKuponBaru={setKuponBaru}
            salinKode={salinKode}
            onSalin={salin}
            onTukar={lakukanTukar}
            onSegarkan={segarkan}
            onKeluar={keluar}
            gantiPinBuka={gantiPinBuka}
            setGantiPinBuka={setGantiPinBuka}
            pinLama={pinLama}
            setPinLama={setPinLama}
            pinBaru={pinBaru}
            setPinBaru={setPinBaru}
            pinUlang={pinUlang}
            setPinUlang={setPinUlang}
            pesanPin={pesanPin}
            galatPin={galatPin}
            onSimpanPin={simpanPin}
            setPesanPin={setPesanPin}
            setGalatPin={setGalatPin}
          />
        )}

      </div>
    </section>
  );
}

interface DashboardProps {
  data: PoinSaya;
  nomorBaru: string;
  setNomorBaru: (s: string) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  sibuk: boolean;
  galat: string;
  konfirmasi: Hadiah | null;
  setKonfirmasi: (h: Hadiah | null) => void;
  kuponBaru: Kupon | null;
  setKuponBaru: (k: Kupon | null) => void;
  salinKode: string;
  onSalin: (teks: string) => void;
  onTukar: (h: Hadiah) => void;
  onSegarkan: () => void;
  onKeluar: () => void;
  gantiPinBuka: boolean;
  setGantiPinBuka: (b: boolean) => void;
  pinLama: string;
  setPinLama: (s: string) => void;
  pinBaru: string;
  setPinBaru: (s: string) => void;
  pinUlang: string;
  setPinUlang: (s: string) => void;
  pesanPin: string;
  galatPin: string;
  onSimpanPin: (e: FormEvent) => void;
  setPesanPin: (s: string) => void;
  setGalatPin: (s: string) => void;
}

function Dashboard({
  data,
  nomorBaru,
  setNomorBaru,
  tab,
  setTab,
  sibuk,
  galat,
  konfirmasi,
  setKonfirmasi,
  kuponBaru,
  setKuponBaru,
  salinKode,
  onSalin,
  onTukar,
  onSegarkan,
  onKeluar,
  gantiPinBuka,
  setGantiPinBuka,
  pinLama,
  setPinLama,
  pinBaru,
  setPinBaru,
  pinUlang,
  setPinUlang,
  pesanPin,
  galatPin,
  onSimpanPin,
  setPesanPin,
  setGalatPin,
}: DashboardProps) {
  const kuponAktif = data.kupon.filter((k) => k.status === "aktif");
  const kuponLain = data.kupon.filter((k) => k.status !== "aktif");

  const tabTombol: { id: Tab; label: string; ikon: typeof Gift }[] = [
    { id: "tukar", label: poinCopy.tab.tukar, ikon: Gift },
    { id: "kupon", label: poinCopy.tab.kupon, ikon: Ticket },
    { id: "riwayat", label: poinCopy.tab.riwayat, ikon: History },
  ];

  return (
    <div>
      {/* Bar atas */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="rounded-sm text-sm font-bold text-ink/65 transition-colors duration-150 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sambal-700"
        >
          ← {poinCopy.tombol.kembali}
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSegarkan}
            disabled={sibuk}
            className={TOMBOL_KEDUA}
          >
            <RefreshCw
              className={`h-4 w-4 ${sibuk ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {poinCopy.tombol.segarkan}
          </button>
          <button type="button" onClick={onKeluar} className={TOMBOL_KEDUA}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            {poinCopy.tombol.keluar}
          </button>
        </div>
      </div>

      {galat && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-sambal-600/25 bg-sambal-50 px-4 py-3 text-sm text-sambal-800"
        >
          {galat}
        </p>
      )}

      {nomorBaru && (
        <div className="mt-4 rounded-lg border border-gold-400 bg-gold-100/60 p-4">
          <div className="flex items-start justify-between gap-3">
            <div role="status">
              <p className="text-sm font-bold text-gold-800">
                {poinCopy.daftar.berhasil}
              </p>
              <p className="mt-1 text-sm text-ink/80">
                {poinCopy.daftar.nomorBaru}:{" "}
                <span className="font-mono font-bold tracking-wider">
                  {nomorBaru}
                </span>
              </p>
              <p className="mt-1 text-xs leading-relaxed text-ink/65">
                {poinCopy.daftar.simpanNomor}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setNomorBaru("")}
              className="cursor-pointer rounded-sm px-2 text-lg leading-none text-ink/65 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
              aria-label="Tutup pemberitahuan"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        {/* Kartu anggota */}
        <div>
          <div className="rounded-lg bg-ink p-6 text-paper shadow-sm md:p-8">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.28em] text-gold-300">
                {poinCopy.kartu.label}
              </p>
              <p className="mt-3 font-display text-2xl leading-tight">
                {data.anggota.nama}
              </p>
              <p className="mt-1 font-mono text-sm tracking-wider text-paper/55">
                {data.anggota.nomor}
              </p>

              <div className="mt-8 flex items-end gap-2">
                <span className="font-display text-5xl leading-none text-gold-300 md:text-6xl">
                  {formatPoin(data.anggota.poin)}
                </span>
                <span className="pb-1 text-sm text-paper/65">
                  {poinCopy.kartu.poinLabel}
                </span>
              </div>

              {data.anggota.sejak && (
                <p className="mt-5 text-xs text-paper/60">
                  {poinCopy.kartu.sejak} {formatTanggal(data.anggota.sejak)}
                </p>
              )}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-ink/10 bg-white p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink/65">
                <Ticket className="h-4 w-4" aria-hidden="true" />
                {poinCopy.kartu.kuponAktif}
              </p>
              <p className="mt-1 font-display text-2xl">
                {kuponAktif.length}
              </p>
            </div>
            <div className="rounded-lg border border-ink/10 bg-white p-4">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-ink/65">
                <Gift className="h-4 w-4" aria-hidden="true" />
                {poinCopy.kartu.hadiahTersedia}
              </p>
              <p className="mt-1 font-display text-2xl">
                {formatPoin(data.hadiah.length)}
              </p>
            </div>
          </div>

          {/* Ganti PIN */}
          <div className="mt-6 rounded-lg border border-ink/10 bg-white">
            <button
              type="button"
              onClick={() => {
                setGantiPinBuka(!gantiPinBuka);
                setPesanPin("");
                setGalatPin("");
              }}
              className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left text-sm font-bold transition-colors duration-150 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
              aria-expanded={gantiPinBuka}
            >
              <span className="inline-flex items-center gap-2">
                <KeyRound className="h-4 w-4" aria-hidden="true" />
                {poinCopy.gantiPin.tombol}
              </span>
              <span aria-hidden="true">{gantiPinBuka ? "−" : "+"}</span>
            </button>

            {gantiPinBuka && (
              <form
                className="space-y-3 border-t border-ink/10 px-4 py-4"
                onSubmit={onSimpanPin}
              >
                <p className="text-xs leading-relaxed text-ink/65">
                  {poinCopy.gantiPin.keterangan}
                </p>
                <input
                  className={INPUT}
                  type="password"
                  autoComplete="current-password"
                  maxLength={20}
                  placeholder={poinCopy.gantiPin.lamaLabel}
                  aria-label={poinCopy.gantiPin.lamaLabel}
                  value={pinLama}
                  onChange={(e) =>
                    setPinLama(e.target.value.replace(/\s/g, "").slice(0, 20))
                  }
                  required
                />
                <input
                  className={INPUT}
                  type="password"
                  autoComplete="new-password"
                  maxLength={20}
                  placeholder={poinCopy.gantiPin.baruLabel}
                  aria-label={poinCopy.gantiPin.baruLabel}
                  value={pinBaru}
                  onChange={(e) =>
                    setPinBaru(e.target.value.replace(/\s/g, "").slice(0, 20))
                  }
                  required
                />
                <input
                  className={INPUT}
                  type="password"
                  autoComplete="new-password"
                  maxLength={20}
                  placeholder={poinCopy.gantiPin.ulangLabel}
                  aria-label={poinCopy.gantiPin.ulangLabel}
                  value={pinUlang}
                  onChange={(e) =>
                    setPinUlang(e.target.value.replace(/\s/g, "").slice(0, 20))
                  }
                  required
                />
                {galatPin && (
                  <p role="alert" className="text-sm text-sambal-700">
                    {galatPin}
                  </p>
                )}
                {pesanPin && (
                  <p
                    role="status"
                    className="rounded-md bg-gold-100 px-3 py-2 text-sm text-gold-800"
                  >
                    {pesanPin}
                  </p>
                )}
                <button
                  type="submit"
                  className={`${TOMBOL} w-full`}
                  disabled={sibuk}
                >
                  {poinCopy.gantiPin.simpan}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Panel tab */}
        <div>
          <div
            role="tablist"
            aria-label="Bagian kartu anggota"
            className="flex gap-1 border-b border-ink/10"
          >
            {tabTombol.map(({ id, label, ikon: Ikon }) => {
              const aktif = tab === id;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={aktif}
                  onClick={() => setTab(id)}
                  className={`-mb-px inline-flex cursor-pointer items-center gap-2 border-b-2 px-3 py-3 text-sm font-bold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 ${
                    aktif
                      ? "border-sambal-600 text-sambal-700"
                      : "border-transparent text-ink/65 hover:text-ink"
                  }`}
                >
                  <Ikon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            {tab === "tukar" && (
              <div role="tabpanel" aria-label={poinCopy.tab.tukar}>
                <h2 className="font-display text-2xl">{poinCopy.tukar.judul}</h2>
                <p className="mt-1 text-sm text-ink/65">
                  {poinCopy.tukar.keterangan}
                </p>

                {data.hadiah.length === 0 ? (
                  <p className="mt-6 rounded-lg border border-dashed border-ink/20 p-6 text-sm text-ink/65">
                    {poinCopy.tukar.kosong}
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {data.hadiah.map((h) => {
                      const cukup = data.anggota.poin >= h.poin;
                      const sedangKonfirmasi = konfirmasi?.nama === h.nama;
                      return (
                        <li
                          key={h.nama}
                          className="rounded-lg border border-ink/10 bg-white p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="font-bold">{h.nama}</p>
                              {h.keterangan && (
                                <p className="mt-0.5 text-xs leading-relaxed text-ink/65">
                                  {h.keterangan}
                                </p>
                              )}
                            </div>
                            <span className="shrink-0 rounded-full bg-gold-100 px-3 py-1 text-xs font-bold text-gold-800">
                              {formatPoin(h.poin)} poin
                            </span>
                          </div>

                          <div className="mt-3">
                            {sedangKonfirmasi ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-ink/70">
                                  {poinCopy.tukar.konfirmasi}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => onTukar(h)}
                                  disabled={sibuk}
                                  className={TOMBOL}
                                >
                                  {sibuk ? (
                                    <Loader2
                                      className="h-4 w-4 animate-spin"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <Check
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  )}
                                  {poinCopy.tukar.ya}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setKonfirmasi(null)}
                                  className={TOMBOL_KEDUA}
                                >
                                  {poinCopy.tukar.batal}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setKonfirmasi(h)}
                                disabled={!cukup || sibuk}
                                className={TOMBOL_KEDUA}
                              >
                                <Gift className="h-4 w-4" aria-hidden="true" />
                                {cukup ? poinCopy.tukar.tombol : poinCopy.tukar.kurang}
                              </button>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}

            {tab === "kupon" && (
              <div role="tabpanel" aria-label={poinCopy.tab.kupon}>
                <h2 className="font-display text-2xl">{poinCopy.kupon.judul}</h2>

                {kuponBaru && (
                  <div className="mt-4 rounded-lg border border-gold-400 bg-gold-100/60 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div role="status">
                        <p className="text-sm font-bold text-gold-800">
                          {poinCopy.kupon.baruJudul}
                        </p>
                        <p className="mt-1 text-xs text-ink/65">
                          {poinCopy.kupon.tunjukkan}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setKuponBaru(null)}
                        className="cursor-pointer rounded-sm px-2 text-lg leading-none text-ink/65 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
                        aria-label="Tutup pemberitahuan"
                      >
                        ×
                      </button>
                    </div>
                    <p className="mt-3 font-mono text-2xl tracking-[0.18em] text-ink">
                      {kuponBaru.kode}
                    </p>
                  </div>
                )}

                {data.kupon.length === 0 ? (
                  <p className="mt-5 rounded-lg border border-dashed border-ink/20 p-6 text-sm text-ink/65">
                    {poinCopy.kupon.kosong}
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {[...kuponAktif, ...kuponLain].map((k) => (
                      <KartuKupon
                        key={k.kode}
                        kupon={k}
                        tersalin={salinKode === k.kode}
                        onSalin={onSalin}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === "riwayat" && (
              <div role="tabpanel" aria-label={poinCopy.tab.riwayat}>
                <h2 className="font-display text-2xl">
                  {poinCopy.riwayat.judul}
                </h2>

                {data.riwayat.length === 0 ? (
                  <p className="mt-5 rounded-lg border border-dashed border-ink/20 p-6 text-sm text-ink/65">
                    {poinCopy.riwayat.kosong}
                  </p>
                ) : (
                  <ul className="mt-4 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
                    {data.riwayat.map((r, i) => (
                      <li
                        key={`${r.waktu}-${i}`}
                        className="flex items-start justify-between gap-4 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold">
                            {r.jenis === "tukar"
                              ? poinCopy.riwayat.tukar
                              : poinCopy.riwayat.masuk}
                            {r.keterangan ? (
                              <span className="font-normal text-ink/65">
                                {" "}
                                · {r.keterangan}
                              </span>
                            ) : null}
                          </p>
                          <p className="mt-0.5 text-xs text-ink/65">
                            {formatWaktu(r.waktu)}
                          </p>
                        </div>
                        <div className="shrink-0 text-right">
                          <p
                            className={`text-sm font-bold ${
                              r.jumlah >= 0
                                ? "text-sambal-700"
                                : "text-ink/65"
                            }`}
                          >
                            {r.jumlah >= 0 ? "+" : ""}
                            {formatPoin(r.jumlah)}
                          </p>
                          <p className="text-xs text-ink/65">
                            {formatPoin(r.saldo)} poin
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KartuKupon({
  kupon,
  tersalin,
  onSalin,
}: {
  kupon: Kupon;
  tersalin: boolean;
  onSalin: (teks: string) => void;
}) {
  const aktif = kupon.status === "aktif";
  const labelStatus =
    kupon.status === "aktif"
      ? poinCopy.kupon.aktif
      : kupon.status === "kedaluwarsa"
        ? poinCopy.kupon.kedaluwarsa
        : poinCopy.kupon.terpakai;

  return (
    <div
      className={`rounded-lg border bg-white p-4 ${
        aktif ? "border-gold-400" : "border-ink/10 opacity-70"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold">{kupon.hadiah}</p>
          <p className="text-xs text-ink/65">
            {formatPoin(kupon.poin)} poin · {poinCopy.kupon.ditukar}{" "}
            {formatTanggal(kupon.dibuat)}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
            aktif
              ? "bg-gold-100 text-gold-800"
              : "bg-cream text-ink/65"
          }`}
        >
          {labelStatus}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <code className="rounded-md bg-cream/70 px-3 py-2 font-mono text-lg tracking-[0.14em] text-ink">
          {kupon.kode}
        </code>
        {aktif && (
          <button
            type="button"
            onClick={() => onSalin(kupon.kode)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-ink/50 px-3 py-2 text-xs font-bold text-ink/70 transition-colors duration-150 hover:border-sambal-600 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
          >
            {tersalin ? (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {tersalin ? poinCopy.kupon.tersalin : poinCopy.kupon.salin}
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-ink/65">
        {poinCopy.kupon.berlakuSampai} {formatTanggal(kupon.sampai)}
      </p>
      {aktif && (
        <p className="mt-1 text-xs text-ink/65">{poinCopy.kupon.tunjukkan}</p>
      )}
    </div>
  );
}
