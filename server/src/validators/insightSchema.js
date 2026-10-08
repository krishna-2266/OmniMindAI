import { z } from 'zod';

export const InsightFindingSchema = z.object({
  finding: z.string(),
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO']).default('MEDIUM'),
  sources: z.array(z.string()).default([])
});

export const CrossModalConnectionSchema = z.object({
  insight: z.string(),
  explanation: z.string(),
  modalities: z.array(z.string()).default([])
});

export const ContradictionSchema = z.object({
  issue: z.string(),
  sourceA: z.string(),
  sourceB: z.string(),
  reconciliation: z.string().default('')
});

export const SourceStatusSchema = z.object({
  name: z.string(),
  type: z.string(),
  status: z.enum(['corroborated', 'contradicted', 'unverified', 'supporting']).default('supporting')
});

export const AiInsightSchema = z.object({
  summary: z.string().min(10),
  keyFindings: z.array(InsightFindingSchema).default([]),
  crossModalConnections: z.array(CrossModalConnectionSchema).default([]),
  contradictions: z.array(ContradictionSchema).default([]),
  risks: z.array(z.string()).default([]),
  recommendations: z.array(z.string()).default([]),
  sources: z.array(SourceStatusSchema).default([])
});

export default AiInsightSchema;

