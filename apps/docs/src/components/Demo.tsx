"use client";

import * as React from "react";
import { A, Presence, Stagger } from "@vercel/animal/react";
import { RefreshCw } from "@geist-ui/icons";
import { CopyButton } from "./CopyButton";

function DemoCard({
  label,
  token,
  action,
  children,
}: {
  label: string;
  token: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-black/10 p-5 dark:border-white/10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-black/55 dark:text-white/55">
          {label}
        </p>
        {action}
      </div>
      <div className="flex min-h-[120px] items-center justify-center">{children}</div>
      <div className="flex items-center gap-2">
        <code className="rounded-md border border-black/10 px-2.5 py-1.5 font-mono text-[11px] text-black/55 dark:border-white/10 dark:text-white/55">
          {token}
        </code>
        <CopyButton text={token} />
      </div>
    </div>
  );
}

function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-7 items-center gap-1.5 rounded-md border border-black/10 px-3 text-[11px] font-medium text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5"
    >
      <RefreshCw size={12} aria-hidden="true" />
      Replay
    </button>
  );
}

function PresenceDemo() {
  const [open, setOpen] = React.useState(true);

  return (
    <DemoCard
      label="Presence"
      token='an="enter:fade-up exit:fade-down"'
      action={
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="h-7 rounded-md border border-black/10 px-3 text-[11px] font-medium text-black/60 hover:bg-black/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5"
        >
          {open ? "Exit" : "Enter"}
        </button>
      }
    >
      <div className="relative h-16 w-16">
        <Presence present={open}>
          <A.div
            an="enter:fade-up exit:fade-down duration-400 ease-spring-snappy y-28"
            className="absolute inset-0 rounded-xl border border-black/10 bg-black/90 dark:border-white/20 dark:bg-white/90"
          />
        </Presence>
      </div>
    </DemoCard>
  );
}

function InteractionDemo() {
  return (
    <DemoCard label="Hover + Press" token='an="hover:grow press:compress"'>
      <A.button
        an="hover:grow press:compress duration-200 ease-out hover:scale-1.12 press:scale-0.88"
        className="h-16 w-16 rounded-xl border border-black/10 bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/30 dark:border-white/20 dark:bg-white/90 dark:focus-visible:ring-white/30"
        type="button"
        aria-label="Interactive demo"
      />
    </DemoCard>
  );
}

function BounceDemo() {
  const [nonce, setNonce] = React.useState(0);

  return (
    <DemoCard
      label="Keyframe"
      token='an="enter:bounce-in"'
      action={<ReplayButton onClick={() => setNonce((n) => n + 1)} />}
    >
      <A.div
        key={nonce}
        an="enter:bounce-in y-32"
        className="h-16 w-16 rounded-xl border border-black/10 bg-black/90 dark:border-white/20 dark:bg-white/90"
      />
    </DemoCard>
  );
}

function StaggerDemo() {
  const [nonce, setNonce] = React.useState(0);

  return (
    <DemoCard
      label="Stagger"
      token="<Stagger stagger={60}>"
      action={<ReplayButton onClick={() => setNonce((n) => n + 1)} />}
    >
      <Stagger stagger={60} key={nonce}>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <A.div
              key={i}
              an="enter:fade-up ease-spring-snappy y-24"
              className="h-10 w-10 rounded-lg border border-black/10 bg-black/90 dark:border-white/20 dark:bg-white/90"
            />
          ))}
        </div>
      </Stagger>
    </DemoCard>
  );
}

function SlideDemo() {
  const [nonce, setNonce] = React.useState(0);

  return (
    <DemoCard
      label="Slide"
      token='an="enter:slide-left"'
      action={<ReplayButton onClick={() => setNonce((n) => n + 1)} />}
    >
      <A.div
        key={nonce}
        an="enter:slide-left x-40 ease-spring-snappy"
        className="h-16 w-16 rounded-xl border border-black/10 bg-black/90 dark:border-white/20 dark:bg-white/90"
      />
    </DemoCard>
  );
}

function PopDemo() {
  const [nonce, setNonce] = React.useState(0);

  return (
    <DemoCard
      label="Pop"
      token='an="enter:pop"'
      action={<ReplayButton onClick={() => setNonce((n) => n + 1)} />}
    >
      <A.div
        key={nonce}
        an="enter:pop ease-spring-bouncy"
        className="h-16 w-16 rounded-xl border border-black/10 bg-black/90 dark:border-white/20 dark:bg-white/90"
      />
    </DemoCard>
  );
}

function DropInDemo() {
  const [nonce, setNonce] = React.useState(0);

  return (
    <DemoCard
      label="Drop In"
      token='an="enter:drop-in"'
      action={<ReplayButton onClick={() => setNonce((n) => n + 1)} />}
    >
      <A.div
        key={nonce}
        an="enter:drop-in y-40"
        className="h-16 w-16 rounded-xl border border-black/10 bg-black/90 dark:border-white/20 dark:bg-white/90"
      />
    </DemoCard>
  );
}

function ElasticDemo() {
  const [nonce, setNonce] = React.useState(0);

  return (
    <DemoCard
      label="Elastic"
      token='an="enter:elastic-scale"'
      action={<ReplayButton onClick={() => setNonce((n) => n + 1)} />}
    >
      <A.div
        key={nonce}
        an="enter:elastic-scale"
        className="h-16 w-16 rounded-xl border border-black/10 bg-black/90 dark:border-white/20 dark:bg-white/90"
      />
    </DemoCard>
  );
}

export function Demo() {
  return (
    <section className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-black/45 dark:text-white/45">
          In action
        </p>
        <p className="mt-4 text-sm leading-6 text-black/60 dark:text-white/60">
          Hover, click, and toggle. Every behavior below is still one token string.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <PresenceDemo />
        <InteractionDemo />
        <BounceDemo />
        <StaggerDemo />
        <SlideDemo />
        <PopDemo />
        <DropInDemo />
        <ElasticDemo />
      </div>
    </section>
  );
}
