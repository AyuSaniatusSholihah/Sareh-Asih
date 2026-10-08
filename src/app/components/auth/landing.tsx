import { useState, useEffect } from "react";
import { ArrowLeft, MoveRight } from "lucide-react";
import { TEXT, MUTED, PJS, IPS } from "../ui-kit";
import { motion, AnimatePresence } from "motion/react";
import heroStep1 from "@/imports/hero-step1.png";
import onboardKenali from "@/imports/onboard-kenali.jpg";
import onboardKembangkan from "@/imports/onboard-kembangkan.jpg";
import onboardPrestasi from "@/imports/onboard-prestasi.jpg";
import onboardLaporan from "@/imports/onboard-laporan.jpg";
import { SplashLogo } from "./illustrations";

export function LandingScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => {
        setStep(1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const goNext = () => {
    if (step < 5) setStep(step + 1);
    else onNext();
  };

  const goPrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const skip = () => onNext();

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative" style={{ fontFamily: IPS, backgroundColor: step === 0 ? "#E8F0E9" : "#F1F5F2" }}>
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-center z-50"
            style={{ backgroundColor: "#E8F0E9" }}
          >
            {/* Dekorasi Kiri Atas */}
            <div style={{ position: "absolute", top: 0, left: 0 }}>
              <svg width="120" height="150" viewBox="0 0 120 150" fill="none">
                <path d="M-20 40 Q40 0 80 60 Q120 120 0 150" fill="#D4E8DA" opacity="0.6" />
                <path d="M-30 60 Q30 20 60 80 Q90 140 -20 160" fill="#E8637A" opacity="0.1" />
                <circle cx="20" cy="90" r="15" fill="#D27D6B" opacity="0.8" />
                <path d="M0 20 Q40 50 20 100" fill="#8BB098" opacity="0.9" />
              </svg>
            </div>

            {/* Logo Tengah */}
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="mb-6 flex flex-col items-center mt-[-40px]"
            >
              <SplashLogo />
            </motion.div>
            <h1 style={{ fontFamily: PJS, fontSize: 34, fontWeight: 800, letterSpacing: "-0.5px", color: TEXT, lineHeight: 1.2, textAlign: "center" }}>
              Sareh <span style={{ color: "#72967F" }}>Asih</span>
            </h1>
            <p style={{ fontFamily: IPS, fontSize: 12.5, color: MUTED, textAlign: "center", maxWidth: "260px", marginTop: "14px", lineHeight: 1.5 }}>
              Jembatan digital guru SLB dan orang tua dalam mengenali & mengembangkan potensi anak berkebutuhan khusus.
            </p>

            {/* Spinner */}
            <div style={{ marginTop: "36px" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                style={{ width: 26, height: 26, border: "3px solid #8BB098", borderTopColor: "transparent", borderRadius: "50%" }}
              />
            </div>

            {/* Dekorasi Daun Bawah */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", pointerEvents: "none", zIndex: 1 }}>
              <svg width="100%" height="auto" viewBox="0 0 393 346" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
                <path d="M133.5 206.5C70.3652 249.905 -43.3735 223.731 -9.30923 287.784C-8.40301 289.488 -7.8811 291.493 -7.98623 293.42L-11.4248 356.456C-11.7372 362.184 -7.17647 367.001 -1.43958 367.001H384C389.523 367.001 394 362.559 394 357.036V190.255C394 186.247 390.796 182.922 386.787 182.922C385.725 182.922 384.683 182.708 383.712 182.277C353.987 169.111 248.097 143.053 133.5 206.5Z" fill="#D27D6B" fillOpacity="0.5" />
                <path d="M32.1326 208.758C31.9646 213.168 27.1053 224.237 9.14134 233.75C8.53025 234.074 7.93348 234.459 7.39999 234.899C-12.3609 251.194 -18.0102 265.436 -18.3526 270.575" stroke="#E7BDA8" strokeWidth="3" strokeLinecap="round" />
                <path d="M42.8568 170.439C38.1932 179.2 33.5223 198.392 31.7651 209.394C37.1872 209.179 49.2985 208.46 54.3675 207.301C60.7038 205.851 80.9932 198.131 87.4123 192.56C93.8313 186.988 96.9086 184.745 111.275 157.864C113.024 152.95 115.184 132.35 110.962 125.109C110.252 124.245 103.082 122.5 78.4177 133.067C51.4035 149.506 46.7671 163.094 42.8568 170.439Z" fill="#E7BDA8" stroke="#E6BEA8" />
                <path d="M69.7906 85.8494C64.4235 87.9581 54.8506 94.7207 49.7253 98.9533C51.9475 100.953 57.0081 105.312 59.4721 106.753C62.5521 108.555 73.6547 112.949 78.4283 112.942C83.2019 112.936 85.3178 113.124 101.808 106.675C104.477 105.157 113.628 96.7954 114.883 91.9317C114.951 91.2717 112.83 87.7221 98.8568 82.9079C81.5919 79.8071 74.2907 84.0812 69.7906 85.8494Z" fill="#B7C2B2" stroke="#B7C2B2" />
                <path d="M42.2832 77.5062C43.0491 83.2216 41.7923 94.8746 40.5847 101.411C37.7571 100.441 31.4877 98.1374 29.0305 96.6846C25.9591 94.8685 16.7219 87.3019 14.4075 83.1268C12.0932 78.9518 10.9004 77.1941 8.52008 59.6483C8.54956 56.5784 11.4087 44.5163 15.0493 41.0555C15.5929 40.6753 19.7261 40.8036 30.7253 50.675C41.8272 64.2558 41.641 72.714 42.2832 77.5062Z" fill="#B7C2B2" stroke="#B7C2B2" />
                <path d="M79.29 72.3772C74.3481 75.3487 63.1534 78.8203 56.6745 80.3062C56.4427 77.3258 56.0687 70.6571 56.4269 67.8251C56.8747 64.2852 60.1535 52.8035 63.0671 49.0222C65.9807 45.2408 67.1206 43.4484 82.2804 34.2996C85.1098 33.1082 97.316 30.945 101.937 32.9129C102.502 33.261 104.025 37.1056 99.3299 51.1194C91.271 66.6996 83.4337 69.8858 79.29 72.3772Z" fill="#B7C2B2" stroke="#B7C2B2" />
                <path d="M57.2595 79.4744C47.5138 115.003 38.6248 89.9982 19.3496 116.017C3.92941 136.832 -0.879248 151.053 -1.35605 155.561" stroke="#B7C2B2" strokeWidth="3" strokeLinecap="round" />
                <path d="M8.55377 159.756C7.5141 163.754 3.38691 172.418 -5.0138 176.666C-5.95918 177.145 -6.87957 177.687 -7.66241 178.401C-18.48 188.263 -23.7143 199.831 -25 204.524" stroke="#E7BDA8" strokeWidth="3" strokeLinecap="round" />
                <path d="M16.7042 140.746C13.1361 145.276 8.28704 155.947 5.99976 162.188C8.92748 162.792 15.4966 164 18.3511 164C21.9192 164 33.7216 162.188 37.8387 159.772C41.9558 157.356 43.8772 156.45 54.8561 142.558C56.3932 139.901 60.0711 128.063 58.6987 123.231C58.4243 122.627 54.8012 120.634 40.309 123.533C23.8406 129.573 19.6961 136.948 16.7042 140.746Z" fill="#E7BDA8" stroke="#E6BEA8" />
              </svg>
            </div>
          </motion.div>
        ) : step === 1 ? (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
            style={{ overflow: "hidden" }}
          >
            {/* Background Image - Full Screen */}
            <img
              src={heroStep1}
              alt="Guru dan anak belajar bersama"
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "center top", zIndex: 0
              }}
            />

            {/* Gradient Overlay */}
            <div style={{
              position: "absolute", inset: 0, zIndex: 1,
              background: "linear-gradient(to top, #D4E8DA 0%, rgba(46,85,55,0.3) 50%, rgba(35,64,41,0.2) 75%, rgba(23,43,28,0.15) 87.5%, rgba(0,0,0,0.1) 100%)"
            }} />

            {/* Konten Teks */}
            <div style={{
              position: "absolute", bottom: 110, left: 24, right: 24, zIndex: 2
            }}>
              <p style={{
                fontFamily: PJS, fontSize: 15, fontWeight: 600,
                color: "#2E3E35", lineHeight: 1.55,
                textAlign: "left",
                textShadow: "0 1px 2px rgba(255,255,255,0.4)"
              }}>
                Bersama teknologi yang inklusif, kita kurangi kesenjangan dan wujudkan pendidikan berkualitas untuk setiap anak.
              </p>
            </div>

            {/* Tombol Mulai */}
            <div style={{
              position: "absolute", bottom: 24, left: 24, right: 24, zIndex: 3,
              display: "flex", justifyContent: "center"
            }}>
              <button
                onClick={goNext}
                className="active:scale-95 transition-transform"
                style={{
                  width: "100%", maxWidth: 342, background: "#FFFFFF", color: "#2E5537",
                  fontFamily: PJS, fontWeight: 700, fontSize: 15,
                  border: "none", borderRadius: 20, padding: "14px 22px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 10, cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.18)"
                }}
              >
                <span>Mulai</span>
                <MoveRight size={17} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`step-${step}`}
            initial={{ opacity: 0, x: 35 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -35 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -45) goNext();
              else if (info.offset.x > 45 && step > 1) goPrev();
            }}
            className="absolute inset-0 flex flex-col"
            style={{ background: "#F1F5F2" }}
          >
            {/* TOP BAR */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, zIndex: 20,
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "52px 20px 12px",
              background: "linear-gradient(to bottom, rgba(241,245,242,0.96) 60%, transparent)",
            }}>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                {[2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    style={{
                      width: step === i ? 22 : 7, height: 7, borderRadius: 4,
                      border: "none", padding: 0, cursor: "pointer",
                      backgroundColor: step === i ? "#8BB098" : "#C8DDD0",
                      transition: "width 0.3s ease, background-color 0.3s ease",
                    }}
                    title={`Slide ${i - 1}`}
                  />
                ))}
              </div>
              <button
                onClick={skip}
                style={{
                  fontSize: 12.5, fontWeight: 600, color: "#6B8070",
                  fontFamily: IPS, border: "none", background: "transparent", cursor: "pointer",
                }}
              >
                Lewati
              </button>
            </div>

            {/* ILLUSTRATION */}
            <div style={{
              flex: "0 0 58%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
              paddingTop: 80,
            }}>
              <img
                src={
                  step === 2 ? onboardKenali
                  : step === 3 ? onboardKembangkan
                  : step === 4 ? onboardPrestasi
                  : onboardLaporan
                }
                alt={
                  step === 2 ? "Kenali anak"
                  : step === 3 ? "Kembangkan potensi"
                  : step === 4 ? "Raih prestasi"
                  : "Bagikan laporan"
                }
                style={{
                  width: "88%", maxWidth: 320,
                  height: "100%", objectFit: "contain", objectPosition: "bottom center",
                  filter: "drop-shadow(0 8px 24px rgba(91,122,104,0.12))",
                }}
              />
            </div>

            {/* TEXT CONTENT */}
            <div style={{
              flex: 1,
              display: "flex", flexDirection: "column", justifyContent: "flex-start",
              padding: "20px 28px 0",
            }}>
              <div style={{
                display: "inline-flex", alignSelf: "flex-start",
                background: step === 4 ? "#FEF9EC" : step === 3 ? "#FEF3EE" : "#EAF2EC",
                color: step === 4 ? "#9A7A30" : step === 3 ? "#C46A4A" : "#5B7A68",
                fontSize: 10.5, fontWeight: 700, fontFamily: IPS,
                padding: "3px 10px", borderRadius: 20, marginBottom: 10,
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>
                {step === 2 ? "Kenali" : step === 3 ? "Kembangkan" : step === 4 ? "Prestasi" : "Laporan"}
              </div>

              <h2 style={{
                fontFamily: PJS, fontWeight: 800, fontSize: 22,
                color: "#1E2E25", lineHeight: 1.22, marginBottom: 10,
              }}>
                {step === 2 && <>Pahami setiap anak<br />secara menyeluruh</>}
                {step === 3 && <>Arahkan potensi anak<br />dengan tepat sasaran</>}
                {step === 4 && <>Dukung anak meraih<br />prestasi terbaik</>}
                {step === 5 && <>Laporan mudah dibagikan<br />ke orang tua</>}
              </h2>

              <p style={{
                fontFamily: IPS, fontSize: 13.5, color: "#6B8070",
                lineHeight: 1.6, margin: 0,
              }}>
                {step === 2 && "Asesmen berbasis profil fungsional dan potensi unik — satu kali input, Sareh kenali seluruh kebutuhan anak."}
                {step === 3 && "Rekomendasi strategi belajar dan rencana perkembangan yang disesuaikan AI untuk setiap anak."}
                {step === 4 && "Cocokkan bakat PDBK ke ajang O2SN, FLS3N, dan LKSN Diksus yang paling sesuai."}
                {step === 5 && "Generate laporan perkembangan kapan saja — guru dan orang tua selalu terhubung."}
              </p>
            </div>

            {/* FOOTER NAV */}
            <div style={{
              padding: "16px 24px 36px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div style={{ width: 44 }}>
                {step > 2 && (
                  <button
                    onClick={goPrev}
                    className="active:scale-90 transition-transform flex items-center justify-center"
                    style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "#FFFFFF", border: "1.5px solid rgba(91,122,104,0.18)",
                      color: "#2E3E35", cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                    title="Sebelumnya"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
              </div>

              {step === 5 ? (
                <button
                  onClick={goNext}
                  className="active:scale-95 transition-transform flex justify-center items-center gap-2"
                  style={{
                    height: 50, padding: "0 28px", background: "#D27D6B", color: "#FFF",
                    borderRadius: 25, border: "none", cursor: "pointer",
                    fontFamily: PJS, fontWeight: 700, fontSize: 15,
                    boxShadow: "0 6px 18px rgba(210,125,107,0.35)",
                  }}
                  title="Selesai"
                >
                  <span>Mulai Sekarang</span>
                  <MoveRight size={20} strokeWidth={2.5} />
                </button>
              ) : (
                <button
                  onClick={goNext}
                  className="active:scale-95 transition-transform flex justify-center items-center"
                  style={{
                    width: 50, height: 50, background: "#D27D6B", color: "#FFF", borderRadius: "50%",
                    border: "none", cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(210,125,107,0.35)",
                  }}
                  title="Berikutnya"
                >
                  <MoveRight size={22} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Background ornament daun bawah (subtle) */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.4 }}>
              <svg width="100%" height="auto" viewBox="0 0 393 346" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", width: "100%" }}>
                <path d="M133.5 206.5C70.3652 249.905 -43.3735 223.731 -9.30923 287.784C-8.40301 289.488 -7.8811 291.493 -7.98623 293.42L-11.4248 356.456C-11.7372 362.184 -7.17647 367.001 -1.43958 367.001H384C389.523 367.001 394 362.559 394 357.036V190.255C394 186.247 390.796 182.922 386.787 182.922C385.725 182.922 384.683 182.708 383.712 182.277C353.987 169.111 248.097 143.053 133.5 206.5Z" fill="#D27D6B" fillOpacity="0.35" />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
