import { agentById, localize } from '@/data';
import type { SquadResult, SquadSlot } from '@/types/squad';
import type { Lang } from '@/types/valorant';

interface FormatSquadShareTextParams {
  slots: readonly SquadSlot[];
  result: SquadResult | null;
  shareUrl: string;
  lang: Lang;
}

function formatResultLines(
  result: SquadResult,
  slots: readonly SquadSlot[],
  lang: Lang,
): string[] {
  const isVi = lang === 'vi';
  return slots.map((slot, idx) => {
    const fallbackName = isVi ? `Người chơi ${idx + 1}` : `Player ${idx + 1}`;
    const playerName = slot.name.trim() || fallbackName;
    const assignedAgent = result.bySlot[slot.id];
    if (!assignedAgent) {
      return `${idx + 1}. ${playerName} — Role: ${slot.role}`;
    }
    const agentName = localize(assignedAgent.displayName, lang);
    const roleName = localize(assignedAgent.roleName, lang);
    const lockBadge = slot.lockedAgentId ? ' 🔒' : '';
    return `${idx + 1}. ${playerName} ➔ ${agentName} (${roleName})${lockBadge}`;
  });
}

function formatConfigLines(slots: readonly SquadSlot[], lang: Lang): string[] {
  const isVi = lang === 'vi';
  return slots.map((slot, idx) => {
    const fallbackName = isVi ? `Người chơi ${idx + 1}` : `Player ${idx + 1}`;
    const playerName = slot.name.trim() || fallbackName;
    const lockedAgent = slot.lockedAgentId ? agentById.get(slot.lockedAgentId) : undefined;
    const lockedText = lockedAgent ? ` [🔒 ${localize(lockedAgent.displayName, lang)}]` : '';
    return `${idx + 1}. ${playerName} — Role: ${slot.role}${lockedText}`;
  });
}

export function formatSquadShareText({
  slots,
  result,
  shareUrl,
  lang,
}: FormatSquadShareTextParams): string {
  const isVi = lang === 'vi';
  const title = isVi
    ? '🎮 VALORANDOM — Đội hình 5 người'
    : '🎮 VALORANDOM — 5-Player Squad';

  const bodyLines = result ? formatResultLines(result, slots, lang) : formatConfigLines(slots, lang);

  return [title, ...bodyLines, '', `🔗 ${shareUrl}`].join('\n');
}
