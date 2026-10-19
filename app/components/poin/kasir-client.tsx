"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Coins,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  PlusCircle,
  Search,
  Ticket,
  UserPlus,
} from "lucide-react";
import { kasirCopy } from "../../data/poin";
import {
  bacaTokenKasir,
  cariAnggotaKasir,
  cekKasir,
  daftarAnggotaBaru,
  hapusTokenKasir,
  masukKasir,
  pakaiKupon,
  resetPinAnggota,
  simpanTokenKasir,
  tambahPoin,
  type Anggota,
  type Kupon,
} from "../../lib/poin";

type Tab = "tambah" | "daftar" | "kupon";

const INPUT =
  "w-full rounded-md border border-ink/20 bg-white px-4 py-3 text-sm text-ink transition-colors duration-150 placeholder:text-ink/35 focus:border-sambal-600 focus:outline-none disabled:opacity-60";
const TOMBOL =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-sambal-600 px-5 py-3 text-sm font-bold text-paper transition-colors duration-150 hover:bg-sambal-700 active:bg-sambal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 disabled:cursor-not-allowed disabled:opacity-50";
const TOMBOL_KEDUA =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-ink/20 bg-white px-4 py-2.5 text-sm font-bold text-ink/80 transition-colors duration-150 hover:border-sambal-600 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 disabled:cursor-not-allowed disabled:opacity-50";

function pesanKasir(err: unknown): string {
  const kode = err instanceof Error ? err.message : "";
  if (kode === "sesi") return kasirCopy.sesiHabis;
  if (kode === "jaringan") return kasirCopy.jaringan;
  if (kode === "gangguan") return kasirCopy.gangguan;
  if (
    kode === "nonaktif" ||
    kode === "rating tidak valid" ||
    kode === "aksi tidak dikenal"
  ) {
    return kasirCopy.nonaktif;
  }
  return kode || kasirCopy.umum;
}

export default function KasirClient() {
  const [siap, setSiap] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [pinDefault, setPinDefault] = useState(false);
  const [sibuk, setSibuk] = useState(false);
  const [galat, setGalat] = useState("");

  // Login
  const [pin, setPin] = useState("");
  const [lihatPin, setLihatPin] = useState(false);

  // Tab & formulir
  const [tab, setTab] = useState<Tab>("tambah");
  const [cari, setCari] = useState("");
  const [hasilCari, setHasilCari] = useState<Anggota[] | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [porsi, setPorsi] = useState("1");
  const [catatan, setCatatan] = useState("");
  const [pesanTambah, setPesanTambah] = useState("");
  const [resetBuka, setResetBuka] = useState(false);
  const [pinReset, setPinReset] = useState("");
  const [pesanReset, setPesanReset] = useState("");

  const [nama, setNama] = useState("");
  const [wa, setWa] = useState("");
  const [anggotaBaru, setAnggotaBaru] = useState<{
    nomor: string;
    pin: string;
    nama: string;
  } | null>(null);

  const [kode, setKode] = useState("");
  const [hasilKupon, setHasilKupon] = useState<{
    kupon: Kupon;
    anggota: Anggota | null;
  } | null>(null);
  const [pesanKupon, setPesanKupon] = useState("");

  const [salin, setSalin] = useState("");

  // Pulihkan sesi kasir (per-tab).
  useEffect(() => {
    let batal = false;
    (async () => {
      const t = bacaTokenKasir();
      if (!t) {
        if (!batal) setSiap(true);
        return;
      }
      try {
        const d = await cekKasir(t);
        if (batal) return;
        setToken(t);
        setPinDefault(d.pinDefault);
      } catch {
        hapusTokenKasir();
      } finally {
        if (!batal) setSiap(true);
      }
    })();
    return () => {
      batal = true;
    };
  }, []);

  function keluar() {
    hapusTokenKasir();
    setToken(null);
    setPin("");
    setGalat("");
    setTab("tambah");
    setCari("");
    setHasilCari(null);
    setAnggota(null);
    setPorsi("1");
    setCatatan("");
    setPesanTambah("");
    setResetBuka(false);
    setPinReset("");
    setPesanReset("");
    setNama("");
    setWa("");
    setAnggotaBaru(null);
    setKode("");
    setHasilKupon(null);
    setPesanKupon("");
  }

  /** Kalau sesi habis: bersihkan & tampilkan pesan di layar login. */
  function tangani(err: unknown) {
    if (err instanceof Error && err.message === "sesi") {
      keluar();
      setGalat(kasirCopy.sesiHabis);
      return;
    }
    setGalat(pesanKasir(err));
  }

  async function kirimLogin(e: FormEvent) {
    e.preventDefault();
    setGalat("");
    if (!/^\d{6,12}$/.test(pin)) {
      setGalat(kasirCopy.login.salah);
      return;
    }
    setSibuk(true);
    try {
      const hasil = await masukKasir(pin);
      simpanTokenKasir(hasil.token);
      setToken(hasil.token);
      setPinDefault(hasil.pinDefault);
      setPin("");
    } catch (err) {
      setGalat(pesanKasir(err));
    } finally {
      setSibuk(false);
    }
  }

  function pilihAnggota(a: Anggota) {
    setAnggota(a);
    setHasilCari(null);
    setPorsi("1");
    setCatatan("");
    setPesanTambah("");
    setResetBuka(false);
    setPinReset("");
    setPesanReset("");
    setGalat("");
  }

  async function kirimCari(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    const q = cari.trim();
    if (q.length < 2) {
      setGalat("Ketik minimal 2 huruf.");
      return;
    }
    setSibuk(true);
    setGalat("");
    setPesanTambah("");
    try {
      const hasil = await cariAnggotaKasir(token, q);
      setHasilCari(hasil);
      setAnggota(null);
      if (hasil.length === 1) pilihAnggota(hasil[0]);
    } catch (err) {
      tangani(err);
    } finally {
      setSibuk(false);
    }
  }

  async function kirimTambah(e: FormEvent) {
    e.preventDefault();
    if (!token || !anggota) return;
    const jumlah = Number(porsi);
    if (!Number.isInteger(jumlah) || jumlah < 1 || jumlah > 50) {
      setGalat("Jumlah porsi harus 1–50.");
      return;
    }
    setSibuk(true);
    setGalat("");
    setPesanTambah("");
    try {
      const hasil = await tambahPoin(
        token,
        anggota.nomor,
        jumlah,
        catatan.trim()
      );
      setAnggota(hasil.anggota);
      setPesanTambah(
        `${kasirCopy.tambah.berhasil} ${kasirCopy.tambah.saldo}: ${hasil.anggota.poin} poin.`
      );
      setPorsi("1");
      setCatatan("");
      setHasilCari((lama) =>
        lama
          ? lama.map((a) =>
              a.nomor === hasil.anggota.nomor
                ? { ...a, poin: hasil.anggota.poin }
                : a
            )
          : lama
      );
    } catch (err) {
      tangani(err);
    } finally {
      setSibuk(false);
    }
  }

  async function kirimDaftar(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (nama.trim().length < 2) {
      setGalat("Nama minimal 2 huruf.");
      return;
    }
    setSibuk(true);
    setGalat("");
    try {
      const hasil = await daftarAnggotaBaru(token, nama.trim(), wa.trim());
      setAnggotaBaru(hasil);
      setNama("");
      setWa("");
    } catch (err) {
      tangani(err);
    } finally {
      setSibuk(false);
    }
  }

  async function kirimKupon(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!kode.trim()) {
      setPesanKupon(kasirCopy.kupon.kosong);
      return;
    }
    setSibuk(true);
    setGalat("");
    setHasilKupon(null);
    setPesanKupon("");
    try {
      const hasil = await pakaiKupon(token, kode.trim().toUpperCase());
      setHasilKupon(hasil);
      setKode("");
    } catch (err) {
      if (err instanceof Error && err.message === "sesi") {
        tangani(err);
      } else {
        setPesanKupon(pesanKasir(err));
      }
    } finally {
      setSibuk(false);
    }
  }

  async function kirimReset(e: FormEvent) {
    e.preventDefault();
    if (!token || !anggota) return;
    setSibuk(true);
    setGalat("");
    setPesanReset("");
    try {
      const hasil = await resetPinAnggota(token, anggota.nomor);
      setPinReset(hasil.pin);
      setPesanReset(kasirCopy.reset.berhasil);
    } catch (err) {
      tangani(err);
    } finally {
      setSibuk(false);
    }
  }

  async function salinTeks(teks: string) {
    try {
      await navigator.clipboard.writeText(teks);
      setSalin(teks);
      window.setTimeout(() => setSalin(""), 2000);
    } catch {
      /* clipboard kadang diblokir — abaikan */
    }
  }

  if (!siap) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper">
        <Loader2
          className="h-6 w-6 animate-spin text-sambal-700"
          aria-hidden="true"
        />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="grid min-h-screen place-items-center bg-paper px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-6 text-center">
            <p className="font-display text-xs uppercase tracking-[0.28em] text-sambal-700">
              Kedai Raos
            </p>
            <h1 className="mt-2 font-display text-3xl">{kasirCopy.judul}</h1>
            <p className="mt-2 text-sm text-ink/60">{kasirCopy.subjudul}</p>
          </div>

          <form
            onSubmit={kirimLogin}
            className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm"
          >
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-sambal-50 text-sambal-700">
              <KeyRound className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="mt-4 font-display text-xl">
              {kasirCopy.login.judul}
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              {kasirCopy.login.keterangan}
            </p>

            <label
              htmlFor="kasir-pin"
              className="mt-5 mb-1.5 block text-sm font-bold"
            >
              {kasirCopy.login.pinLabel}
            </label>
            <div className="relative">
              <input
                id="kasir-pin"
                className={`${INPUT} pr-12`}
                type={lihatPin ? "text" : "password"}
                inputMode="numeric"
                autoComplete="off"
                maxLength={12}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, "").slice(0, 12));
                  setGalat("");
                }}
                placeholder={kasirCopy.login.pinPlaceholder}
                required
              />
              <button
                type="button"
                onClick={() => setLihatPin((b) => !b)}
                className="absolute inset-y-0 right-1 my-auto grid h-9 w-9 cursor-pointer place-items-center rounded-md text-ink/45 transition-colors duration-150 hover:bg-cream hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
                aria-label={lihatPin ? "Sembunyikan PIN" : "Tampilkan PIN"}
              >
                {lihatPin ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {galat && (
              <p
                role="alert"
                className="mt-3 rounded-md border border-sambal-600/25 bg-sambal-50 px-3 py-2 text-sm text-sambal-800"
              >
                {galat}
              </p>
            )}

            <button
              type="submit"
              className={`${TOMBOL} mt-4 w-full`}
              disabled={sibuk}
            >
              {sibuk ? (
                <>
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                  {kasirCopy.login.sibuk}
                </>
              ) : (
                kasirCopy.login.tombol
              )}
            </button>
          </form>

          <Link
            href="/"
            className="mt-5 block text-center text-sm font-bold text-ink/55 transition-colors duration-150 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sambal-700"
          >
            ← {kasirCopy.kembali}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      {/* Bar atas */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight">
              {kasirCopy.judul}
            </p>
            <p className="truncate text-xs text-ink/50">{kasirCopy.subjudul}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/"
              aria-label={kasirCopy.kembali}
              className="hidden rounded-md px-3 py-2 text-xs font-bold text-ink/55 transition-colors duration-150 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 sm:block"
            >
              {kasirCopy.kembali}
            </Link>
            <button
              type="button"
              onClick={keluar}
              className={TOMBOL_KEDUA}
              aria-label={kasirCopy.keluar}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{kasirCopy.keluar}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {pinDefault && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-gold-400 bg-gold-100/70 p-4 text-sm text-gold-700">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0"
              aria-hidden="true"
            />
            <p>{kasirCopy.pinBawaan}</p>
          </div>
        )}

        {galat && (
          <p
            role="alert"
            className="mb-4 rounded-md border border-sambal-600/25 bg-sambal-50 px-4 py-3 text-sm text-sambal-800"
          >
            {galat}
          </p>
        )}

        {/* Tab */}
        <div
          role="tablist"
          aria-label="Menu kasir"
          className="grid grid-cols-3 gap-1 rounded-lg border border-ink/10 bg-white p-1"
        >
          {(
            [
              { id: "tambah" as Tab, label: kasirCopy.tab.tambah, ikon: PlusCircle },
              { id: "daftar" as Tab, label: kasirCopy.tab.daftar, ikon: UserPlus },
              { id: "kupon" as Tab, label: kasirCopy.tab.kupon, ikon: Ticket },
            ] as const
          ).map(({ id, label, ikon: Ikon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              onClick={() => {
                setTab(id);
                setGalat("");
              }}
              className={`inline-flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md px-2 py-2.5 text-xs font-bold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700 sm:flex-row sm:text-sm ${
                tab === id
                  ? "bg-ink text-paper"
                  : "text-ink/60 hover:bg-cream"
              }`}
            >
              <Ikon className="h-4 w-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {tab === "tambah" && (
            <div role="tabpanel" aria-label={kasirCopy.tab.tambah}>
              <h2 className="font-display text-2xl">
                {kasirCopy.cari.judul}
              </h2>
              <p className="mt-1 text-sm text-ink/60">
                {kasirCopy.cari.keterangan}
              </p>

              <form onSubmit={kirimCari} className="mt-4 flex gap-2">
                <input
                  className={INPUT}
                  value={cari}
                  onChange={(e) => setCari(e.target.value)}
                  placeholder={kasirCopy.cari.placeholder}
                  aria-label={kasirCopy.cari.judul}
                />
                <button
                  type="submit"
                  className={TOMBOL}
                  disabled={sibuk}
                  aria-label={kasirCopy.cari.tombol}
                >
                  {sibuk ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Search className="h-4 w-4" aria-hidden="true" />
                  )}
                  <span className="hidden sm:inline">
                    {kasirCopy.cari.tombol}
                  </span>
                </button>
              </form>

              {hasilCari && hasilCari.length === 0 && (
                <p className="mt-4 rounded-lg border border-dashed border-ink/20 p-5 text-sm text-ink/55">
                  {kasirCopy.cari.kosong}
                </p>
              )}

              {hasilCari && hasilCari.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {hasilCari.map((a) => (
                    <li key={a.nomor}>
                      <button
                        type="button"
                        onClick={() => pilihAnggota(a)}
                        className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border border-ink/10 bg-white px-4 py-3 text-left transition-colors duration-150 hover:border-sambal-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-bold">
                            {a.nama}
                          </span>
                          <span className="block font-mono text-xs text-ink/50">
                            {a.nomor}
                            {a.wa ? ` · ${a.wa}` : ""}
                          </span>
                        </span>
                        <span className="shrink-0 rounded-full bg-gold-100 px-3 py-1 text-xs font-bold text-gold-700">
                          {a.poin} poin
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!anggota && !hasilCari && (
                <p className="mt-4 rounded-lg border border-dashed border-ink/20 p-5 text-sm text-ink/55">
                  {kasirCopy.cari.pilih}
                </p>
              )}

              {anggota && (
                <div className="mt-5">
                  <div className="rounded-lg bg-ink p-5 text-paper">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-display text-xl">
                          {anggota.nama}
                        </p>
                        <p className="mt-0.5 font-mono text-xs text-paper/55">
                          {anggota.nomor}
                          {anggota.wa ? ` · ${anggota.wa}` : ""}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-3xl text-gold-300">
                          {anggota.poin}
                        </p>
                        <p className="text-xs text-paper/55">poin</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setAnggota(null)}
                        className="cursor-pointer rounded-md border border-paper/25 px-3 py-1.5 text-xs font-bold text-paper/80 transition-colors duration-150 hover:border-gold-300 hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                      >
                        Ganti anggota
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setResetBuka((b) => !b);
                          setPesanReset("");
                          setPinReset("");
                        }}
                        className="cursor-pointer rounded-md border border-paper/25 px-3 py-1.5 text-xs font-bold text-paper/80 transition-colors duration-150 hover:border-gold-300 hover:text-gold-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
                        aria-expanded={resetBuka}
                      >
                        {kasirCopy.reset.judul}
                      </button>
                    </div>
                  </div>

                  {resetBuka && (
                    <form
                      onSubmit={kirimReset}
                      className="mt-3 rounded-lg border border-ink/10 bg-white p-4"
                    >
                      <p className="text-sm font-bold">{kasirCopy.reset.judul}</p>
                      <p className="mt-1 text-xs leading-relaxed text-ink/55">
                        {kasirCopy.reset.keterangan}
                      </p>
                      {pesanReset && (
                        <div className="mt-3 rounded-md bg-gold-100 p-3">
                          <p className="text-sm font-bold text-gold-700">
                            {pesanReset}
                          </p>
                          <p className="mt-1 font-mono text-2xl tracking-[0.2em]">
                            {pinReset}
                          </p>
                        </div>
                      )}
                      <button
                        type="submit"
                        className={`${TOMBOL_KEDUA} mt-3`}
                        disabled={sibuk}
                      >
                        <KeyRound className="h-4 w-4" aria-hidden="true" />
                        {kasirCopy.reset.tombol}
                      </button>
                    </form>
                  )}

                  <form
                    onSubmit={kirimTambah}
                    className="mt-3 rounded-lg border border-ink/10 bg-white p-4"
                  >
                    <p className="font-bold">{kasirCopy.tambah.judul}</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink/55">
                      {kasirCopy.tambah.keterangan}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-[140px_1fr]">
                      <div>
                        <label
                          htmlFor="kasir-porsi"
                          className="mb-1.5 block text-xs font-bold text-ink/60"
                        >
                          {kasirCopy.tambah.porsiLabel}
                        </label>
                        <input
                          id="kasir-porsi"
                          className={INPUT}
                          type="number"
                          min={1}
                          max={50}
                          step={1}
                          inputMode="numeric"
                          value={porsi}
                          onChange={(e) => setPorsi(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="kasir-catatan"
                          className="mb-1.5 block text-xs font-bold text-ink/60"
                        >
                          {kasirCopy.tambah.catatanLabel}
                        </label>
                        <input
                          id="kasir-catatan"
                          className={INPUT}
                          value={catatan}
                          onChange={(e) => setCatatan(e.target.value)}
                          placeholder={kasirCopy.tambah.catatanPlaceholder}
                          maxLength={80}
                        />
                      </div>
                    </div>

                    {pesanTambah && (
                      <p
                        role="status"
                        className="mt-3 flex items-start gap-2 rounded-md bg-gold-100 px-3 py-2 text-sm font-bold text-gold-700"
                      >
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0"
                          aria-hidden="true"
                        />
                        {pesanTambah}
                      </p>
                    )}

                    <button
                      type="submit"
                      className={`${TOMBOL} mt-4 w-full`}
                      disabled={sibuk}
                    >
                      {sibuk ? (
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        <Coins className="h-4 w-4" aria-hidden="true" />
                      )}
                      {kasirCopy.tambah.tombol}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {tab === "daftar" && (
            <div role="tabpanel" aria-label={kasirCopy.tab.daftar}>
              {!anggotaBaru ? (
                <form
                  onSubmit={kirimDaftar}
                  className="rounded-lg border border-ink/10 bg-white p-5"
                >
                  <h2 className="font-display text-2xl">
                    {kasirCopy.daftar.judul}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink/60">
                    {kasirCopy.daftar.keterangan}
                  </p>

                  <label
                    htmlFor="kasir-nama"
                    className="mt-4 mb-1.5 block text-sm font-bold"
                  >
                    {kasirCopy.daftar.namaLabel}
                  </label>
                  <input
                    id="kasir-nama"
                    className={INPUT}
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder={kasirCopy.daftar.namaPlaceholder}
                    maxLength={60}
                    required
                  />

                  <label
                    htmlFor="kasir-wa"
                    className="mt-3 mb-1.5 block text-sm font-bold"
                  >
                    {kasirCopy.daftar.waLabel}
                  </label>
                  <input
                    id="kasir-wa"
                    className={INPUT}
                    value={wa}
                    onChange={(e) => setWa(e.target.value)}
                    placeholder={kasirCopy.daftar.waPlaceholder}
                    inputMode="tel"
                    maxLength={20}
                  />

                  <button
                    type="submit"
                    className={`${TOMBOL} mt-4 w-full`}
                    disabled={sibuk}
                  >
                    {sibuk ? (
                      <Loader2
                        className="h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                    ) : (
                      <UserPlus className="h-4 w-4" aria-hidden="true" />
                    )}
                    {kasirCopy.daftar.tombol}
                  </button>
                </form>
              ) : (
                <div className="rounded-lg border border-gold-400 bg-white p-5">
                  <p className="flex items-center gap-2 text-sm font-bold text-gold-700">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    {kasirCopy.daftar.berhasil}
                  </p>
                  <p className="mt-3 font-display text-2xl">
                    {anggotaBaru.nama}
                  </p>

                  <div className="mt-4 space-y-3">
                    <div className="rounded-md bg-cream/60 p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-ink/50">
                        {kasirCopy.daftar.nomorLabel}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="font-mono text-xl tracking-wider">
                          {anggotaBaru.nomor}
                        </p>
                        <button
                          type="button"
                          onClick={() => salinTeks(anggotaBaru.nomor)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-ink/15 px-2.5 py-1.5 text-xs font-bold text-ink/70 transition-colors duration-150 hover:border-sambal-600 hover:text-sambal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sambal-700"
                        >
                          {salin === anggotaBaru.nomor ? (
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          {salin === anggotaBaru.nomor
                            ? kasirCopy.daftar.tersalin
                            : kasirCopy.daftar.salin}
                        </button>
                      </div>
                    </div>

                    <div className="rounded-md bg-gold-100 p-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-gold-700">
                        {kasirCopy.daftar.pinLabel}
                      </p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="font-mono text-2xl tracking-[0.25em]">
                          {anggotaBaru.pin}
                        </p>
                        <button
                          type="button"
                          onClick={() => salinTeks(anggotaBaru.pin)}
                          className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-gold-700/25 px-2.5 py-1.5 text-xs font-bold text-gold-700 transition-colors duration-150 hover:bg-gold-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700"
                        >
                          {salin === anggotaBaru.pin ? (
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          {salin === anggotaBaru.pin
                            ? kasirCopy.daftar.tersalin
                            : kasirCopy.daftar.salin}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-ink/55">
                    {kasirCopy.daftar.pinCatatan}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setAnggotaBaru(null);
                      setGalat("");
                    }}
                    className={`${TOMBOL_KEDUA} mt-4`}
                  >
                    <UserPlus className="h-4 w-4" aria-hidden="true" />
                    {kasirCopy.daftar.lagi}
                  </button>
                </div>
              )}
            </div>
          )}

          {tab === "kupon" && (
            <div role="tabpanel" aria-label={kasirCopy.tab.kupon}>
              <form
                onSubmit={kirimKupon}
                className="rounded-lg border border-ink/10 bg-white p-5"
              >
                <h2 className="font-display text-2xl">
                  {kasirCopy.kupon.judul}
                </h2>
                <p className="mt-1 text-sm text-ink/60">
                  {kasirCopy.kupon.keterangan}
                </p>

                <label
                  htmlFor="kasir-kode"
                  className="mt-4 mb-1.5 block text-sm font-bold"
                >
                  {kasirCopy.kupon.kodeLabel}
                </label>
                <input
                  id="kasir-kode"
                  className={`${INPUT} font-mono tracking-wider`}
                  value={kode}
                  onChange={(e) => {
                    setKode(e.target.value.toUpperCase());
                    setPesanKupon("");
                    setHasilKupon(null);
                  }}
                  placeholder={kasirCopy.kupon.kodePlaceholder}
                  autoCapitalize="characters"
                  spellCheck={false}
                  required
                />

                <button
                  type="submit"
                  className={`${TOMBOL} mt-4 w-full`}
                  disabled={sibuk}
                >
                  {sibuk ? (
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Ticket className="h-4 w-4" aria-hidden="true" />
                  )}
                  {kasirCopy.kupon.tombol}
                </button>
              </form>

              {pesanKupon && (
                <p
                  role="alert"
                  className="mt-3 rounded-md border border-sambal-600/25 bg-sambal-50 px-4 py-3 text-sm text-sambal-800"
                >
                  {pesanKupon}
                </p>
              )}

              {hasilKupon && (
                <div className="mt-3 rounded-lg border border-gold-400 bg-white p-5">
                  <p className="flex items-center gap-2 text-sm font-bold text-gold-700">
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    {kasirCopy.kupon.berhasil}
                  </p>
                  <p className="mt-3 font-mono text-lg tracking-wider text-ink/60">
                    {hasilKupon.kupon.kode}
                  </p>

                  <dl className="mt-4 space-y-2 border-t border-ink/10 pt-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink/55">
                        {kasirCopy.kupon.hadiah}
                      </dt>
                      <dd className="text-right font-bold">
                        {hasilKupon.kupon.hadiah}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink/55">
                        {kasirCopy.kupon.anggota}
                      </dt>
                      <dd className="text-right font-bold">
                        {hasilKupon.anggota
                          ? `${hasilKupon.anggota.nama} (${hasilKupon.anggota.nomor})`
                          : "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink/55">{kasirCopy.kupon.poin}</dt>
                      <dd className="text-right font-bold">
                        {hasilKupon.kupon.poin} poin
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => {
                      setHasilKupon(null);
                      setKode("");
                    }}
                    className={`${TOMBOL_KEDUA} mt-4`}
                  >
                    <Ticket className="h-4 w-4" aria-hidden="true" />
                    Periksa kupon lain
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-ink/35">
          {kasirCopy.judul} · {kasirCopy.subjudul}
        </p>
      </main>
    </div>
  );
}
