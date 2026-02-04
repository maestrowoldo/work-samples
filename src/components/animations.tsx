"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
}: FadeInProps) {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: -20 },
    right: { x: 20 },
  };

  const initialValues = {
    opacity: 0,
    ...directions[direction],
  };

  return (
    <motion.div
      initial={initialValues}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  staggerDelay?: number;
}

export function StaggerContainer({
  children,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

interface CountUpProps {
  value: number;
  duration?: number;
  suffix?: string;
}

export function CountUp({ value, duration = 2, suffix = "" }: CountUpProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        className="inline-block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
      >
        {value}
        {suffix}
      </motion.span>
    </motion.div>
  );
}
