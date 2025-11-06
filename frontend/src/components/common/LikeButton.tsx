import { useRef, useState } from "react";

type LikeButtonProps = {
  initialLiked?: boolean;
  initialCount?: number;
  onToggleLike?: (nextLiked: boolean) => Promise<void> | void;
  size?: number;
};

export default function LikeButton({
  initialLiked = false,
  initialCount = 0,
  onToggleLike,
  size = 28,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isBusy, setIsBusy] = useState(false);
  const bounceRef = useRef<HTMLButtonElement | null>(null);

  const toggle = async () => {
    if (isBusy) return;
    setIsBusy(true);

    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));

    bounceRef.current?.classList.remove("scale-100");
    bounceRef.current?.classList.add("scale-110");
    requestAnimationFrame(() => {
      setTimeout(() => {
        bounceRef.current?.classList.remove("scale-110");
        bounceRef.current?.classList.add("scale-100");
      }, 120);
    });

    try {
      await onToggleLike?.(nextLiked);
    } catch (e) {
      setLiked(!nextLiked);
      setCount((c) => c + (nextLiked ? -1 : 1));
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <button
      ref={bounceRef}
      type="button"
      onClick={toggle}
      disabled={isBusy}
      aria-pressed={liked}
      className={`inline-flex items-center gap-2 transition-transform duration-150 scale-100
        ${isBusy ? "opacity-80 cursor-wait" : "hover:scale-105"}
      `}
      title={liked ? "Beğenmekten vazgeç" : "Beğen"}
    >
      {/* Kalp ikonu */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        className={`transition-colors ${
          liked
            ? "fill-rose-500 stroke-rose-500"
            : "fill-transparent stroke-gray-500"
        }`}
        strokeWidth="1.8"
      >
        <path d="M12 21s-6.716-4.332-9.428-7.044C-0.14 11.38 0.178 7.7 2.7 6.02 4.73 4.68 7.42 5.07 9 6.76L12 10l3-3.24c1.58-1.69 4.27-2.08 6.3-0.74 2.52 1.68 2.84 5.36 0.13 7.936C18.716 16.668 12 21 12 21z" />
      </svg>

      <span className={`text-sm ${liked ? "text-rose-600" : "text-gray-600"}`}>
        {count}
      </span>
    </button>
  );
}
