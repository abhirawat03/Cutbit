// components/ui/Skeleton.jsx
export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-[#2a2f35] via-[#3a3f45] to-[#2a2f35] bg-[length:200%_100%] ${className}`}
    />
  );
}