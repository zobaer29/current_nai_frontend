import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { clearToast } from '../store/outageSlice';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notificationToast } = useSelector((state: RootState) => state.outage);

  useEffect(() => {
    if (notificationToast) {
      const timer = setTimeout(() => {
        dispatch(clearToast());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notificationToast, dispatch]);

  if (!notificationToast) return null;

  const isError = notificationToast.type === 'error';
  const isSuccess = notificationToast.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-[999] max-w-md animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 ${
          isError
            ? 'bg-red-950/90 border-red-500/50 text-red-100 shadow-red-500/20'
            : isSuccess
            ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100 shadow-emerald-500/20'
            : 'bg-slate-900/90 border-indigo-500/50 text-slate-100 shadow-indigo-500/20'
        }`}
      >
        <div className="flex items-center gap-3">
          {isError ? (
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 animate-bounce" />
          ) : isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-indigo-400 flex-shrink-0" />
          )}
          <span className="text-xs sm:text-sm font-semibold">{notificationToast.message}</span>
        </div>
        <button
          onClick={() => dispatch(clearToast())}
          className="p-1 hover:bg-slate-800/50 rounded-lg text-slate-300 transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
