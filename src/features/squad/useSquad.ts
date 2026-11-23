import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { agentById, agents } from '@/data';
import { createDefaultRng } from '@/features/random/rng';
import {
  playConfirmSignal,
  playErrorSignal,
  playLockSignal,
  playUiClick,
} from '@/lib/audio/tacticalSound';
import { copyToClipboard } from '@/lib/clipboard';
import { useI18n } from '@/lib/i18n';
import { decodeShareState, encodeShareState } from '@/lib/shareLink';
import type { SquadResult, SquadRole } from '@/types/squad';
import { getMissingRoles, resolveSlotDisplay } from './slotDisplay';
import { getSquadErrorMessage } from './squadErrorHelper';
import { squadRandom } from './squadRandom';
import { initialSquadState, squadReducer } from './squadReducer';
import { formatSquadShareText } from './squadShareText';
import { useSquadRoll } from './useSquadRoll';

export function useSquad() {
  const { lang, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, dispatch] = useReducer(squadReducer, initialSquadState);
  const { rollingBySlot, isRolling, startRoll, cancelRoll } = useSquadRoll();

  const [result, setResult] = useState<SquadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const shareParam = searchParams.get('s');
    if (!shareParam) return;
    const decoded = decodeShareState(shareParam, agentById);
    if (decoded.ok) {
      dispatch({ type: 'HYDRATE', slots: decoded.slots });
      if (decoded.warnings.length > 0) setWarningMessage(t('squad.lockedWarning'));
    } else {
      setErrorMessage(t('squad.error.invalidLink'));
    }
  }, [searchParams, t]);

  const allLocked = useMemo(() => {
    return state.slots.length > 0 && state.slots.every((s) => Boolean(s.lockedAgentId));
  }, [state.slots]);

  const allLockedAgentIds = useMemo(() => {
    return state.slots.map((s) => s.lockedAgentId).filter((id): id is string => Boolean(id));
  }, [state.slots]);

  const slotDisplays = useMemo(() => {
    return state.slots.map((slot) =>
      resolveSlotDisplay({
        slot,
        result,
        rollingBySlot,
        lockedAgentIds: allLockedAgentIds,
        agentLookup: agentById,
      }),
    );
  }, [state.slots, result, rollingBySlot, allLockedAgentIds]);

  const missingRoles = useMemo(() => getMissingRoles(result), [result]);

  const randomize = useCallback(() => {
    if (allLocked || isRolling) return;
    try {
      const rng = createDefaultRng();
      const res = squadRandom({ slots: state.slots, pool: agents, rng });
      setErrorMessage(null);
      startRoll(state.slots, () => {
        setResult(res);
        dispatch({ type: 'SET_RESULT', result: res });
      });
    } catch (err) {
      playErrorSignal();
      setErrorMessage(getSquadErrorMessage(err, t));
      setResult(null);
      dispatch({ type: 'SET_RESULT', result: null });
    }
  }, [allLocked, isRolling, state.slots, startRoll, t]);

  const shareSquad = useCallback(async () => {
    try {
      const code = encodeShareState(state.slots);
      setSearchParams({ s: code }, { replace: true });
      const text = formatSquadShareText({ slots: state.slots, result, lang });
      const ok = await copyToClipboard(text);
      if (ok) {
        playConfirmSignal();
        setToastMessage(t('squad.copied'));
        if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
        toastTimerRef.current = setTimeout(() => setToastMessage(null), 3000);
      } else {
        playErrorSignal();
        setErrorMessage(t('squad.error.copyFailed'));
      }
    } catch {
      playErrorSignal();
      setErrorMessage(t('squad.error.unknown'));
    }
  }, [state.slots, result, lang, setSearchParams, t]);

  const updateName = useCallback((id: string, name: string) => {
    dispatch({ type: 'SET_NAME', id, name });
  }, []);

  const updateRole = useCallback(
    (id: string, role: SquadRole) => {
      cancelRoll();
      playUiClick();
      dispatch({ type: 'SET_ROLE', id, role });
    },
    [cancelRoll],
  );

  const lockAgent = useCallback(
    (id: string, agentId: string) => {
      cancelRoll();
      playLockSignal(true);
      dispatch({ type: 'LOCK_AGENT', id, agentId });
    },
    [cancelRoll],
  );

  const unlockAgent = useCallback(
    (id: string) => {
      cancelRoll();
      playLockSignal(false);
      dispatch({ type: 'UNLOCK_AGENT', id });
    },
    [cancelRoll],
  );

  const addSlot = useCallback(() => {
    cancelRoll();
    playUiClick();
    dispatch({ type: 'ADD_SLOT' });
  }, [cancelRoll]);

  const removeSlot = useCallback(
    (id: string) => {
      cancelRoll();
      playUiClick();
      dispatch({ type: 'REMOVE_SLOT', id });
    },
    [cancelRoll],
  );

  const resetSquad = useCallback(() => {
    cancelRoll();
    playUiClick();
    dispatch({ type: 'RESET' });
    setResult(null);
    setErrorMessage(null);
    setWarningMessage(null);
    setSearchParams({}, { replace: true });
  }, [cancelRoll, setSearchParams]);

  return {
    slots: state.slots,
    slotDisplays,
    result,
    missingRoles,
    isRolling,
    errorMessage,
    warningMessage,
    toastMessage,
    allLocked,
    allLockedAgentIds,
    canAddSlot: state.slots.length < 5,
    canRemoveSlot: state.slots.length > 1,
    randomize,
    shareSquad,
    updateName,
    updateRole,
    lockAgent,
    unlockAgent,
    addSlot,
    removeSlot,
    resetSquad,
  };
}
