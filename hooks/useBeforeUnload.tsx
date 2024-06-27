import { useEffect } from "react"
import { ISessionInfo } from '@/types/bookingTicket';

interface Props {
	shouldPreventUnload: boolean;
	message?: string;
	sessionInfo: ISessionInfo;
	ignoreSession: (sessionInfo: ISessionInfo)=> Promise<void>;
}
// NOTE: although there is a message argument, you really should not be relying on it, as most, if not all, modern browsers completely ignore it anyways
const useBeforeUnload = ({shouldPreventUnload, message, sessionInfo, ignoreSession}: Props) => {
  useEffect(() => {
    const abortController = new AbortController()

    if (shouldPreventUnload)
      window.addEventListener('beforeunload', async (ev) => {
        ev.preventDefault()
				await ignoreSession(sessionInfo);
      }, { capture: true, signal: abortController.signal })

    return () => abortController.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldPreventUnload, message])
}

export default useBeforeUnload