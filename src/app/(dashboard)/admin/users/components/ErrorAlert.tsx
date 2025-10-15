import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props {
  error: string | null;
  onClear: () => void;
}

export default function ErrorAlert({ error, onClear }: Props) {
  if (!error) return null;

  return (
    <div className="alert alert-error">
      <ExclamationTriangleIcon className="w-6 h-6" />
      <span>{error}</span>
      <button className="btn btn-ghost btn-sm" onClick={onClear}>
        ✕
      </button>
    </div>
  );
}