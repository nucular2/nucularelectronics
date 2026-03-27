type Props = {
  className?: string;
};

export default function ChevronDown({ className }: Props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(5 8)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.227806 0.234315C0.531547 -0.0781049 1.02401 -0.0781049 1.32775 0.234315L7 6.06863L12.6723 0.234315C12.976 -0.0781049 13.4685 -0.0781049 13.7722 0.234315C14.0759 0.546734 14.0759 1.05327 13.7722 1.36569L7.54997 7.76569C7.24623 8.0781 6.75377 8.0781 6.45003 7.76569L0.227806 1.36569C-0.0759353 1.05327 -0.0759353 0.546734 0.227806 0.234315Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}
