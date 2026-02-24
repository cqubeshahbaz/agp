interface StarSvgProps extends React.SVGProps<SVGSVGElement> {}

const StarSvg = ({ ...props }: StarSvgProps) => {
  return (
    <div>
      <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g clipPath="url(#clip0_3045_1353)">
          <path
            d="M16.5 0C16.5 0 17.9497 8.10256 21.4236 11.5764C24.8974 15.0503 33 16.5 33 16.5C33 16.5 24.8974 17.9497 21.4236 21.4236C17.9497 24.8974 16.5 33 16.5 33C16.5 33 15.0503 24.8974 11.5764 21.4236C8.10256 17.9497 0 16.5 0 16.5C0 16.5 8.10256 15.0503 11.5764 11.5764C15.0503 8.10256 16.5 0 16.5 0Z"
            fill="black"
          />
        </g>
        <defs>
          <clipPath id="clip0_3045_1353">
            <rect width="33" height="33" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}

export default StarSvg
