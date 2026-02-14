"use client";

import * as React from "react";
import { A, Presence, Stagger } from "@vercel/animal/react";

function DemoCard({
  label,
  token,
  children,
}: {
  label: string;
  token: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03]">
      <p className="text-xs font-medium text-black/70 dark:text-white/70">{label}</p>
      <div className="flex min-h-[120px] items-center justify-center">{children}</div>
      <code className="self-start rounded-lg bg-black/5 px-2.5 py-1.5 font-mono text-[11px] text-black/50 dark:bg-white/10 dark:text-white/50">
        {token}
      </code>
    </div>
  );
}

function PresenceDemo() {
  const [open, setOpen] = React.useState(true);

  return (
    <DemoCard label="Presence" token='an="enter:fade-up exit:fade-down"'>
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-16 w-16">
          <Presence present={open}>
            <A.div
              an="enter:fade-up exit:fade-down duration-300 ease-spring-snappy"
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80"
            />
          </Presence>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-7 rounded-md border border-black/10 bg-black/5 px-3 text-[11px] font-medium text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
        >
          {open ? "Exit" : "Enter"}
        </button>
      </div>
    </DemoCard>
  );
}

function InteractionDemo() {
  return (
    <DemoCard label="Hover + Press" token='an="hover:grow press:compress"'>
      <A.button
        an="hover:grow press:compress duration-180 ease-out"
        className="h-16 w-16 rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:from-white dark:to-white/80 dark:focus-visible:ring-white/30"
        type="button"
        aria-label="Interactive demo"
      />
    </DemoCard>
  );
}

function BounceDemo() {
  const [nonce, setNonce] = React.useState(0);

  return (
    <DemoCard label="Keyframe" token='an="enter:bounce-in"'>
      <div className="flex flex-col items-center gap-3">
        <A.div
          key={nonce}
          an="enter:bounce-in"
          className="h-16 w-16 rounded-2xl bg-gradient-to-br from-black to-black/80 shadow-lg dark:from-white dark:to-white/80"
        />
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="h-7 rounded-md border border-black/10 bg-black/5 px-3 text-[11px] font-medium text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
        >
          Replay
        </button>
      </div>
    </DemoCard>
  );
}

function StaggerDemo() {
  const [nonce, setNonce] = React.useState(0);

  return (
    <DemoCard label="Stagger" token='<Stagger stagger={60}>'>
      <div className="flex flex-col items-center gap-3">
        <Stagger stagger={60} key={nonce}>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((i) => (
              <A.div
                key={i}
                an="enter:fade-up ease-spring-snappy"
                className="h-10 w-10 rounded-xl bg-gradient-to-br from-black to-black/80 shadow-md dark:from-white dark:to-white/80"
              />
            ))}
          </div>
        </Stagger>
        <button
          type="button"
          onClick={() => setNonce((n) => n + 1)}
          className="h-7 rounded-md border border-black/10 bg-black/5 px-3 text-[11px] font-medium text-black/60 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10"
        >
          Replay
        </button>
      </div>
    </DemoCard>
  );
}

export function Demo() {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <p className="text-sm font-medium text-black/80 dark:text-white/80">Try it</p>
        <p className="text-sm text-black/60 dark:text-white/60">
          Interactive demos powered by preset tokens. Hover, click, and toggle.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PresenceDemo />
        <InteractionDemo />
        <BounceDemo />
        <StaggerDemo />
      </div>
    </section>
  );
}
