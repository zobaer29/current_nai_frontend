import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { dismissToast } from '../store/outageSlice';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userFeedbackToast } = useSelector((state: RootState) => state.outage);

  useEffect(() => {
    if (userFeedbackToast) {
      const timer = setTimeout(() => {
        dispatch(dismissToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [userFeedbackToast, dispatch]);

  if (!userFeedbackToast) return null;

  const isOff = userFeedbackToast.type === 'off';

  return (
    <div className="fixed bottom-6 right-6 z-[999] max-w-md animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 ${
          isOff
            ? 'bg-red-950/90 border-red-500/50 text-red-100 shadow-red-500/20'
            : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-500/20'
        }`}
      >
        <div className="flex items-center gap-3">
          {isOff ? (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 animate-bounce" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{userFeedbackToast.message}</span>
        </div>
        <button
          onClick={() => dispatch(dismissToast())}
          className="p-1 hover:bg-slate-800/50 rounded-lg text-slate-300 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
