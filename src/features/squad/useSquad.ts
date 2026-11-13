import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { agentById, agents } from '@/data';
import { createDefaultRng } from '@/features/random/rng';
import { useI18n } from '@/lib/i18n';
import { decodeShareState, encodeShareState } from '@/lib/shareLink';
import type { SquadResult, SquadRole } from '@/types/squad';
import { getSquadErrorMessage } from './squadErrorHelper';
import { squadRandom } from './squadRandom';
import { initialSquadState, squadReducer } from './squadReducer';

export function useSquad() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, dispatch] = useReducer(squadReducer, initialSquadState);

  const [result, setResult] = useState<SquadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const shareParam = searchParams.get('s');
    if (!shareParam) return;

    const decoded = decodeShareState(shareParam, agentById);
    if (decoded.ok) {
      dispatch({ type: 'HYDRATE', slots: decoded.slots });
      if (decoded.warnings.length > 0) {
        setWarningMessage(t('squad.lockedWarning'));
      }
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

  const randomize = useCallback(() => {
    if (allLocked) return;
    try {
      const rng = createDefaultRng();
      const res = squadRandom({ slots: state.slots, pool: agents, rng });
      setResult(res);
      dispatch({ type: 'SET_RESULT', result: res });
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(getSquadErrorMessage(err, t));
      setResult(null);
      dispatch({ type: 'SET_RESULT', result: null });
    }
  }, [allLocked, state.slots, t]);

  const shareSquad = useCallback(async () => {
    try {
      const code = encodeShareState(state.slots);
      setSearchParams({ s: code }, { replace: true });
      const url = `${window.location.origin}${window.location.pathname}#/squad?s=${code}`;
      await navigator.clipboard.writeText(url);
      setToastMessage(t('squad.copied'));
      setTimeout(() => setToastMessage(null), 3000);
    } catch {
      setErrorMessage(t('squad.error.unknown'));
    }
  }, [state.slots, setSearchParams, t]);

  const updateName = useCallback((id: string, name: string) => {
    dispatch({ type: 'SET_NAME', id, name });
  }, []);

  const updateRole = useCallback((id: string, role: SquadRole) => {
    dispatch({ type: 'SET_ROLE', id, role });
  }, []);

  const lockAgent = useCallback((id: string, agentId: string) => {
    dispatch({ type: 'LOCK_AGENT', id, agentId });
  }, []);

  const unlockAgent = useCallback((id: string) => {
    dispatch({ type: 'UNLOCK_AGENT', id });
  }, []);

  const addSlot = useCallback(() => {
    dispatch({ type: 'ADD_SLOT' });
  }, []);

  const removeSlot = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_SLOT', id });
  }, []);

  const resetSquad = useCallback(() => {
    dispatch({ type: 'RESET' });
    setResult(null);
    setErrorMessage(null);
    setWarningMessage(null);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    slots: state.slots,
    result,
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
