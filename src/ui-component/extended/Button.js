import { Chip } from '@mui/material';
import { forwardRef } from 'react';
import { useTheme } from '@mui/material/styles';

const Button = forwardRef(({ children, sx, ...props }, ref) => {
  const theme = useTheme();
  return (
    <>
      <Chip
        ref={ref}
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '10px',
          transition: 'all .2s ease-in-out',
          border: 'none',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.text.base,
          '&[aria-controls="menu-list-grow"], &:hover': {
            background: `${theme.palette.primary.light}!important`,
            color: theme.palette.primary.main,
            '& svg': {
              stroke: theme.palette.primary.light,
            },
          },
          '& .MuiChip-label': {
            lineHeight: 0,
          },
          ...sx,
        }}
        {...props}
      >
        {children}
      </Chip>
    </>
  );
});

export default Button;
