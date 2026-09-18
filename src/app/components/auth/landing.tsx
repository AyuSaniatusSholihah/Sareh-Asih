import { useState, useEffect } from "react";
import {
  ChevronRight, ArrowLeft, Users, Star, User, PlayCircle, Trophy,
  TrendingUp, Calendar, Video, Target as TargetIcon, MoveRight, CheckSquare, Download,
} from "lucide-react";
import { TEXT, MUTED, PJS, IPS } from "../ui-kit";
import { motion, AnimatePresence } from "motion/react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, LineChart, Line } from "recharts";
import heroStep1 from "@/imports/hero-step1.png";
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
            className="absolute inset-0 flex flex-col bg-[#F1F5F2]"
          >
            {/* HEADER */}
            <div className="flex justify-between items-center px-5 pt-11 pb-3 z-10">
              <div style={{ width: 44 }}>
                {step > 1 && (
                  <button
                    onClick={goPrev}
                    className="active:scale-90 transition-transform flex items-center justify-center"
                    style={{
                      width: 34, height: 34, borderRadius: 10,
                      background: "rgba(255,255,255,0.7)", border: "1px solid rgba(91,122,104,0.15)",
                      color: "#2E3E35", cursor: "pointer"
                    }}
                    title="Kembali"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}
              </div>
              <div style={{ background: "#D27D6B", color: "#FFF", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, fontFamily: PJS, letterSpacing: "0.03em" }}>
                {step > 1 ? `0${step - 1} / 04` : ""}
              </div>
              <button onClick={skip} className="active:opacity-75 transition-opacity" style={{ fontSize: 12.5, fontWeight: 600, color: "#6B8070", fontFamily: IPS, border: "none", background: "transparent", cursor: "pointer" }}>
                Lewati
              </button>
            </div>

            {/* SLIDE UTAMA */}
            <div className="flex-1 overflow-y-auto px-4 pb-28 z-10 no-scrollbar">
              {step === 2 && (
                <>
                  <div className="px-1">
                    <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: "#2E3E35", marginBottom: 6, lineHeight: 1.25 }}>
                      Kenali Setiap Anak<br />dengan Lebih Mendalam
                    </h2>
                    <p style={{ fontSize: 12.5, color: "#5B7A68", lineHeight: 1.5, marginBottom: 14 }}>
                      Observasi dan asesmen adaptif untuk memahami kebutuhan, minat, dan potensi unik anak.
                    </p>
                  </div>

                  {/* Card Radar Chart */}
                  <div style={{
                    background: "#FFF", borderRadius: 22, padding: "18px 16px",
                    boxShadow: "0 8px 24px rgba(91,122,104,0.08), 0 1px 3px rgba(0,0,0,0.03)",
                    border: "1px solid rgba(91,122,104,0.10)"
                  }}>
                    <h3 style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 700, color: "#2E3E35", marginBottom: 8 }}>Hasil Asesmen</h3>
                    <div style={{ height: 220, width: "100%", marginBottom: 12 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="76%" data={[
                          { subject: 'Kognitif', A: 80, fullMark: 100 },
                          { subject: 'Sosial', A: 65, fullMark: 100 },
                          { subject: 'Motorik', A: 50, fullMark: 100 },
                          { subject: 'Emosi', A: 70, fullMark: 100 },
                          { subject: 'Bahasa', A: 45, fullMark: 100 },
                        ]}>
                          <PolarGrid stroke="#E5E7EB" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: "#6B8070", fontSize: 11, fontFamily: IPS }} />
                          <Radar name="Anak" dataKey="A" stroke="#8BB098" strokeWidth={2} fill="#8BB098" fillOpacity={0.4} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                      {[
                        { icon: <User size={16} color="#8BB098" />, label: "Kemandirian" },
                        { icon: <Star size={16} color="#D4A843" />, label: "Minat Bakat" },
                        { icon: <Users size={16} color="#8BB098" />, label: "Kemampuan Sosial" },
                        { icon: <PlayCircle size={16} color="#8BB098" />, label: "Kemampuan Motorik" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2" style={{ borderBottom: idx < 3 ? "1px solid #F3F4F6" : "none" }}>
                          <div className="flex items-center gap-2.5">
                            <div style={{ background: "#F1F5F2", padding: 5, borderRadius: 8 }}>{item.icon}</div>
                            <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{item.label}</span>
                          </div>
                          <ChevronRight size={15} color="#9CA3AF" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="px-1">
                    <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: "#2E3E35", marginBottom: 6, lineHeight: 1.25 }}>
                      Kembangkan Potensi<br />Secara Terarah
                    </h2>
                    <p style={{ fontSize: 12.5, color: "#5B7A68", lineHeight: 1.5, marginBottom: 14 }}>
                      Rekomendasi strategi belajar dan penyusunan Individual Development Plan (IDP) yang terarah.
                    </p>
                  </div>

                  {/* Card Strategi */}
                  <div style={{
                    background: "#FFF", borderRadius: 22, padding: "18px 16px",
                    boxShadow: "0 8px 24px rgba(91,122,104,0.08), 0 1px 3px rgba(0,0,0,0.03)",
                    border: "1px solid rgba(91,122,104,0.10)"
                  }}>
                    <h3 style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 700, color: "#2E3E35", marginBottom: 14 }}>Rekomendasi Pembelajaran</h3>

                    <div className="space-y-3">
                      {[
                        { icon: <TargetIcon size={19} color="#FFF" />, bg: "#D27D6B", title: "Strategi Belajar", desc: "Metode visual & kinestetik" },
                        { icon: <Video size={19} color="#FFF" />, bg: "#D27D6B", title: "Media Belajar", desc: "Video interaktif & alat bantu" },
                        { icon: <Calendar size={19} color="#FFF" />, bg: "#D27D6B", title: "Jadwal Rutin", desc: "3x seminggu, 30 menit" },
                        { icon: <User size={19} color="#FFF" />, bg: "#D27D6B", title: "IDP (Individual Development Plan)", desc: "Lihat rencana lengkap", isLink: true },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3.5 pb-2.5" style={{ borderBottom: idx < 3 ? "1px solid #F3F4F6" : "none" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: item.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 style={{ fontSize: 13, fontWeight: 600, color: "#2E3E35", fontFamily: PJS }}>{item.title}</h4>
                            <p style={{ fontSize: 11.5, color: "#6B8070", marginTop: 1 }}>{item.desc}</p>
                          </div>
                          {item.isLink && <ChevronRight size={16} color="#9CA3AF" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="px-1">
                    <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: "#2E3E35", marginBottom: 6, lineHeight: 1.25 }}>
                      Raih Prestasi,<br />Jelajahi Lebih Banyak Peluang
                    </h2>
                    <p style={{ fontSize: 12.5, color: "#5B7A68", lineHeight: 1.5, marginBottom: 14 }}>
                      Rekomendasi lomba resmi serta direktori pelatihan dan terapi sesuai minat anak.
                    </p>
                  </div>

                  {/* Card Lomba */}
                  <div style={{
                    background: "#FFF", borderRadius: 22, padding: "18px 16px",
                    boxShadow: "0 8px 24px rgba(91,122,104,0.08), 0 1px 3px rgba(0,0,0,0.03)",
                    border: "1px solid rgba(91,122,104,0.10)"
                  }}>
                    <div className="flex justify-between items-center mb-3">
                      <h3 style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 700, color: "#2E3E35", display: "flex", alignItems: "center", gap: 6 }}>
                        <Trophy size={18} color="#D4A843" /> Lomba & Kompetisi
                      </h3>
                      <span style={{ fontSize: 12, color: "#8BB098", fontWeight: 600 }}>Lihat Semua</span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { icon: "🏆", bg: "#FEF9EC", title: "Olimpiade Sains Nasional (OSN)", tag: "Sains", tagColor: "#3B82F6", tagBg: "#EFF6FF" },
                        { icon: "🎭", bg: "#FEF2F2", title: "Festival dan Lomba Seni Siswa Nasional (FLS2N)", tag: "Seni", tagColor: "#E8637A", tagBg: "#FDF2F8" },
                        { icon: "💻", bg: "#EFF6FF", title: "Lomba Kompetensi Siswa (LKS)", tag: "Vokasional", tagColor: "#1D4ED8", tagBg: "#EFF6FF" },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 pb-2.5" style={{ borderBottom: idx < 2 ? "1px solid #F3F4F6" : "none" }}>
                          <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: item.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>
                            {item.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 style={{ fontSize: 12.5, fontWeight: 600, color: "#2E3E35", fontFamily: PJS, lineHeight: 1.3, marginBottom: 3 }}>{item.title}</h4>
                            <span style={{ fontSize: 10.5, fontWeight: 600, color: item.tagColor, backgroundColor: item.tagBg, padding: "1.5px 7px", borderRadius: 4 }}>{item.tag}</span>
                          </div>
                          <ChevronRight size={16} color="#9CA3AF" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 5 && (
                <>
                  <div className="px-1">
                    <h2 style={{ fontFamily: PJS, fontSize: 20, fontWeight: 800, color: "#2E3E35", marginBottom: 6, lineHeight: 1.25 }}>
                      Pantau Perkembangan<br />Lebih Mudah
                    </h2>
                    <p style={{ fontSize: 12.5, color: "#5B7A68", lineHeight: 1.5, marginBottom: 14 }}>
                      Akses laporan perkembangan otomatis maupun manual untuk memantau kemajuan anak secara real-time.
                    </p>
                  </div>

                  {/* Card Laporan */}
                  <div style={{
                    background: "#FFF", borderRadius: 22, padding: "18px 16px",
                    boxShadow: "0 8px 24px rgba(91,122,104,0.08), 0 1px 3px rgba(0,0,0,0.03)",
                    border: "1px solid rgba(91,122,104,0.10)"
                  }}>
                    <h3 style={{ fontFamily: PJS, fontSize: 13.5, fontWeight: 700, color: "#2E3E35", display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
                      <CheckSquare size={18} color="#8BB098" /> Laporan Perkembangan
                    </h3>

                    <div style={{ background: "#F9FAFB", padding: "14px", borderRadius: 12, marginBottom: 14 }}>
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp size={16} color="#8BB098" />
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#4B5563" }}>Kemampuan Motorik</span>
                      </div>
                      <div style={{ height: 130, width: "100%", marginLeft: -20 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            { name: '1', val: 30 }, { name: '2', val: 40 },
                            { name: '3', val: 35 }, { name: '4', val: 50 },
                            { name: '5', val: 45 }, { name: '6', val: 60 },
                            { name: '7', val: 75 }
                          ]}>
                            <Line type="monotone" dataKey="val" stroke="#8BB098" strokeWidth={3} dot={{ r: 4, fill: "#8BB098", strokeWidth: 2, stroke: "#FFF" }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-3 flex items-center gap-1.5">
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981" }}>↑</span>
                        <span style={{ fontSize: 11.5, color: "#4B5563", fontWeight: 500 }}>Meningkat 12% dari periode sebelumnya</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between" style={{ background: "#FEF2F2", padding: "10px 14px", borderRadius: 12 }}>
                      <div className="flex items-center gap-2.5">
                        <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#FCA5A5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Calendar size={18} color="#FFF" />
                        </div>
                        <div>
                          <h4 style={{ fontSize: 12.5, fontWeight: 600, color: "#2E3E35", fontFamily: PJS }}>Laporan Mingguan</h4>
                          <p style={{ fontSize: 11, color: "#6B8070" }}>12 Agustus 2026</p>
                        </div>
                      </div>
                      <Download size={18} color="#6B8070" />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FOOTER NAV */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-20 flex justify-between items-center pointer-events-none" style={{ background: "transparent" }}>
              <div style={{ width: 50 }}>
                {step > 1 && (
                  <button
                    onClick={goPrev}
                    className="active:scale-90 transition-transform flex items-center justify-center pointer-events-auto"
                    style={{
                      width: 44, height: 44, borderRadius: "50%",
                      background: "#FFFFFF", border: "1.5px solid rgba(91,122,104,0.20)",
                      color: "#2E3E35", cursor: "pointer",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)"
                    }}
                    title="Sebelumnya"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
              </div>
              <div className="flex gap-2 items-center justify-center pointer-events-auto">
                {[2, 3, 4, 5].map(i => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    style={{
                      width: step === i ? 24 : 8,
                      height: 8,
                      borderRadius: 4,
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      backgroundColor: step === i ? "#8BB098" : "#D4E8DA",
                      transition: "width 0.3s ease, background-color 0.3s ease"
                    }}
                    title={`Slide ${i - 1}`}
                  />
                ))}
              </div>
              <button
                onClick={goNext}
                className="active:scale-95 transition-transform flex justify-center items-center pointer-events-auto"
                style={{
                  width: 50, height: 50, background: "#D27D6B", color: "#FFF", borderRadius: "50%",
                  border: "none", cursor: "pointer",
                  boxShadow: "0 8px 16px rgba(210,125,107,0.4)"
                }}
                title={step === 5 ? "Selesai" : "Berikutnya"}
              >
                <MoveRight size={22} strokeWidth={2.5} />
              </button>
            </div>

            {/* Background Ornamen Daun untuk Halaman 2-5 */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%", pointerEvents: "none", zIndex: 0, opacity: 0.8 }}>
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
        )}
      </AnimatePresence>
    </div>
  );
}
