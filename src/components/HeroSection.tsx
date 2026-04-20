"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";

const TITLES = ["Mobile Developer", "Flutter Developer", "Android Developer", "Problem Solver"];

interface TechDetail {
  project: string;
  period: string;
  implemented: string;
  solved: string;
  metric?: string;
}

const TECH_DETAILS: Record<string, TechDetail> = {
  Flutter: {
    project: "H-PASS · 서울시 교육청 동호회 앱",
    period: "2024.12 ~ 2025.06",
    implemented:
      "flutter_blue_plus 기반 BLE 스캔·연결·GATT 통신 모듈화. Isolate + Stream 구조로 BLE 데이터 비동기 처리하여 UI 지연 제거. 사용자 일정(Time/Floor) + BLE 신호(RSSI/Distance) 기반 자동 호출 알고리즘 설계.",
    solved:
      "백그라운드에서 BLE 호출이 누락되는 문제를 플랫폼별 OS 제약 분석을 통해 해결. iOS는 Service UUID 필터링 기반 스캔 이벤트 트리거로 앱 복원 구조 설계.",
    metric: "호출 성공률 95%+ · 호출 시간 3.5초 → 1.5초",
  },
  Android: {
    project: "safeT · 자율주행 차량 안전관리자 앱",
    period: "2025.04 ~ 2026.03",
    implemented:
      "MVVM 아키텍처 적용 및 ViewModel(지도/네비/미니맵/일정) 분리로 상태 관리 구조 개선. C3 맵 좌표 기반 경로 데이터를 지도 레이어에 직접 렌더링하여 지도 미지원 구간에서도 내비게이션 구현.",
    solved:
      "Fragment 종료 후에도 WebSocket이 유지되며 발생하는 중복 이벤트 및 상태 불일치 문제를 Bound Service + Messenger IPC 구조로 분리하여 해결.",
    metric: "배차 조회 API 응답 4초 → 0.05초 (98.75% 단축)",
  },
  Kotlin: {
    project: "safeT · 자율주행 차량 안전관리자 앱",
    period: "2025.04 ~ 2026.03",
    implemented:
      "WebSocket Lifecycle 관리 구조 설계 및 통신 로직 개선. UTM 위경도 좌표 변환 유틸 구현으로 자율주행 맵 좌표와 지도 SDK 간 데이터 정합성 확보.",
    solved:
      "UI 생명주기에 종속되던 WebSocket을 리팩토링하여 Bound Service + Messenger IPC 구조로 분리. 연결·송수신·종료 전 과정을 추적하는 Lifecycle 관리 로직으로 디버깅 구조 개선.",
  },
  BLE: {
    project: "H-PASS · 엘리베이터 자동 호출 서비스",
    period: "2024.12 ~ 2025.06",
    implemented:
      "Advertising Packet(ServiceData) 바이트 파싱으로 비연결 상태에서도 장치 식별 구현. Jitter 기반 Retry 로직으로 다중 호출 타이밍을 분산하여 통신 충돌 제거.",
    solved:
      "iOS 백그라운드에서 BLE 스캔이 중단되어 호출이 누락되는 문제를 분석. Android는 Foreground Service, iOS는 Service UUID 필터 기반 트리거 구조로 플랫폼별 최적 설계 적용.",
    metric: "iOS 백그라운드 호출 성공률 95%+ 확보",
  },
  WebSocket: {
    project: "safeT · 자율주행 차량 안전관리자 앱",
    period: "2025.04 ~ 2026.03",
    implemented:
      "WebSocket을 Bound Service로 분리하고 UI와 통신을 명확히 분리하여 생명주기 관리 구조 개선. 패킷 로깅 및 데이터 흐름 시각화로 HW/Backend 간 책임 구분 명확화.",
    solved:
      "WebSocket 통신 상태가 불명확해 현장에서 발생하는 문제 원인 파악이 어려웠던 문제를 해결. 연결·송수신·종료 전 과정을 추적하는 Lifecycle 관리 로직과 네트워크·서버·Apollo 로그 분석 구조 정립.",
    metric: "앱 단 중복 요청 문제 + DB 쿼리 성능 문제 각각 분리 개선",
  },
  RxJava3: {
    project: "safeT · 자율주행 차량 안전관리자 앱",
    period: "2025.04 ~ 2026.03",
    implemented:
      "Debounce / ThrottleFirst 연산자 적용으로 차량 상태 요청 빈도를 제어. 중복 패킷 및 무한 로딩 제거, 응답 안정성 개선.",
    solved:
      "차량 상태 요청이 중복으로 발생하여 BLE 통신 병목 및 응답 지연이 생기는 문제를 RxJava3 기반 트래픽 제어 로직으로 해결.",
  },
  "Node.js": {
    project: "서울시 교육청 동호회 관리 서비스",
    period: "2025.05 ~ 2025.07",
    implemented:
      "약 300명 임직원 대상 동호회 관리 서비스의 백엔드 API 개발. 사용자 인증 기반 접근 제어 설계 및 동호회 조회·가입·신청 상태 관리 API 구현.",
    solved:
      "오프라인 수기 문서 기반이던 동호회 관리 프로세스를 웹·모바일 환경으로 전환.",
    metric: "동호회 참여율 약 20% 향상",
  },
  MySQL: {
    project: "safeT · 자율주행 차량 안전관리자 앱",
    period: "2025.04 ~ 2026.03",
    implemented:
      "상관 서브쿼리 구조를 JOIN 기반으로 리팩토링하여 반복 실행 제거. carseq 필터 조건 추가로 불필요한 전체 스캔 방지.",
    solved:
      "배차 조회 API 응답이 4초 이상 걸리던 성능 저하 문제를 쿼리 구조 분석으로 근본 원인을 찾아 개선.",
    metric: "응답 시간 4초 → 0.05초 (약 98.75% 개선)",
  },
  SQLD: {
    project: "자격증",
    period: "2025.12 취득",
    implemented: "SQL 개발자(SQLD) 자격 취득. 데이터 모델링, SQL 최적화, 관계형 DB 설계 역량 보유.",
    solved: "safeT 프로젝트에서 실무 쿼리 최적화(98.75% 성능 개선)에 직접 적용.",
  },
};

export default function HeroSection() {
  const [titleIdx, setTitleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = TITLES[titleIdx];
    if (!deleting && displayed.length < target.length) {
      const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === target.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 50);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setTitleIdx((i) => (i + 1) % TITLES.length);
    }
  }, [displayed, deleting, titleIdx]);

  // ESC 키로 닫기
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedTech(null);
    };
    if (selectedTech) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [selectedTech]);

  const detail = selectedTech ? TECH_DETAILS[selectedTech] : null;

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
      {/* Dialog overlay */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(15,23,42,0.35)", backdropFilter: "blur(4px)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedTech(null);
          }}
        >
          <div
            ref={dialogRef}
            className="w-full max-w-lg rounded-3xl p-7"
            style={{
              background: "rgba(255,255,255,0.97)",
              border: "1px solid rgba(124,58,237,0.15)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(124,58,237,0.1)",
            }}
          >
            {/* Dialog header */}
            <div className="flex items-center justify-between mb-5">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  color: "#7c3aed",
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                }}
              >
                {selectedTech}
              </span>
              <button
                onClick={() => setSelectedTech(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center transition-colors hover:bg-slate-100"
              >
                <X size={14} style={{ color: "#94a3b8" }} />
              </button>
            </div>
            <div className="mb-4 text-left">
              <p className="text-base font-semibold" style={{ color: "#0f172a" }}>
                {detail.project}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{detail.period}</p>
            </div>

            {/* Metric highlight */}
            {detail.metric && (
              <div
                className="mb-4 px-4 py-2.5 rounded-2xl text-sm font-semibold"
                style={{
                  color: "#7c3aed",
                  background: "rgba(124,58,237,0.06)",
                  border: "1px solid rgba(124,58,237,0.12)",
                }}
              >
                {detail.metric}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#7c3aed" }}>
                  구현
                </p>
                <p className="text-sm leading-relaxed text-left" style={{ color: "#475569" }}>
                  {detail.implemented}
                </p>
              </div>
              <div className="h-px" style={{ background: "#f1f5f9" }} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: "#7c3aed" }}>
                  문제 해결
                </p>
                <p className="text-sm leading-relaxed text-left" style={{ color: "#475569" }}>
                  {detail.solved}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="relative max-w-2xl w-full rounded-3xl px-10 py-14"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow:
            "0 4px 6px rgba(0,0,0,0.03), 0 20px 60px rgba(124,58,237,0.08), 0 1px 0 rgba(255,255,255,0.9) inset",
        }}
      >
        {/* Top label */}
        <p
          className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase mb-6 px-3 py-1.5 rounded-full"
          style={{
            color: "#7c3aed",
            background: "rgba(124,58,237,0.08)",
            border: "1px solid rgba(124,58,237,0.15)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#7c3aed" }}
          />
          재직중 · ㈜ 에스더블유엠
        </p>

        {/* Name */}
        <h1
          className="text-5xl md:text-6xl font-bold mb-3 leading-tight"
          style={{ color: "#0f172a" }}
        >
          Hi, I&apos;m{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Doyun
          </span>
        </h1>

        {/* Typing subtitle */}
        <h2
          className="text-xl md:text-2xl font-medium mb-6 h-9"
          style={{ color: "#64748b" }}
        >
          <span style={{ color: "#7c3aed" }}>{displayed}</span>
          <span className="animate-pulse" style={{ color: "#7c3aed", opacity: 0.7 }}>
            |
          </span>
        </h2>

        {/* Description */}
        <p
          className="text-base max-w-md mx-auto leading-relaxed mb-10"
          style={{ color: "#64748b" }}
        >
          보이지 않는 문제의 원인을 끝까지 추적해 해결하는 개발자입니다.
          BLE·WebSocket 등 복잡한 통신 환경에서의 문제 해결을 즐깁니다.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          <a
            href="https://petite-charger-676.notion.site/App-200d398acdf643cd945e00b63689f8d8?pvs=4"
            target="_blank"
            rel="noopener noreferrer"
            className="px-7 py-2.5 rounded-full font-semibold text-white text-sm transition-all duration-200 hover:scale-[1.03] hover:shadow-lg"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              boxShadow: "0 4px 14px rgba(124,58,237,0.35)",
            }}
          >
            포트폴리오 보기
          </a>
          <button
            className="px-7 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 hover:scale-[1.03]"
            style={{
              color: "#7c3aed",
              border: "1px solid rgba(124,58,237,0.3)",
              background: "rgba(124,58,237,0.05)",
            }}
          >
            AI에게 물어보기 ↓
          </button>
        </div>

        {/* Tech stack badges */}
        <p className="text-xs mb-3" style={{ color: "#94a3b8" }}>
          기술 스택을 클릭하면 관련 프로젝트를 확인할 수 있어요
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {Object.keys(TECH_DETAILS).map((tech) => {
            const isSelected = selectedTech === tech;
            return (
              <button
                key={tech}
                onClick={() => setSelectedTech(isSelected ? null : tech)}
                className="px-3 py-1 text-xs font-medium rounded-full transition-all duration-200 hover:scale-105"
                style={{
                  color: isSelected ? "#7c3aed" : "#475569",
                  background: isSelected ? "rgba(124,58,237,0.1)" : "#f1f5f9",
                  border: isSelected
                    ? "1px solid rgba(124,58,237,0.4)"
                    : "1px solid #e2e8f0",
                  boxShadow: isSelected ? "0 0 0 3px rgba(124,58,237,0.1)" : "none",
                }}
              >
                {tech}
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
